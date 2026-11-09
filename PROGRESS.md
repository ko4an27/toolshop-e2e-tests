# Progress

Goal: third portfolio project — Playwright + TypeScript E2E and API tests with CI on GitHub
Actions and Azure DevOps (skills often asked for in QA / test automation roles).

## Plan (one step = one PR, 45-minute blocks)

- [x] Day 1 — setup: Playwright + TS, lint, first smoke test (home page loads, search works),
      GitHub Actions running tests on every PR, HTML report as CI artifact
- [x] Day 2 — `docs/test-strategy.md` (scope, risks, what to automate and why, what stays
      manual) + `docs/test-cases.md` (15–25 cases with IDs, priority, steps, expected result)
- [ ] Day 3 — Page Objects + UI tests for the top-risk flows: login, search/filter,
      product page, cart, checkout (happy path + key negative cases)
- [ ] Day 4 — API tests: auth, products, cart/invoices; contract checks on response shape;
      UI tests get their test data through the API
- [ ] Day 5 — Azure DevOps Pipelines (azure-pipelines.yml, free tier) running the same suite
      and publishing results; cross-browser (Chromium + Firefox + WebKit, mobile viewport)
- [ ] Day 6 — reliability: run the suite 10× in CI, record flaky tests and fix causes;
      accessibility smoke check (axe); README with results, coverage map, limitations, demo GIF
- [ ] LinkedIn post about the project

## Done

- **Day 1 (branch `day-1-setup`):** Playwright 1.63 + TypeScript, ESLint (with
  eslint-plugin-playwright stability rules) + Prettier, `tsc` type-check, 2 smoke tests
  (TC-SMOKE-01 home page, TC-SMOKE-02 search). GitHub Actions on PR / push to main, HTML report
  uploaded as an artifact. Local result: 2/2 passed; 10/10 passed with `--repeat-each=5`.
  - Found and fixed a race in the search test (stale product grid after the caption appears;
    the search API uses the HTTP `QUERY` method).

- **Day 2 (branch `day-2-docs`):** `docs/test-strategy.md` (scope, risk matrix R1–R8, test
  levels, automate/manual rules, test data, environments, entry/exit criteria) and
  `docs/test-cases.md` (25 cases: 12 P1, 10 P2, 3 P3; 22 to automate, 3 manual with reasons).
  TC-SMOKE-01/02 match the existing tests. Docs only, no test changes.

## Next

- Day 3: Page Objects + UI tests for the P1/P2 UI cases planned for Day 3 in
  `docs/test-cases.md` (auth, search/filter/sort, product, cart, checkout).

## Open questions

- Login tests need the demo customer credentials as `CUSTOMER_EMAIL` / `CUSTOMER_PASSWORD`
  (local `.env` + GitHub Actions secrets) before Day 3. They are published by the site
  maintainers, but rule 6 keeps them out of the repo.

- Scheduled daily CI run not added yet (rule 4 allows at most one per day). Add it in Day 6
  together with the reliability work?
- Azure DevOps: free Microsoft-hosted agents may need a free "parallelism" request
  (can take a few business days). Fallback: a self-hosted agent or document the YAML only.
