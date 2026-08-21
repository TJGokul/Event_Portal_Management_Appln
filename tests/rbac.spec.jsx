import { test, expect } from '@playwright/test';

test.describe('Role-Based Access Control (RBAC) Protections', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('/api/debug/reset');
  });

  test('Student cannot access Manager pages and gets redirected to Unauthorized', async ({ page }) => {
    // Log in as student
    await page.goto('/role-selection');
    await page.fill('#student-id-input', 'STU_RBAC');
    await page.click('#btn-enter-student');
    await expect(page).toHaveURL(/\/student\/dashboard/);

    // Try navigating directly to manager routes
    await page.goto('/manager/dashboard');
    await expect(page).toHaveURL(/\/unauthorized/);
    await expect(page.locator('h1')).toContainText('Unauthorized Access');

    await page.goto('/manager/candidates');
    await expect(page).toHaveURL(/\/unauthorized/);
  });

  test('Manager cannot access Student pages and gets redirected to Unauthorized', async ({ page }) => {
    // Log in as Manager
    await page.goto('/role-selection');
    await page.click('#btn-enter-manager');
    await expect(page).toHaveURL(/\/manager\/dashboard/);

    // Try navigating directly to student routes
    await page.goto('/student/dashboard');
    await expect(page).toHaveURL(/\/unauthorized/);
    await expect(page.locator('h1')).toContainText('Unauthorized Access');

    await page.goto('/student/vote/cat-1');
    await expect(page).toHaveURL(/\/unauthorized/);
  });
});
