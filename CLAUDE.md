# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

IEG is a React + Vite SPA (Italian-language UI) for managing energy-supply back-office data: clients (Clienti), supply points (Forniture/POD), meter readings (Letture), charges (Oneri), and dispatching. It's a thin CRUD frontend over a REST API — most components fetch/post directly with axios rather than going through a service layer.

## Commands

Package manager is **pnpm** (see `pnpm-workspace.yaml` / `pnpm-lock.yaml`) — use `pnpm`, not `npm`/`yarn`.

- `pnpm install` — install dependencies
- `pnpm dev` — start Vite dev server
- `pnpm build` — production build
- `pnpm preview` — preview the production build
- `pnpm lint` — ESLint over `.js`/`.jsx`, zero warnings allowed (`--max-warnings 0`)

There is no test suite/runner configured in this repo.

Note: there are two overlapping ESLint configs present — legacy `.eslintrc.cjs` (eslintrc format, what the `lint` script's `--ext js,jsx` flag implies) and flat-config `eslint.config.js`. Check which one is actually active with the installed ESLint version before relying on lint output.

## Environment

Config is via Vite env vars, read as `import.meta.env.VITE_*` in code:
- `VITE_REACT_APP_API_URL` — backend API base URL (e.g. `http://localhost:8080/api`)
- `VITE_REACT_APP_URL` — backend base URL used for auth (e.g. login posts to `${VITE_REACT_APP_URL}/auth/login`)
- `VITE_REACT_APP_PERSIST_KEY` — secret key used to encrypt the redux-persist store (see below)

`.env.local` in this repo has real-looking values checked in (including a JWT and a persist key) — treat this repo's env file as already-compromised/dev-only, don't assume it's safe to reuse elsewhere.

## Architecture

**Routing** (`src/App.jsx`): all routes and every modal are mounted together at the top level inside a single `BrowserRouter`. `TopBar` and `BottomBar` are rendered outside `<Routes>` so they persist across pages. Adding a new page means adding both a `<Route>` in `App.jsx` and a nav link in `TopBar.jsx`; adding a new modal means mounting it in `App.jsx` alongside the others.

**State (Redux, `src/redux/`)**: classic (non-RTK-slice) Redux with plain action-type constants, action creators, and switch-based reducers — despite `@reduxjs/toolkit` being a dependency, `configureStore` is used but slices are not.
- `redux/actions/index.js` — single file with all action type constants, action creators, and one async thunk (`loginAction`, uses `axios` directly and dispatches `setTokenAction` on success).
- `redux/reducers/auth.js` — token/user/auth/loading/error state.
- `redux/reducers/modal.js` — pure UI state: one `showX/deleteXId` triplet per entity (Lettura, Oneri, Dispacciamento, Cliente, Fornitura) controlling modal visibility and which record id is being edited/deleted. This is the mechanism the whole CRUD UI is built on — see "Modal-driven CRUD" below.
- `redux/store/index.js` — store is wrapped in `redux-persist`, persisted to `storage` (localStorage) and **encrypted** via `redux-persist-transform-encrypt` using `VITE_REACT_APP_PERSIST_KEY`. `serializableCheck` is disabled.

**Auth**: no route guards/PrivateRoute wrapper. Each page component individually does `useEffect(() => { if (!token) navigate("/login") }, [token])`. The JWT is read from Redux (`state.auth.token`) and manually attached as `Authorization: Bearer <token>` on every axios call — there is no shared axios instance/interceptor, so every fetch/post site repeats the header boilerplate.

**Modal-driven CRUD pattern**: this is the core repeated pattern across the app, followed consistently for every entity (Cliente, Fornitura, Lettura, Oneri, Dispacciamento):
1. A list page (e.g. `Letture.jsx`) renders an `AgGridReact` grid and a "Aggiungi X" button that dispatches `showAddXModalAction()` (no id = create).
2. A cell renderer component (`cellComponents/XPod.jsx` / `XTipo.jsx`) renders per-row edit/delete buttons that dispatch `showAddXModalAction(id)` / `showDeleteXModalAction(id)`.
3. `modals/AddXModal.jsx` reads `showAddXModal`/`modXId` from Redux; if `modXId` is set it GETs and PUTs (edit), otherwise it POSTs (create) — same modal component handles both add and edit.
4. `modals/DeleteXModal.jsx` similarly reads `showDeleteXModal`/`deleteXId` and issues a DELETE.
5. The list page's data-fetch `useEffect` depends on `showAddXModal`/`showDeleteXModal` so closing a modal (via the reducer setting it back to `false`) triggers a refetch — there is no explicit "refresh" call, the list just re-fetches whenever a modal is hidden.

When adding a new entity's CRUD, replicate this exact five-piece pattern (action types + actions, modal reducer fields, list page, cell renderer, add/delete modals) rather than introducing a different data-fetching approach.

**Grids**: all list views use `ag-grid-react` (`AgGridReact`) with the `ag-theme-quartz-dark` theme class, `autoSizeStrategy={{ type: "fitCellContents" }}`, and numeric columns formatted via `valueFormatter` using `toLocaleString("it-IT")`. `Letture.jsx` additionally shows the pattern for grid-level filtering from a route param (`useParams` → `gridApi.getFilterInstance(...).setModel(...)`).

**Styling**: Bootstrap 5 + `react-bootstrap`, dark theme forced via `data-bs-theme="dark"` on `<html>` in `index.html`. Custom Sass in `src/scss/main.scss` / `_overrides.scss`; Vite is configured (`vite.config.js`) to auto-inject Bootstrap's Sass `functions`/`mixins` into every SCSS file via `additionalData`, so custom `.scss` files can use Bootstrap mixins without importing them manually.

**Language**: all UI copy, form labels, and most identifiers (component/prop/field names like `lettura`, `fornitura`, `cliente`, `raccolta`) are in Italian, matching backend field names directly (e.g. grid `field:` values map 1:1 to API JSON fields like `dataLettura`, `tipoContatore`, `eaF1`). Keep new UI text and field names in Italian/consistent with backend naming rather than translating to English.
