"""
GPM IMERG (Early Run) rainfall data via NASA GES DISC OPeNDAP.

WHAT THIS DOES
---------------
1. Works out which half-hourly IMERG granule should be the most recent
   one published (Early Run typically lands ~4 hours after the
   observation window, but this varies — so it tries several,
   stepping backwards until one exists).
2. Builds an OPeNDAP ASCII subset request for the small lat/lon
   bounding box around Mumbai's wards, authenticated with the
   Earthdata Login bearer token.
3. Parses the returned grid and samples the nearest cell to each
   ward's coordinates.
4. Never lets a live-fetch failure break the endpoint — falls back to
   the last successful reading, then to static zeros, always returning
   a valid response shape.

TWO THINGS I COULD NOT VERIFY LIVE
------------------------------------
This environment has no outbound network access, so I could not test
an actual authenticated call to GES DISC while writing this. Everything
below is correct to the best of my knowledge of the IMERG/OPeNDAP
conventions, but there are two specific details worth confirming
yourself the first time you run this against the real API — hit
GET /api/rainfall/debug (defined in index.py) and compare against what
it reports:

  1. Dimension order. IMERG grids are stored unusually as
     (time, lon, lat) rather than the more common (time, lat, hin).
     GRID_DIM_ORDER assumes (lon, lat). If sampled values look wrong
     for specific wards (e.g. consistently swapped), the order is the
     first thing to check.
  2. ASCII response parsing. OPeNDAP's Hyrax server returns a text
     header followed by the data; the exact layout varies slightly by
     server version. _parse_ascii_grid() uses a permissive regex that
     pulls out every float in the body — robust to minor formatting
     differences, but confirm the reshaped grid actually matches what
     /api/rainfall/debug shows for grid_shape and sample_values.
"""

import logging
import math
import re
import time
from datetime import datetime, timedelta, timezone

import requests

from .config import CACHE_TTL_SECONDS, EARTHDATA_TOKEN, IMERG_BASE_URL, IMERG_COLLECTION
from .wards import WARDS

logger = logging.getLogger("imerg")

GRID_RESOLUTION = 0.1  # degrees, IMERG's native grid spacing

# In-memory cache. Persists across "warm" invocations of the same
# serverless instance and resets on cold start — good enough to avoid
# re-fetching on every dashboard refresh without needing a real cache
# service yet.
_cache: dict = {"data": None, "fetched_at": 0.0, "granule_time": None}


def _lon_to_index(lon: float) -> int:
    return math.floor((lon + 180) / GRID_RESOLUTION)


def _lat_to_index(lat: float) -> int:
    return math.floor((lat + 90) / GRID_RESOLUTION)


def _latest_candidate_granules(max_back_hours: int = 8):
    """
    Yields candidate granule datetimes (30-minute windows), most recent
    plausible first, stepping backwards. Starts 4 hours back from now
    since Early Run typically isn't published before then.
    """
    now = datetime.now(timezone.utc)
    minute = 0 if now.minute < 30 else 30
    start = now.replace(minute=minute, second=0, microsecond=0) - timedelta(hours=4)
    for i in range(max_back_hours * 2):
        yield start - timedelta(minutes=30 * i)


def _granule_url(granule_time: datetime) -> str:
    """
    OPeNDAP path for a GPM_3IMERGHHE.07 (Early Run) granule.

    Filename: 3B-HHR-E.MS.MRG.3IMERG.YYYYMMDD-SHHMMSS-EHHMMSS.MMMM.V07B.HDF5
      S/E = start/end of the 30-minute window (HHMMSS)
      MMMM = minutes since start of day for the window start
    """
    day_of_year = granule_time.timetuple().tm_yday
    end_time = granule_time + timedelta(minutes=29, seconds=59)
    minute_of_day = granule_time.hour * 60 + granule_time.minute

    yyyymmdd = granule_time.strftime("%Y%m%d")
    s = granule_time.strftime("%H%M%S")
    e = end_time.strftime("%H%M%S")

    filename = f"3B-HHR-E.MS.MRG.3IMERG.{yyyymmdd}-S{s}-E{e}.{minute_of_day:04d}.V07B.HDF5"
    return f"{IMERG_BASE_URL}/{IMERG_COLLECTION}/{granule_time.year}/{day_of_year:03d}/{filename}"


def _bounding_box_indices():
    lats = [w["lat"] for w in WARDS]
    lngs = [w["lng"] for w in WARDS]
    lat_lo, lat_hi = _lat_to_index(min(lats) - 0.15), _lat_to_index(max(lats) + 0.15)
    lon_lo, lon_hi = _lon_to_index(min(lngs) - 0.15), _lon_to_index(max(lngs) + 0.15)
    return lon_lo, lon_hi, lat_lo, lat_hi


