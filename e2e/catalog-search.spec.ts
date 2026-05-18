import { expect, test } from '@playwright/test';
import { mockBackend } from './helpers/mocks';

test.describe('Сценарий 5: Поиск и фильтрация в каталоге', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test('search filters publications by keyword', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Daily News').first()).toBeVisible();

    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('Science');

    await expect(page.getByText('Science Today').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Research Journal').first()).toBeHidden({ timeout: 5000 });
  });

  test('type filter narrows results', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^newspaper$/i }).click();
    await expect(page.getByText('Daily News').first()).toBeVisible();
  });

  test('search and type filter combine', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^magazine$/i }).click();
    await page.getByPlaceholder(/search/i).fill('Science');
    await expect(page.getByText('Science Today').first()).toBeVisible({ timeout: 5000 });
  });
});
