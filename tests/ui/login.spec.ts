import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/** Read a required environment variable, or fail with a clear message. */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Set it in .env (local) or as a CI secret.`);
  }
  return value;
}

test.describe('Login', () => {
  test('TC-AUTH-01: customer can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(requireEnv('CUSTOMER_EMAIL'), requireEnv('CUSTOMER_PASSWORD'));

    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByTestId('page-title')).toHaveText('My account');
    await expect(page.getByTestId('nav-menu')).toBeVisible();
    await expect(page.getByTestId('nav-sign-in')).toBeHidden();
  });
});
