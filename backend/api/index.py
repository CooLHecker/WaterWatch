import logging
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import EARTHDATA_TOKEN, FRONTEND_ORIGINS
from .imerg import _fetch_granule_grid, _granule_url, _latest_candidate_granules, get_ward_rainfall

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="WaterWatch Mumbai API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


@app.get("/api/rainfall/current")
def rainfall_current():
    """Mirrors the frontend's WardTelemetry[] shape (src/types/index.ts)."""
    wards, source, granule_time = get_ward_rainfall()
    return {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "source": source,  # "live" | "cache" | "fallback"
        "granuleTime": granule_time,
        "wards": wards,
    }


@app.get("/api/rainfall/debug")
def rainfall_debug():
    """
    Diagnostic endpoint — walks through the same candidate granules the
    real endpoint would try, and returns the constructed URL plus the
    raw parsed grid for the first one that succeeds (or every attempt's
    error, if none did). Use this to confirm the OPeNDAP request/parsing
    logic against a real response the first time you run this live —
    see the module docstring in imerg.py for the two things to check.
    """
    if not EARTHDATA_TOKEN:
        raise HTTPException(500, "EARTHDATA_TOKEN is not set")

    attempts = []
    for granule_time in _latest_candidate_granules(max_back_hours=2):
        url = _granule_url(granule_time)
        try:
            grid_info = _fetch_granule_grid(granule_time)
        except Exception as exc:  # noqa: BLE001 — surface any failure for debugging
            attempts.append({"granule_time": granule_time.isoformat(), "url": url, "error": str(exc)})
            continue

        if grid_info is None:
            attempts.append(
                {"granule_time": granule_time.isoformat(), "url": url, "status": "404 not published"}
            )
            continue

        return {
            "granule_time": granule_time.isoformat(),
            "url": grid_info["raw_url"],
            "grid_shape": [len(grid_info["values"]), len(grid_info["values"][0])],
            "sample_values": grid_info["values"][0][:5],
            "earlier_attempts": attempts,
        }

    return {"attempts": attempts, "note": "No granule succeeded in the lookback window"}
