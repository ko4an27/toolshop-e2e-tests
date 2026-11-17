import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the Toolshop E2E suite.
 *
 * "Good guest" rules (see CLAUDE.md): the target is a shared public demo site,
 * so we keep parallelism low (workers <= 2) and allow at most one retry in CI.
 * Retries are reported in the HTML report, never hidden.
 */
// Local runs: load variables from .env (Node's built-in loader, no extra package).
// In CI there is no .env file; the variables come from GitHub Actions secrets.
try {
  process.loadEnvFile();
} catch {
  // No .env file — that's fine.
}

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: isCI
    ? [['list'], ['html', { open: 'never' }], ['github']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://practicesoftwaretesting.com',
    // The Toolshop app marks elements with data-test="..." — use it for getByTestId().
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
