# AGENTS.md — my-audit-code

## What this app is

A single-page Vite + React app. **No backend, no database, no external services, no secrets.**
The entire audit lives in `src/lib/audit.js` (regex rules → findings → score/grade).

## Running it here

```bash
docker compose -f docker-compose.base44.yml up -d
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/   # expect 200
```

- One service, `web`, from `node:22-bookworm`, running `vite` in dev mode with the repo
  bind-mounted at `/app`. Edits hot-reload; no rebuild needed for source changes.
- `npm ci` runs on container start against the named `node_modules` volume, so **commit
  `package-lock.json` whenever dependencies change** or the startup install will drift.
- Health check uses `node -e "fetch(...)"` because the node image has no `curl`/`wget`.

## Non-obvious quirks

- The preview proxy sends a non-localhost `Host`. `vite.config.js` adds `.${BASE44_SANDBOX_HOST_DOMAIN}`
  and `3000-${BASE44_PUBLIC_HOST_SUFFIX}` to `server.allowedHosts` **only when
  `BASE44_PREVIEW_MODE === "1"`**; with the flag unset, Vite keeps its localhost-only default.
  Do not widen it to `true` or `*`.
- The `node_modules` volume must not be deleted to "refresh" dependencies — that discards the
  install the running dev server is using. Change `package.json` + lockfile instead.

## Verifying a change

Load `http://localhost:3000/`, click **Load sample** → expect score 21, grade F, 9 findings
(4 high / 1 medium / 4 low). Filter chips narrow the list. Pasting `const a = 1;` and hitting
**Run audit** should give 100 / grade A / "Nothing flagged". No console errors.
