# Test Strategy — Toolshop

| Item              | Value                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| System under test | Toolshop demo shop — <https://practicesoftwaretesting.com> (v5)                                     |
| API               | <https://api.practicesoftwaretesting.com> (REST, JSON)                                              |
| Source            | [testsmith-io/practice-software-testing](https://github.com/testsmith-io/practice-software-testing) |
| Test cases        | [test-cases.md](test-cases.md)                                                                      |
| Status            | Draft v1 (Day 2)                                                                                    |

## 1. Purpose

This document explains **what** we test on the Toolshop, **why**, **how** (manual or automated, UI
or API) and **when testing is "done"**. The goal is not maximum coverage but a small,
stable suite that protects the flows where a real online shop would lose money or trust.

## 2. Scope

### In scope

| Area           | Features                                                                          |
| -------------- | --------------------------------------------------------------------------------- |
| Catalogue      | Home page product list, search, category/brand filters, sorting, pagination       |
| Product detail | Name, price, description, quantity selector, add to cart                          |
| Authentication | Login, logout, failed login, registration of a new customer                       |
| Cart           | Add, change quantity, remove, cart total, cart badge                              |
| Checkout       | 4 steps: cart → sign in (or guest) → billing address → payment                    |
| Orders         | Invoice created after checkout and visible in "My invoices"                       |
| API            | Auth (`/users/login`), products, cart, invoices — status codes and response shape |

### Out of scope (and why)

| Area                                                       | Reason                                                                                  |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Admin back office                                          | Not a customer flow; shared admin data on a public site, risk of disturbing other users |
| Performance / load / security scanning                     | Public demo site — "good guest" rule forbids load and scanning                          |
| Real payment providers                                     | The site simulates payments; there is no real payment gateway                           |
| E-mails (password reset, order mail)                       | No access to a mailbox on the public instance                                           |
| Rentals, product comparison, chat, "live activity" widgets | Lower business risk; candidates for later exploratory sessions                          |
| Native mobile apps                                         | None exist; a mobile **viewport** is covered on Day 5                                   |

## 3. Risk analysis

Risk = **impact** (what happens to the shop if it breaks) × **likelihood** (how easily it
breaks / how often it changes). Scale 1–3; score = impact × likelihood.

| ID  | Risk                                                              | Impact | Likelihood |  Score  | Mitigation                                            |
| --- | ----------------------------------------------------------------- | :----: | :--------: | :-----: | ----------------------------------------------------- |
| R1  | Customer cannot complete checkout / pay                           |   3    |     3      |  **9**  | Automated E2E happy path + key negatives (UI) and API |
| R2  | Wrong price or wrong cart total (quantity × price, sum of lines)  |   3    |     2      |  **6**  | Automated UI + API checks of line and total           |
| R3  | Customer cannot log in, or session is not kept                    |   3    |     2      |  **6**  | Automated UI login + API auth tests                   |
| R4  | Search / filters return wrong or no products → no sale            |   2    |     3      |  **6**  | Automated UI smoke + API search checks                |
| R5  | API contract changes break the front end (fields renamed/removed) |   2    |     3      |  **6**  | Automated API contract (shape) checks                 |
| R6  | Order is paid but no invoice / wrong invoice is created           |   3    |     1      |  **3**  | Automated API check after checkout                    |
| R7  | Registration broken → no new customers                            |   2    |     1      |  **2**  | Automated (low frequency of change)                   |
| R8  | Layout / translation / accessibility issues                       |  1–2   |     2      | **2–4** | Accessibility smoke (axe, Day 6) + manual exploratory |

Highest scores are automated first and run on every pull request.

## 4. Test levels and approach

| Level                    | Tool                            | What it is for                                                                                                              |
| ------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **API tests**            | Playwright `request` fixture    | Fast, stable checks of business rules and response shape; **test data setup** for UI tests (create user, log in, fill cart) |
| **UI E2E tests**         | Playwright + Page Object Model  | Few, end-to-end user journeys a customer actually does; prove the parts work together                                       |
| **Smoke**                | Subset tagged `@smoke`          | "Is the site up and the core flows alive?" — runs first                                                                     |
| **Accessibility**        | axe-core via Playwright (Day 6) | Automated WCAG smoke on key pages                                                                                           |
| **Exploratory / manual** | Human, time-boxed sessions      | Look & feel, usability, translations, odd inputs, new features                                                              |

**Test pyramid on purpose:** checks that do not need a browser go to the API level (faster,
less flaky). The UI suite only covers what a user must see and do. Example: "cart total =
sum of lines" is checked through the API; the UI test only checks the total shown matches.

### What we automate — rules of thumb

Automate a test case when **all** of these are true:

1. It protects a high-risk flow (score ≥ 4) or is a smoke check.
2. The expected result is objective (a value, a status, a visible element — not "looks nice").
3. It can be made stable: own test data, web-first assertions, no fixed waits.
4. It will be run often (every PR) so the effort pays back.

### What stays manual — and why

| Kind of test                                | Reason                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| Visual design, layout, usability            | Judgment, not a yes/no check; pixel snapshots on a live public site are flaky |
| Translations (7 languages)                  | Needs a human who reads the language; low risk for this shop                  |
| Password reset / e-mails                    | No mailbox access on the public instance                                      |
| Exploratory sessions on new features        | Finding unknown problems is a human strength                                  |
| Behaviour that depends on other users' data | Not reproducible on a shared site                                             |

## 5. Test data

- Each test **creates its own data through the API** (e.g. registers a fresh user with a
  unique e-mail, puts products in the cart) and does not depend on another test or run order.
- Only the **demo accounts documented by the site's maintainers** are used for login tests.
  Credentials come from environment variables (`CUSTOMER_EMAIL`, `CUSTOMER_PASSWORD`) and CI
  secrets — they are not written in this repository.
- Generated user data is obviously fake (`test+<timestamp>@example.com`); no real personal data.
- The site is **shared and may be reset**: tests must not assume a product ID, stock level or
  price stays the same between runs. They look up what they need (e.g. "first product in
  search results") and assert on relations (line total = price × quantity) instead of fixed numbers.

## 6. Environments

| Environment             | URL                                                 | Use                                                              |
| ----------------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| Public demo (default)   | `https://practicesoftwaretesting.com`               | Local runs and CI                                                |
| Local Docker (optional) | `http://localhost:4200` (from the open-source repo) | Heavy or destructive experiments — never against the public site |

The target is set with `BASE_URL` (see `.env.example`).

**Browsers:** Chromium on every PR. Firefox, WebKit and a mobile viewport are added on Day 5
(cross-browser run).

**CI:** GitHub Actions on every pull request and push to `main`; Azure DevOps Pipelines on
Day 5. At most one scheduled run per day. `workers ≤ 2`, max 1 retry in CI, and every
retry is visible in the HTML report as _flaky_.

## 7. Entry and exit criteria

### Entry (start testing a change)

- The change is on a branch with an open pull request.
- Lint, Prettier and type-check pass.
- The target site is reachable (smoke tests pass); if the public site is down, the run is
  marked as **blocked**, not failed, and re-run later.
- Test cases for the change exist in `test-cases.md` with an ID.

### Exit (a step / PR is done)

- All automated tests pass in CI; **0 failed**.
- **No unexplained flaky tests.** A test that passed only on retry gets an issue and is fixed
  (or quarantined with a written reason) before the next step.
- All **P1** test cases are automated and passing, or have a written reason why not.
- Every automated test has a test-case ID that exists in `test-cases.md` (traceability).
- README and `PROGRESS.md` say honestly what is covered, what is not and known issues.

## 8. Defects and reporting

- **Report:** Playwright HTML report (CI artifact) with trace, screenshot on failure, and
  retries shown.
- **Defect in the site** (not in our tests): written down in README "Known issues" with steps
  to reproduce; the test is marked with `test.fail()` and a link to the note, so the suite
  stays green but the defect stays visible.
- **Defect in our test** (e.g. a race condition): fixed at the cause, never hidden with sleeps
  or extra retries. Example from Day 1: the search grid re-renders after the result caption
  appears — fixed by waiting for the search response.

## 9. Known constraints and risks of the test approach

| Constraint                                  | Effect / how we handle it                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Shared public site, other users change data | Own data per test, relational asserts, no fixed IDs                                            |
| Site can be slow or down                    | Timeouts tuned, run marked blocked, not "fixed" by retries                                     |
| Site is updated by its maintainers          | Smoke catches changes early; locators use `data-test` attributes the site provides for testing |
| Free CI minutes                             | Small suite, Chromium on PRs, full browser matrix less often                                   |
