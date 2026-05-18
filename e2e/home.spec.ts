import { expect, test } from '@playwright/test';
import { mockBackend } from './helpers/mocks';

test.describe('Сценарий 5: Просмотр каталога без авторизации', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test('homepage loads and shows publications', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MagNews/i);
    await expect(page.getByText('Daily News').first()).toBeVisible();
    await expect(page.getByText('Science Today').first()).toBeVisible();
    await expect(page.getByText('Research Journal').first()).toBeVisible();
  });

  test('catalog has filter buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /^All$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^newspaper$/i })).toBeVisible();
  });
});
