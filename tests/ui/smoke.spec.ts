import { test, expect } from '@playwright/test';

/**
 * Smoke tests: the minimum that must work before any deeper test is worth running.
 * Test case IDs are provisional until docs/test-cases.md is written (Day 2).
 */
test.describe('Smoke @smoke', () => {
  test('TC-SMOKE-01: home page loads and shows products', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Toolshop/);
    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.getByTestId('product-name').first()).toBeVisible();
  });

  test('TC-SMOKE-02: product search returns matching results', async ({ page }) => {
    const term = 'pliers';
    await page.goto('/');

    await page.getByRole('textbox', { name: 'Search' }).fill(term);
    // Start listening before the click so the response cannot be missed.
    // Note: the app sends search with the HTTP QUERY method, so match on the path only.
    const searchResponse = page.waitForResponse((res) =>
      new URL(res.url()).pathname.endsWith('/products/search'),
    );
    await page.getByTestId('search-submit').click();
    expect((await searchResponse).ok()).toBe(true);

    // Web-first (auto-retrying) assertions: no fixed sleeps, no one-shot reads of a list
    // that may still be re-rendering from the home page products.
    await expect(page.getByTestId('search-caption')).toContainText(`Searched for: ${term}`);
    const names = page.getByTestId('product-name');
    await expect(names.first()).toBeVisible();
    // Every visible result must match the search term (case-insensitive).
    await expect(names.filter({ hasNotText: new RegExp(term, 'i') })).toHaveCount(0);
  });
});
