# my-audit-code

Audit Code — paste a JavaScript snippet and get a static review: a health score, severity
counts, and a per-line list of findings (hardcoded credentials, `eval`, `innerHTML` writes,
concatenated queries, empty catches, `==`, `var`, leftover logging, TODOs).

Everything runs client-side. There is no backend, no database, and no external service, so
no credentials are needed.

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

The app is served on <http://localhost:3000>. Dependencies install from `package-lock.json`
into a named `node_modules` volume on container start, so repo edits hot-reload with no rebuild.

Without Docker:

```bash
npm ci
npm run dev
```

## Project layout

```
src/App.jsx                 page shell, audit state
src/components/CodeInput.jsx  editor (line gutter, Ctrl/⌘+Enter to run)
src/components/ScoreCard.jsx  score ring, grade, severity totals
src/components/FindingList.jsx findings list + severity filter
src/lib/audit.js            rule engine (regex rules, scoring, grading)
src/lib/sample.js           sample snippet used by "Load sample"
```

Adding a check means adding one entry to `RULES` in `src/lib/audit.js` — title, severity,
category, pattern, message.

## Notes for running in the Base44 sandbox

- `docker-compose.base44.yml` runs `node:22-bookworm` with the repo bind-mounted and Vite in
  dev mode, so edits are visible without rebuilding.
- The preview proxy forwards a non-localhost `Host`, so `vite.config.js` adds the sandbox host
  wildcard to `allowedHosts` — only when `BASE44_PREVIEW_MODE` is exactly `"1"`. With the flag
  unset, `allowedHosts` stays at Vite's default (localhost only).
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is also passed through for the preview host.
- Health check: `node -e "fetch('http://localhost:3000/')"` — the node image has no curl.
