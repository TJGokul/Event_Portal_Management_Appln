import { test, expect } from '@playwright/test';

test.describe('Student Voting Flow', () => {
  test.beforeEach(async ({ request }) => {
    // Reset database to initial seed state before every test
    await request.post('/api/debug/reset');
  });

  test('successfully votes and views receipt', async ({ page }) => {
    // 1. Visit Role Selection page
    await page.goto('/role-selection');
    await expect(page).toHaveTitle(/College Club & Event Voting Portal/);

    // 2. Input Student ID and Log in
    await page.fill('#student-id-input', 'STU_TEST_1');
    await page.click('#btn-enter-student');

    // 3. Confirm redirected to Student Dashboard
    await expect(page).toHaveURL(/\/student\/dashboard/);
    await expect(page.locator('h1')).toContainText('Campus Student Elections');

    // 4. Click 'Browse Candidates' for 'Student Body President' category
    // In our seed, 'cat-1' is the first category card
    await page.click('a[href="/student/vote/cat-1"], button:has-text("Browse Candidates")');
    await expect(page).toHaveURL(/\/student\/vote\/cat-1/);

    // 5. Click on the first candidate card to view their profile (Alex Rivera)
    await page.click('h3:has-text("Alex Rivera")');
    await expect(page).toHaveURL(/\/student\/candidate\/cand-1/);
    await expect(page.locator('h2').first()).toContainText('Alex Rivera');

    // 6. Click 'Vote' to open confirmation modal
    await page.click('#btn-vote-candidate');
    
    // 7. Verify modal is visible
    const modalTitle = page.locator('#modal-title');
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toContainText('Review Your Vote');

    // 8. Confirm the vote in the modal
    await page.click('#btn-confirm-vote');

    // 9. Verify redirection to receipt page
    await expect(page).toHaveURL(/\/student\/receipt\/receipt-/);
    await expect(page.locator('#receipt-card')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Vote Confirmed!');
    await expect(page.locator('#receipt-card')).toContainText('STU_TEST_1');
    await expect(page.locator('#receipt-card')).toContainText('Student Body President');
    await expect(page.locator('#receipt-card')).toContainText('Alex Rivera');
  });
});
