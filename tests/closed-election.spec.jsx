import { test, expect } from '@playwright/test';

test.describe('Closed Election Constraints', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('/api/debug/reset');
  });

  test('student cannot vote when election is closed', async ({ page }) => {
    // 1. Manager closes election
    await page.goto('/role-selection');
    await page.click('#btn-enter-manager');
    await page.click('#btn-toggle-election-status');
    await page.click('#btn-confirm-toggle-status');
    await expect(page.locator('text=Voting Closed')).toBeVisible();

    // 2. Switch to Student
    await page.click('#btn-switch-role');
    await page.fill('#student-id-input', 'STU_CLOSED_TEST');
    await page.click('#btn-enter-student');

    // 3. Verify status badge shows CLOSED
    await expect(page.locator('[role="status"]')).toContainText('Closed');

    // 4. Verify category list button shows closed and is disabled
    const browseBtn = page.locator('button:has-text("Voting Closed")');
    await expect(browseBtn.first()).toBeDisabled();

    // 5. Try direct navigation to candidate details
    await page.goto('/student/candidate/cand-1');

    // Verify warning that election is closed is displayed
    await expect(page.locator('text=Voting is closed for this election')).toBeVisible();

    // Verify vote button is not visible
    const voteBtn = page.locator('#btn-vote-candidate');
    await expect(voteBtn).not.toBeVisible();
  });
});
