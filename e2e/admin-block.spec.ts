import { expect, test } from '@playwright/test';
import { mockBackend, loginAs } from './helpers/mocks';

test.describe('Сценарий: Блокировка подписки администратором', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page, { admin: true });
    await loginAs(page, 'admin');
  });

  test('admin can block a subscription by id', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByTestId('admin-tabs')).toBeVisible();

    await page.getByTestId('admin-tab-block').click();
    await expect(page.getByTestId('admin-block-panel')).toBeVisible();

    await page.getByTestId('admin-block-id').fill('42');
    await page.getByTestId('admin-block-reason').fill('Violates terms of service');
    await page.getByTestId('admin-block-submit').click();

    await expect(page.getByTestId('admin-block-success')).toBeVisible();
    await expect(page.getByTestId('admin-block-success')).toContainText(/blocked/i);
  });

  test('block button is disabled when id is empty', async ({ page }) => {
    await page.goto('/admin');
    await page.getByTestId('admin-tab-block').click();
    await expect(page.getByTestId('admin-block-submit')).toBeDisabled();
  });

  test('admin sees complaints tab', async ({ page }) => {
    await page.goto('/admin');
    await page.getByTestId('admin-tab-complaints').click();
    await expect(page.getByTestId('admin-complaint-row').first()).toBeVisible();
    await expect(page.getByText(/Inappropriate content/)).toBeVisible();
  });
});
