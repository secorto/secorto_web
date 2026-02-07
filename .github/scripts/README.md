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
- `GITHUB_ENV` — path to the GitHub Actions environment file (provided by the runner)
- `PR_BRANCH` or `GITHUB_REF_NAME` — branch name used for deploy matching

Optional but important for PR runs:

- `COMMIT_ID` — commit SHA for the PR head or the push. The workflow should set this (use `github.event.pull_request.head.sha` for PRs or `github.sha` for pushes). The script uses this to match Netlify deploys to the exact commit; without it the script will not consider a deploy as matching and will eventually time out.

Usage (in workflow)

- The workflow should call:

  node .github/scripts/wait-netlify.js

Local debugging

Export the required env vars and run locally. For PR-like behavior export `PR_BRANCH` and `COMMIT_ID`:

```bash
NETLIFY_AUTH_TOKEN=xxx NETLIFY_SITE_ID=yyy PR_BRANCH=feature/abc COMMIT_ID=abcd1234 GITHUB_ENV=/tmp/env node .github/scripts/wait-netlify.js
```

Security notes

- Pin the Netlify token to the least required scope and store it in GitHub Secrets
- The script avoids printing secrets; enable `--debug` to increase logging but don't pass secrets to public logs

Maintenance

- If Node in the runner lacks `fetch`, the script will ask for `node-fetch` or Node 18+
- Keep the script small and review changes when modifying polling behaviour

Note on `NETLIFY_PREVIEW_URL` vs `BASE_URL`

- We prefer `NETLIFY_PREVIEW_URL` for PR runs because it's the exact preview deploy URL produced by Netlify. Keep `BASE_URL` as a manual override for staging/production/local testing. The workflow and `playwright.config.ts` already use the precedence: `NETLIFY_PREVIEW_URL || BASE_URL || http://localhost:4321`.

Note on PR vs main/master runs

- The script detects the branch from `PR_BRANCH` (recommended for PR workflows) or from `GITHUB_REF_NAME`/`GITHUB_REF` for non-PR runs.
- For branches other than `main`/`master` the script searches `deploy-preview` deploys matching the branch.
- When running on `main` or `master`, the script accepts `production` deploys (Netlify may omit `branch` on production deploy objects). This enables the workflow to resolve a usable `NETLIFY_PREVIEW_URL` when testing the default branch without special-casing or skipping validations.
- To override behavior, pass `--context=production` or set `NETLIFY_DEPLOY_CONTEXT` in the environment.
