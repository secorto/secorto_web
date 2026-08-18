# @secorto/wait-netlify

Small helper package that waits for the correct Netlify deploy preview and writes the resolved URL to the GitHub Actions environment as `NETLIFY_PREVIEW_URL`.

## Purpose

This package is used to resolve a deploy preview for the current branch or commit before running end-to-end validation jobs. It is intentionally focused on the deployment lookup and not on browser or Playwright configuration.

## What it does

- Lists Netlify deploys for the target site
- Filters by branch and/or commit when possible
- Chooses the best preview URL candidate
- Writes `NETLIFY_PREVIEW_URL=<url>` to `GITHUB_ENV`

## Required environment variables

### For CI/runtime

- `NETLIFY_AUTH_TOKEN` — Netlify token with the least privilege needed
- `NETLIFY_SITE_ID` — Netlify site identifier
- `GITHUB_ENV` — GitHub Actions environment file path
- `PR_BRANCH` or `GITHUB_REF_NAME` — branch used to match preview deploys
- `COMMIT_ID` — exact commit SHA used to correlate the matching deploy

### Optional

- `GITHUB_REF` — fallback branch reference when needed
- `--debug` — increases logging for troubleshooting

## Typical usage

```bash
NETLIFY_AUTH_TOKEN=xxx \
NETLIFY_SITE_ID=yyy \
PR_BRANCH=feature/my-branch \
COMMIT_ID=abcd1234 \
GITHUB_ENV=/tmp/env \
node packages/wait-netlify/src/wait-netlify-runner.js
```

This writes a line such as:

```bash
NETLIFY_PREVIEW_URL=https://branch--site.netlify.app
```

## Matching behavior

The helper tries to find the most relevant preview deploy by comparing the current branch/commit against Netlify deploy metadata. For PR-like runs, `COMMIT_ID` is strongly recommended to avoid matching the wrong deploy.

For default branch runs, it can also accept production deploys when appropriate.

## Security notes

- Keep the token in GitHub Secrets
- Avoid echoing secrets in logs
- Use the least-privilege scope available for Netlify

## Related documentation

For the broader E2E runtime variables used by Playwright and the project test workflow, see:

- [../../docs/architecture/E2E_PARAMS.md](../../docs/architecture/E2E_PARAMS.md)

That document covers test-runner concerns such as `BASE_URL`, `REAL_THIRD_PARTY`, and the A11y opt-in flags. This package only resolves the preview URL used by those tests.
