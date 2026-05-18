import { expect, test } from '@playwright/test';
import { mockBackend, loginAs } from './helpers/mocks';

test.describe('Сценарий 11: Подача жалобы пользователем', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await loginAs(page);
  });

  test('user can submit a complaint and see success', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByTestId('profile-tabs')).toBeVisible();

    await page.getByTestId('tab-complaint-new').click();
    await expect(page.getByTestId('complaint-form')).toBeVisible();

    await page.getByLabel('Publication').click();
    await page.getByRole('option', { name: /Daily News/ }).click();

    await page.getByTestId('complaint-reason').fill('Inappropriate content');
    await page.getByTestId('complaint-description').fill('Detailed description of the issue');

    await page.getByTestId('complaint-submit').click();

    await expect(page.getByTestId('complaint-success')).toBeVisible();
    await expect(page.getByTestId('complaint-success')).toContainText(/#1001/);
  });

  test('reason field is required', async ({ page }) => {
    await page.goto('/profile');
    await page.getByTestId('tab-complaint-new').click();

    await page.getByTestId('complaint-submit').click();

    // Reason input is required by HTML; form is not submitted
    await expect(page.getByTestId('complaint-success')).not.toBeVisible();
  });
});
