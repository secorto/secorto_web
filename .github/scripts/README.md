wait-netlify.js

Purpose

This small script polls the Netlify Deploys API for a deploy-preview matching the PR branch and writes the preview URL to the GitHub Actions environment file (`GITHUB_ENV`) as `NETLIFY_PREVIEW_URL`.

Why we use it

- Avoids installing `jq` via `apt-get` in the workflow
- Keeps the polling logic visible and auditable in the repo
- Easy to debug locally

Required environment variables (in CI)

- `NETLIFY_AUTH_TOKEN` — Netlify token (least privilege)
- `NETLIFY_SITE_ID` — Netlify site id
- `PR_BRANCH` — the PR branch name (e.g. `github.head_ref`)
- `GITHUB_ENV` — path to the GitHub Actions environment file (provided by the runner)

Usage (in workflow)

- The workflow should call:

  node .github/scripts/wait-netlify.js

Options (CLI)

- `--attempts=<n>` — number of polling attempts (default 30)
- `--delay=<ms>` — delay between attempts in ms (default 10000)
- `--debug` — enable verbose logging
- `--print-only` — print the URL to stdout instead of writing `GITHUB_ENV` (useful for local debugging)

Local debugging example

```bash
NETLIFY_AUTH_TOKEN=xxx NETLIFY_SITE_ID=yyy PR_BRANCH=feature/abc node .github/scripts/wait-netlify.js --debug --attempts=5
```

Security notes

- Pin the Netlify token to the least required scope and store it in GitHub Secrets
- The script avoids printing secrets; enable `--debug` to increase logging but don't pass secrets to public logs

Maintenance

- If Node in the runner lacks `fetch`, the script will ask for `node-fetch` or Node 18+
- Keep the script small and review changes when modifying polling behaviour

Note on `NETLIFY_PREVIEW_URL` vs `BASE_URL`

- We prefer `NETLIFY_PREVIEW_URL` for PR runs because it's the exact preview deploy URL produced by Netlify. Keep `BASE_URL` as a manual override for staging/production/local testing. The workflow and `playwright.config.ts` already use the precedence: `NETLIFY_PREVIEW_URL || BASE_URL || http://localhost:4321`.
