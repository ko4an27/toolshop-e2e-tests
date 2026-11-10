# Toolshop E2E Tests

[![Playwright tests](https://github.com/ko4an27/toolshop-e2e-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/ko4an27/toolshop-e2e-tests/actions/workflows/playwright.yml)

UI end-to-end and API tests for the [Toolshop](https://practicesoftwaretesting.com) demo shop
(open source: [testsmith-io/practice-software-testing](https://github.com/testsmith-io/practice-software-testing)),
written with **Playwright + TypeScript**.

> Status: **Day 2 — test strategy and test cases written.** Page objects, more UI tests and API
> tests come in later steps (see [PROGRESS.md](PROGRESS.md)).

## Documentation

- [Test strategy](docs/test-strategy.md) — scope, risks, what is automated and why, what stays
  manual, test levels, environments, entry/exit criteria
- [Test cases](docs/test-cases.md) — 25 cases with IDs, priority, steps, expected result and an
  automate yes/no decision with a reason

## Quick start

Requires Node 22+.

```bash
npm ci
npx playwright install chromium
npm test            # all tests
npm run test:ui     # UI tests only
npm run test:smoke  # tests tagged @smoke
npm run report      # open the last HTML report
npm run lint        # ESLint + Prettier check
npm run typecheck   # TypeScript, no emit
```

Optional: copy `.env.example` to `.env` to point the suite at another instance (`BASE_URL`).

## What is covered (so far)

| ID          | Test                                          | Type      |
| ----------- | --------------------------------------------- | --------- |
| TC-SMOKE-01 | Home page loads and shows products            | UI, smoke |
| TC-SMOKE-02 | Product search returns only matching products | UI, smoke |

Not covered yet: login, filters, product page, cart, checkout, API tests, cross-browser.
The full plan (25 cases, 22 to automate) is in [docs/test-cases.md](docs/test-cases.md).

## Design choices

- **Good guest on a public site:** `workers: 2`, a small suite, no load testing.
- **Stable tests:** web-first assertions and role / label / `data-test` locators only.
  No fixed sleeps; ESLint fails the build on `waitForTimeout`, `force: true` and `networkidle`.
- **Honest retries:** at most 1 retry, and only in CI. Retried tests show as _flaky_ in the HTML report.
- **CI:** GitHub Actions runs lint, type-check and tests on every pull request and on push to
  `main`. The HTML report is uploaded as the `playwright-report` artifact, with traces and
  screenshots for failed tests.

## Known issues / lessons

- The search grid re-renders _after_ the "Searched for" caption appears. Reading the product list
  right after the caption gives stale home-page products. The test waits for the
  `/products/search` response and then uses retrying assertions.
- The app calls the search endpoint with the HTTP `QUERY` method, not `GET`, so request matching
  is done on the URL path only.
