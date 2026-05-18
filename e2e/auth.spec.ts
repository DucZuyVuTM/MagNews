import { expect, test } from '@playwright/test';
import { mockBackend } from './helpers/mocks';

test.describe('Сценарий 3: Авторизация с корректными данными (позитивный)', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test('user can log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

    await page.locator('#login').fill('tester');
    await page.locator('#password').fill('TestPass123');
    await page.getByRole('main').getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('**/');
    await expect(page).toHaveURL(/\/$/);
  });

  test('login form rejects empty submission', async ({ page }) => {
    await page.goto('/login');
    const submit = page.getByRole('main').getByRole('button', { name: /sign in/i });
    await submit.click();

    // HTML5 required validation prevents form submission
    const loginField = page.locator('#login');
    await expect(loginField).toBeFocused();
  });

  test('user can switch to register from login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('main').getByRole('button', { name: /^register$/i }).click();
    await expect(page).toHaveURL(/\/register$/);
  });
});
