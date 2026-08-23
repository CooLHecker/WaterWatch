"""
Environment-driven configuration. Nothing secret lives in this file —
set these as Environment Variables in the Vercel project (Settings →
Environment Variables), not in code, and never commit a populated .env.
"""

import os

# NASA Earthdata Login bearer token. Required for GES DISC OPeNDAP access.
EARTHDATA_TOKEN = os.environ.get("EARTHDATA_TOKEN", "")

# Comma-separated list of origins allowed to call this API, e.g.
# "https://waterwatch.vercel.app,http://localhost:5173"
# Defaults to "*" for initial setup — tighten this once the frontend
# domain is known.
FRONTEND_ORIGINS = [
    o.strip() for o in os.environ.get("FRONTEND_ORIGINS", "*").split(",") if o.strip()
]

# How long a successful rainfall reading is reused before re-fetching,
# to avoid hammering GES DISC on every dashboard refresh.
CACHE_TTL_SECONDS = int(os.environ.get("RAINFALL_CACHE_TTL_SECONDS", "600"))

# IMERG "Early Run" — the near-real-time product (~4h typical latency).
# The "Final Run" (GPM_3IMERGHH, no E/L suffix) is research-grade with
# ~3.5 month latency and is NOT suitable for "current" conditions.
IMERG_COLLECTION = os.environ.get("IMERG_COLLECTION", "GPM_3IMERGHHE.07")
IMERG_BASE_URL = os.environ.get(
    "IMERG_BASE_URL", "https://gpm1.gesdisc.eosdis.nasa.gov/opendap/GPM_L3"
)
