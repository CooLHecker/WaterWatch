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

## Deploying to Vercel

This repo has the frontend and backend as separate Vercel projects
pointing at different Root Directories in the same GitHub repo:

1. In Vercel, **Add New Project** → import the same repo again (a
   second project, separate from the frontend one).
2. Set **Root Directory** to `backend`.
3. Framework Preset: **Other** (this is a plain `@vercel/python`
   function, not a framework Vercel auto-detects).
4. Add Environment Variables (Settings → Environment Variables):
   - `EARTHDATA_TOKEN` — your NASA Earthdata Login bearer token.
   - `FRONTEND_ORIGINS` — your frontend's deployed URL, e.g.
     `https://your-frontend.vercel.app,http://localhost:5173`
   - Leave `RAINFALL_CACHE_TTL_SECONDS` / `IMERG_COLLECTION` /
     `IMERG_BASE_URL` unset unless you need to override the defaults.
5. Deploy. Test `https://your-backend.vercel.app/api/rainfall/debug`
   first, then `/api/rainfall/current`.

**Rotate the Earthdata token before or right after this**, since it was
shared in plaintext in chat — generate a fresh one at
https://urs.earthdata.nasa.gov (Applications → Earthdata Login →
Generate Token) and use that instead.

## Wiring the frontend to this

In the frontend project, set `VITE_API_BASE_URL` to this backend's
deployed URL (Vercel → frontend project → Settings → Environment
Variables). `src/data/api.ts`'s `getWardTelemetry()` now calls this
endpoint when that variable is set, and falls back to local mock data
otherwise — so local frontend dev still works without the backend
running.