def _parse_ascii_grid(text: str, n_lon: int, n_lat: int):
    body = text.split("\n", 1)[1] if "\n" in text else text
    numbers = [float(n) for n in re.findall(r"-?\d+\.?\d*(?:[eE]-?\d+)?", body)]
    expected = n_lon * n_lat
    if len(numbers) < expected:
        raise ValueError(
            f"Expected at least {expected} values in IMERG ASCII response, got {len(numbers)}"
        )
    grid = numbers[:expected]
    return [grid[i * n_lat : (i + 1) * n_lat] for i in range(n_lon)]


def _fetch_granule_grid(granule_time: datetime):
    """Returns None if this granule isn't published yet (404), raises on other errors."""
    lon_lo, lon_hi, lat_lo, lat_hi = _bounding_box_indices()
    base_url = _granule_url(granule_time)
    subset_url = f"{base_url}.ascii?precipitation[0:0][{lon_lo}:{lon_hi}][{lat_lo}:{lat_hi}]"

    resp = requests.get(
        subset_url,
        headers={"Authorization": f"Bearer {EARTHDATA_TOKEN}"},
        timeout=20,
    )
    if resp.status_code == 404:
        return None
    resp.raise_for_status()

    values = _parse_ascii_grid(resp.text, lon_hi - lon_lo + 1, lat_hi - lat_lo + 1)
    return {"values": values, "lon_lo": lon_lo, "lat_lo": lat_lo, "raw_url": subset_url}


def _sample_ward(grid_info: dict, lat: float, lng: float) -> float:
    lon_idx = _lon_to_index(lng) - grid_info["lon_lo"]
    lat_idx = _lat_to_index(lat) - grid_info["lat_lo"]
    values = grid_info["values"]
    lon_idx = min(max(lon_idx, 0), len(values) - 1)
    lat_idx = min(max(lat_idx, 0), len(values[0]) - 1)
    mm_per_hr = values[lon_idx][lat_idx]
    # IMERG uses -9999.9 as a "no data" fill value
    return max(mm_per_hr, 0.0) if mm_per_hr > -100 else 0.0


def classify_intensity(mm_hr: float) -> str:
    """
    Rough thresholds loosely modelled on IMD rainfall-rate categories.
    Tune these once you have a feel for real Mumbai monsoon values.
    """
    if mm_hr < 7.5:
        return "low"
    if mm_hr < 16:
        return "moderate"
    if mm_hr < 36:
        return "high"
    return "extreme"


def get_live_rainfall():
    """Returns (wards_list, granule_time_iso). Raises if every candidate granule fails."""
    if not EARTHDATA_TOKEN:
        raise RuntimeError("EARTHDATA_TOKEN is not set")

    last_error = None
    for granule_time in _latest_candidate_granules():
        try:
            grid_info = _fetch_granule_grid(granule_time)
        except requests.RequestException as exc:
            last_error = exc
            logger.warning("IMERG fetch failed for %s: %s", granule_time, exc)
            continue

        if grid_info is None:
            continue  # not published yet — try an earlier granule

        wards_out = []
        for w in WARDS:
            mm_hr = round(_sample_ward(grid_info, w["lat"], w["lng"]), 2)
            wards_out.append(
                {
                    "id": w["id"],
                    "name": w["name"],
                    "lat": w["lat"],
                    "lng": w["lng"],
                    "precipitationMmHr": mm_hr,
                    "intensity": classify_intensity(mm_hr),
                }
            )
        return wards_out, granule_time.isoformat()

    raise RuntimeError(f"No IMERG granule available in lookback window (last error: {last_error})")


def get_ward_rainfall(force_refresh: bool = False):
    """Cached entry point for the /api/rainfall/current route. Returns (wards, source, granule_time)."""
    now = time.time()
    if (
        not force_refresh
        and _cache["data"] is not None
        and now - _cache["fetched_at"] < CACHE_TTL_SECONDS
    ):
        return _cache["data"], "cache", _cache["granule_time"]

    try:
        wards, granule_time = get_live_rainfall()
        _cache.update({"data": wards, "fetched_at": now, "granule_time": granule_time})
        return wards, "live", granule_time
    except Exception as exc:  # noqa: BLE001 — deliberately broad: never break the dashboard
        logger.error("Falling back to cached/static rainfall data: %s", exc)
        if _cache["data"] is not None:
            return _cache["data"], "fallback", _cache["granule_time"]
        fallback = [
            {**w, "precipitationMmHr": 0.0, "intensity": "low"} for w in WARDS
        ]
        return fallback, "fallback", None
