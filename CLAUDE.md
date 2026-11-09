# Toolshop E2E Test Suite — project rules for Claude Code

## What this is

A professional test automation portfolio project: UI end-to-end tests and API tests for the
Toolshop demo shop (https://practicesoftwaretesting.com, open source:
github.com/testsmith-io/practice-software-testing). The site exists for test practice.

The point is not "many tests" but showing how a QA engineer thinks: a written test strategy,
risk-based choice of what to automate, clean structure, stable tests, and honest reporting.
It targets QA / Test Automation job requirements: Playwright, TypeScript, API testing,
CI/CD (GitHub Actions + Azure DevOps Pipelines), Jira-style test cases.

## Stack

- TypeScript + Playwright Test (@playwright/test), Node LTS
- Page Object Model for UI; Playwright `request` fixture for API tests
- ESLint + Prettier
- GitHub Actions CI; Azure DevOps Pipelines YAML (second CI, see Day 5)
- Everything free. No paid services, no paid cloud.

## Rules (always follow)

1. Small steps: one feature per step, then stop and explain in plain English what changed.
   I review every pull request. Work on a branch, open a PR, never push to main.
2. Run the full test suite (and lint) before saying a step is done. Report pass/fail counts.
3. Stable tests only: no fixed sleeps (`waitForTimeout`), use web-first assertions and
   role/label/test-id locators. A test that fails randomly is a bug to fix, not to retry away.
   Retries in CI max 1, and every retry that happened must show in the report.
4. Be a good guest on the public site: small suite, workers ≤ 2, no load testing,
   no scraping, CI on push/PR plus at most one scheduled run per day.
5. Test data: create what a test needs through the API, never depend on another test's data.
   Use only the site's documented demo accounts. No real personal data anywhere.
6. Secrets only via environment variables / CI secrets. Never commit passwords or tokens,
   even demo ones if the site asks to keep them private. `.env` is git-ignored.
7. Every automated test traces to a test case ID in `docs/test-cases.md` (e.g. TC-CART-03).
8. Honest docs: README says what is covered, what is not, known flaky areas and why.
9. At the end of every session, update `PROGRESS.md` (done / next / open questions).

## Commands (add as they appear)

- `npm test` — all tests
- `npm run test:ui` / `npm run test:api` — by project/tag
- `npm run report` — open the HTML report
- `npm run lint`
