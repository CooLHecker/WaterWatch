# WaterWatch Mumbai — Backend

FastAPI backend, deployed as its own Vercel project (Python serverless
functions). Currently implements one real feature: live rainfall via
NASA GPM IMERG (GES DISC OPeNDAP), matching the `WardTelemetry[]` shape
the frontend already expects (`src/types/index.ts`, and the
`getWardTelemetry()` stub in `src/data/api.ts`).

## Endpoints

- `GET /api/health` — liveness check.
- `GET /api/rainfall/current` — current rainfall per Mumbai ward.
  Returns `{ updatedAt, source, granuleTime, wards: WardTelemetry[] }`,
  where `source` is `"live"`, `"cache"`, or `"fallback"` so the frontend
  can show a "using cached/last-known data" note if it's not live.
- `GET /api/rainfall/debug` — **use this first.** Walks through the same
  granule lookup the real endpoint uses and returns the exact OPeNDAP
  URL it built plus the raw parsed grid (or every attempt's error). See
  "Verifying the IMERG integration" below.

## Local setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # or your preferred env tool
pip install -r requirements.txt
cp .env.example .env      # then fill in EARTHDATA_TOKEN
uvicorn api.index:app --reload --port 8000
```

Visit `http://localhost:8000/api/rainfall/debug` first.

## Verifying the IMERG integration (important — read this)

I wrote the GES DISC/OPeNDAP integration (`api/imerg.py`) without being
able to make live network calls, so two specific details are my best
understanding of IMERG/OPeNDAP conventions rather than something I
confirmed against a real response:

1. **Dimension order.** IMERG's `precipitation` variable is stored as
   `(time, lon, lat)` — swapped from the more common `(time, lat, lon)`.
   The code assumes this. If `/api/rainfall/debug`'s `sample_values`
   look wrong for wards you can sanity-check (e.g. a ward you know is
   getting heavy rain shows near-zero), this is the first thing to flip.
2. **ASCII response parsing.** `_parse_ascii_grid()` in `imerg.py` uses
   a permissive regex to pull every float out of the response body,
   which should tolerate minor formatting differences between Hyrax
   server versions — but confirm `grid_shape` in the debug response
   matches the bounding box you'd expect (12 wards → a small grid, a
   few cells wide/tall).

Both are called out in detail in the docstring at the top of
`api/imerg.py`. If something's off, that file is the only one you
should need to touch.

 local frontend dev still works without the backend
running.
