# Test Cases — Toolshop

Written in a Jira/Xray-style format. Every automated test names its ID in the test title
(e.g. `test('TC-CART-02: ...')`) so results trace back to this list. Risks (R1–R8) are
defined in [test-strategy.md](test-strategy.md#3-risk-analysis).

**Priority**

- **P1** — blocks buying or breaks money/trust (checkout, price, login). Must pass for every PR.
- **P2** — important feature, a workaround exists.
- **P3** — minor or cosmetic.

**Status** of automation: ✅ automated · 🔜 planned (target day) · ✋ manual.

**Accounts:** "demo customer" = the customer account documented by the site maintainers.
Credentials come from `CUSTOMER_EMAIL` / `CUSTOMER_PASSWORD`; they are not written here.
"New customer" = a user the test registers itself through the API with a unique
`test+<timestamp>@example.com` address.

## Overview

| ID          | Title                                                | Area     | Prio |  Risk  | Level | Automate                                                          | Status   |
| ----------- | ---------------------------------------------------- | -------- | :--: | :----: | ----- | ----------------------------------------------------------------- | -------- |
| TC-SMOKE-01 | Home page loads and shows products                   | Smoke    |  P1  |   R4   | UI    | **Yes** — first sign the site is up; cheap and stable             | ✅ Day 1 |
| TC-SMOKE-02 | Product search returns matching results              | Smoke    |  P1  |   R4   | UI    | **Yes** — core way to find products; objective result             | ✅ Day 1 |
| TC-AUTH-01  | Log in with valid demo customer                      | Auth     |  P1  |   R3   | UI    | **Yes** — every account flow depends on it                        | 🔜 Day 3 |
| TC-AUTH-02  | Log in with wrong password is rejected               | Auth     |  P1  |   R3   | UI    | **Yes** — security-relevant negative case, objective              | 🔜 Day 3 |
| TC-AUTH-03  | Log out ends the session                             | Auth     |  P2  |   R3   | UI    | **Yes** — short, stable, protects shared-computer use             | 🔜 Day 3 |
| TC-AUTH-04  | Register a new customer                              | Auth     |  P2  |   R7   | UI    | **Yes** — UI once; the same API call is reused for test data      | 🔜 Day 3 |
| TC-AUTH-05  | Reset a forgotten password                           | Auth     |  P3  |   R3   | UI    | **No** — needs the reset e-mail; no mailbox on the public site    | ✋       |
| TC-SRCH-01  | Search with no matches shows "no results"            | Search   |  P2  |   R4   | UI    | **Yes** — negative case of TC-SMOKE-02, cheap                     | 🔜 Day 3 |
| TC-SRCH-02  | Filter by category shows only that category          | Search   |  P2  |   R4   | UI    | **Yes** — main browsing path; result is checkable                 | 🔜 Day 3 |
| TC-SRCH-03  | Sort by price (low → high)                           | Search   |  P2  |   R4   | UI    | **Yes** — order of prices is objective                            | 🔜 Day 3 |
| TC-SRCH-04  | Filter by price range slider                         | Search   |  P3  |   R4   | UI    | **No** — dragging a slider is brittle; low risk; explore manually | ✋       |
| TC-PROD-01  | Product page shows name, price and add-to-cart       | Product  |  P1  |   R2   | UI    | **Yes** — entry point to the cart; price must be correct          | 🔜 Day 3 |
| TC-CART-01  | Add a product to the cart                            | Cart     |  P1  |   R1   | UI    | **Yes** — first step of every purchase                            | 🔜 Day 3 |
| TC-CART-02  | Change quantity updates line total and cart total    | Cart     |  P1  |   R2   | UI    | **Yes** — money calculation, objective                            | 🔜 Day 3 |
| TC-CART-03  | Remove a product empties the cart                    | Cart     |  P2  |   R2   | UI    | **Yes** — short and stable                                        | 🔜 Day 3 |
| TC-CART-04  | Cart total equals the sum of line totals             | Cart     |  P1  |   R2   | API   | **Yes** — business rule; faster and more stable through the API   | 🔜 Day 4 |
| TC-CHK-01   | Logged-in customer completes checkout                | Checkout |  P1  |   R1   | UI    | **Yes** — highest risk flow (score 9), the reason the shop exists | 🔜 Day 3 |
| TC-CHK-02   | Guest completes checkout                             | Checkout |  P2  |   R1   | UI    | **Yes** — second way to buy; same page objects as TC-CHK-01       | 🔜 Day 3 |
| TC-CHK-03   | Billing address: required fields are validated       | Checkout |  P2  |   R1   | UI    | **Yes** — key negative case; prevents orders without address      | 🔜 Day 3 |
| TC-CHK-04   | Checkout cannot finish without a payment method      | Checkout |  P2  |   R1   | UI    | **Yes** — key negative case                                       | 🔜 Day 3 |
| TC-CHK-05   | Invoice is created after checkout                    | Orders   |  P1  |   R6   | API   | **Yes** — proves the order was really stored; API is reliable     | 🔜 Day 4 |
| TC-API-01   | Auth API: valid login returns a token, invalid → 401 | API      |  P1  | R3, R5 | API   | **Yes** — basis of all API test data setup                        | 🔜 Day 4 |
| TC-API-02   | Products API: response shape (contract)              | API      |  P1  |   R5   | API   | **Yes** — catches contract changes before the UI breaks           | 🔜 Day 4 |
| TC-A11Y-01  | Key pages have no serious/critical axe violations    | A11y     |  P2  |   R8   | UI    | **Yes** — automated smoke only; full audit stays manual           | 🔜 Day 6 |
| TC-I18N-01  | Switching language translates the page               | i18n     |  P3  |   R8   | UI    | **No** — correctness of a translation needs a human reader        | ✋       |

Totals: **25** cases — 22 to automate (2 done), 3 manual. P1: 12 · P2: 10 · P3: 3.

> UI labels on public pages (Sign in, Login, Register your account, Proceed to checkout, the
> add-to-cart message) were checked on the live site on 2026-11-09. Texts behind login and at
> the end of checkout (user menu, payment success message) are from the open-source app and
> are confirmed when the case is automated.

---

## Details

### Smoke

#### TC-SMOKE-01 — Home page loads and shows products

- **Priority:** P1 · **Automate:** yes (`tests/ui/smoke.spec.ts`)
- **Preconditions:** none.
- **Steps:**
  1. Open the home page `/`.
- **Expected:** the page title contains "Toolshop"; the "Home" navigation link is visible;
  at least one product name is visible in the product grid.

#### TC-SMOKE-02 — Product search returns matching results

- **Priority:** P1 · **Automate:** yes (`tests/ui/smoke.spec.ts`)
- **Preconditions:** none.
- **Steps:**
  1. Open the home page.
  2. Type `pliers` in the **Search** field.
  3. Click **Search**.
- **Expected:** the search request succeeds; the caption shows "Searched for: pliers"; at
  least one product is shown; every product name shown contains "pliers" (case-insensitive).

### Authentication

#### TC-AUTH-01 — Log in with valid demo customer

- **Priority:** P1 · **Automate:** yes
- **Preconditions:** demo customer exists; user is logged out.
- **Steps:**
  1. Click **Sign in** in the navigation.
  2. Enter the demo customer e-mail and password.
  3. Click **Login**.
- **Expected:** user is taken to the account page ("My account"); the navigation shows the
  customer's name instead of **Sign in**.

#### TC-AUTH-02 — Log in with wrong password is rejected

- **Priority:** P1 · **Automate:** yes
- **Preconditions:** user is logged out.
- **Steps:**
  1. Open the login page.
  2. Enter the demo customer e-mail and a wrong password.
  3. Click **Login**.
- **Expected:** an error message about invalid credentials is shown; user stays on the login
  page; no session is created (**Sign in** is still shown). The message must not say which of
  e-mail or password was wrong.

#### TC-AUTH-03 — Log out ends the session

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** logged in as a new customer (session created through the API).
- **Steps:**
  1. Open the user menu in the navigation.
  2. Click **Sign out**.
  3. Open the account page `/account` directly.
- **Expected:** after step 2 the navigation shows **Sign in**; step 3 redirects to the login
  page.

#### TC-AUTH-04 — Register a new customer

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** a unique, fake e-mail address (`test+<timestamp>@example.com`).
- **Steps:**
  1. Open **Sign in** → **Register your account**.
  2. Fill all required fields with fake data and a valid password.
  3. Submit.
  4. Log in with the new e-mail and password.
- **Expected:** registration succeeds and the user is sent to the login page; login with the
  new account works.

#### TC-AUTH-05 — Reset a forgotten password (manual)

- **Priority:** P3 · **Automate:** no — the reset link is sent by e-mail and we have no
  mailbox on the public site. Covered manually against a local Docker instance with its mail
  catcher.
- **Preconditions:** a registered account.
- **Steps:**
  1. Open the login page → **Forgot your Password?**
  2. Enter the account e-mail and submit.
  3. Open the e-mail and follow the link; set a new password.
- **Expected:** a confirmation is shown after step 2; login works with the new password and
  fails with the old one.

### Search, filter and sort

#### TC-SRCH-01 — Search with no matches shows "no results"

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** none.
- **Steps:**
  1. Search for a term that matches nothing, e.g. `zzznotaproduct`.
- **Expected:** the caption shows the searched term; no product cards are shown; a
  "no results" message is shown; the page does not show an error.

#### TC-SRCH-02 — Filter by category shows only that category

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** none.
- **Steps:**
  1. Open the home page.
  2. In the filters, tick one sub-category (e.g. **Hammer** under Hand Tools).
- **Expected:** the product list updates; every product shown belongs to the chosen category
  (check through the product API, not by name guessing); un-ticking restores the full list.

#### TC-SRCH-03 — Sort by price (low → high)

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** none.
- **Steps:**
  1. Open the home page.
  2. Choose **Price (Low - High)** in the sort menu.
- **Expected:** the prices shown on the first page are in ascending order.

#### TC-SRCH-04 — Filter by price range slider (manual)

- **Priority:** P3 · **Automate:** no — drag-based slider interaction is fragile in automation
  and the risk is low; covered in exploratory sessions.
- **Steps:**
  1. Drag the price slider to a range, e.g. 10–50.
- **Expected:** only products with a price inside the range are shown; the range labels match.

### Product

#### TC-PROD-01 — Product page shows name, price and add-to-cart

- **Priority:** P1 · **Automate:** yes
- **Preconditions:** none.
- **Steps:**
  1. From the home page, open the first product.
- **Expected:** product name, unit price, description, quantity field (default 1) and
  **Add to cart** button are visible; the name and price match the card on the list page.

### Cart

#### TC-CART-01 — Add a product to the cart

- **Priority:** P1 · **Automate:** yes
- **Preconditions:** empty cart.
- **Steps:**
  1. Open a product page.
  2. Click **Add to cart**.
- **Expected:** a confirmation "Product added to shopping cart." is shown; the cart badge in
  the navigation shows `1`; the cart page lists the product with quantity 1.

#### TC-CART-02 — Change quantity updates line total and cart total

- **Priority:** P1 · **Automate:** yes
- **Preconditions:** cart contains one product with quantity 1.
- **Steps:**
  1. Open the cart.
  2. Change the quantity to 3.
- **Expected:** line total = unit price × 3; cart total = sum of all line totals; values are
  shown with 2 decimals.

#### TC-CART-03 — Remove a product empties the cart

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** cart contains exactly one product.
- **Steps:**
  1. Open the cart.
  2. Remove the product with the red **×** (delete) button on its line.
- **Expected:** the product is no longer listed; the cart is shown as empty; the cart badge
  disappears or shows 0.

#### TC-CART-04 — Cart total equals the sum of line totals (API)

- **Priority:** P1 · **Automate:** yes (API level)
- **Preconditions:** a new cart created through the API.
- **Steps:**
  1. Create a cart (`POST /carts`).
  2. Add two different products with quantities 1 and 2.
  3. Read the cart (`GET /carts/{id}`).
- **Expected:** status codes are 2xx; each line contains the product and quantity sent; the
  total of (price × quantity) per line matches what the UI would show (checked against
  product prices from `GET /products/{id}`).

### Checkout

#### TC-CHK-01 — Logged-in customer completes checkout

- **Priority:** P1 · **Automate:** yes
- **Preconditions:** new customer logged in (API); cart contains one product.
- **Steps:**
  1. Open the cart → **Proceed to checkout** (step 1 Cart).
  2. Step 2 Sign in: already signed in → **Proceed to checkout**.
  3. Step 3 Billing address: fill/confirm all fields with fake data → **Proceed to checkout**.
  4. Step 4 Payment: choose a payment method (e.g. Cash on Delivery) → **Confirm**.
- **Expected:** a success message is shown ("Payment was successful"), followed by an order
  confirmation with an invoice number; the cart is empty afterwards.

#### TC-CHK-02 — Guest completes checkout

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** not logged in; cart contains one product.
- **Steps:**
  1. Cart → **Proceed to checkout**.
  2. Step 2: choose the guest option; enter fake e-mail, first and last name → continue.
  3. Step 3: fill the billing address.
  4. Step 4: choose a payment method → **Confirm**.
- **Expected:** same as TC-CHK-01: success message and an invoice number.

#### TC-CHK-03 — Billing address: required fields are validated

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** logged in; cart with one product; at checkout step 3.
- **Steps:**
  1. Clear a required field (e.g. **Street**).
- **Expected:** a validation message is shown for that field and **Proceed to checkout**
  stays disabled; after filling the field it becomes enabled.

#### TC-CHK-04 — Checkout cannot finish without a payment method

- **Priority:** P2 · **Automate:** yes
- **Preconditions:** logged in; cart with one product; at checkout step 4.
- **Steps:**
  1. Do not select a payment method.
- **Expected:** **Confirm** is disabled (or an error is shown when clicked); no order and no
  invoice are created.

#### TC-CHK-05 — Invoice is created after checkout (API)

- **Priority:** P1 · **Automate:** yes (API level)
- **Preconditions:** a new customer who just completed TC-CHK-01 (or the same flow done
  through the API).
- **Steps:**
  1. Log in through the API and get a token.
  2. Call `GET /invoices` with the token.
- **Expected:** exactly one invoice for this new customer; it contains the ordered product,
  quantity and a total equal to the cart total; billing address matches what was entered.

### API

#### TC-API-01 — Auth API: valid login returns a token, invalid → 401

- **Priority:** P1 · **Automate:** yes
- **Preconditions:** demo customer credentials in environment variables.
- **Steps:**
  1. `POST /users/login` with valid credentials.
  2. `POST /users/login` with a wrong password.
- **Expected:** (1) 200 and a JSON body with a non-empty `access_token`; (2) 401 and no token.
  The token is never printed in logs or the report.

#### TC-API-02 — Products API: response shape (contract)

- **Priority:** P1 · **Automate:** yes
- **Preconditions:** none.
- **Steps:**
  1. `GET /products?page=1`.
  2. `GET /products/{id}` for the first product.
- **Expected:** 200; the list has pagination fields (`current_page`, `data`, `total`, …);
  each product has at least `id` (string), `name` (string), `price` (number > 0) and a
  category/brand reference. Extra fields are allowed; missing or wrongly typed fields fail.

### Accessibility and language

#### TC-A11Y-01 — Key pages have no serious/critical axe violations

- **Priority:** P2 · **Automate:** yes (smoke only)
- **Preconditions:** none.
- **Steps:**
  1. Run axe on the home page, a product page, the login page and the cart.
- **Expected:** no violations with impact _serious_ or _critical_. Known site issues are
  listed in the README with a reason instead of being silently excluded.

#### TC-I18N-01 — Switching language translates the page (manual)

- **Priority:** P3 · **Automate:** no — a machine can only check that text _changed_, not that
  the translation is correct; a human reader is needed.
- **Steps:**
  1. Open the language menu and pick each language in turn.
- **Expected:** navigation, filters, buttons and messages are translated; no untranslated
  keys (e.g. `nav.home`) and no cut-off text.
