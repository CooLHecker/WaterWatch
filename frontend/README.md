# WaterWatch Mumbai — Frontend

Real-time urban flood nowcasting dashboard. React + TypeScript frontend built from
`DESIGN.md` and `implementaion.md`, with **no backend** — all data comes from a mock
API layer that mirrors the endpoints planned in `implementaion.md` §23, so a real
FastAPI backend can be swapped in later without touching any component code.

## Tech stack

- **React 19 + TypeScript** — components
- **Vite** — build tool / dev server
- **Tailwind CSS v4** — styling, using the exact design tokens from `DESIGN.md`
  (colors, type scale, radii, spacing) declared in `src/index.css` via `@theme`
- **React Router v7** — client-side routing (`/`, `/predictor`, `/map`, `/route`, `/report`)
- **React Leaflet + Leaflet** — maps (matches the `React / Leaflet` stack called out
  in `implementaion.md`), tiles from CARTO's light basemap
- **Recharts** — the 0–3 hour flood depth forecast chart on the Predictor page
- **Material Symbols Outlined** — icon set, loaded via Google Fonts (matches the
  original mockup)

## Structure

```
src/
  types/           Domain types (RiskLevel, StreetForecast, RouteOption, ...)
                    mirrored from the API shape in implementaion.md §23
  data/
    mockData.ts    Mock Mumbai ward/street/route/drainage data
    api.ts         Mock "API" functions (getStreetForecasts, getSafeRoute, ...) —
                    replace these bodies with real fetch() calls when the backend
                    is ready; nothing else needs to change
  lib/
    utils.ts       cn(), risk color/label maps, formatters
  components/
    ui/            Button, Card, RiskBadge, MetricTile, Icon — design-system primitives
    layout/        Sidebar, TopBar (mobile), AppLayout, AssistantFab
    map/           BaseMap + layer components (rainfall, drainage, critical roads, alerts)
    dashboard/      Cards used on the Overview page
    predictor/      Forecast timeline chart + street table
    route/          Route comparison list
    report/         Waterlogging report form
  pages/           One component per route, composed from the above
```

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # type-checks then builds to dist/
npm run preview    # serve the production build locally
```

## Deploying to Vercel

This is a standard Vite app — Vercel autodetects it:

1. Push this repo to GitHub.
2. Import it in Vercel ("Add New Project").
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`
   (Vercel fills these in automatically).
4. Deploy.

Set `VITE_API_BASE_URL` (Vercel → this project → Settings → Environment Variables) to
the deployed backend's URL — see `../backend/README.md` — to enable live rainfall.
Leave it unset to keep using mock data for local dev without the backend running.

## Wiring up a real backend later

Every function in `src/data/api.ts` is commented with the endpoint it stands in for
(e.g. `getSafeRoute` → `POST /api/routes/safe`). `getWardTelemetry()` (rainfall) is
wired up already: it calls the real backend when `VITE_API_BASE_URL` is set, and falls
back to mock data on any error so the dashboard never breaks because of a flaky
upstream data source. The rest are still mock-only — apply the same pattern to each
as its backend endpoint is built:

1. Replace the mock-data logic in each function with a `fetch()` call to your FastAPI
   service, falling back to the mock on error like `getWardTelemetry()` does.
2. Keep the same return types (from `src/types/index.ts`) so components don't need
   changes.
3. Delete `src/data/mockData.ts` once nothing references it.

## Notes

- The AI Assistant button in the sidebar/FAB is a decorative placeholder panel — not
  wired to a real assistant.
- The Report page's "submit" simply resolves through the mock API with a fake ID; no
  data is persisted between page reloads.
- Map tiles are fetched live from CARTO/OpenStreetMap — an internet connection is
  needed to see basemap tiles, but all flood/rainfall/route data is local mock data.
