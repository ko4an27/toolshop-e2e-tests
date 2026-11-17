import type { Locator, Page } from '@playwright/test';

/**
 * Page Object for the login page (/auth/login).
 * It knows WHERE things are and HOW to use them. It does not decide what is
 * "correct" — assertions live in the tests.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email address');
    // The label text is "Password *". A plain 'Password' would also match the
    // "Forgot your Password?" link, so we match labels that START with "Password".
    this.passwordInput = page.getByLabel(/^Password/);
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('login-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
