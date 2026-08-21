import { test, expect } from '@playwright/test';

test.describe('Duplicate Vote Restriction', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('/api/debug/reset');
  });

  test('prevents student from voting twice in the same category', async ({ page }) => {
    // Log in as student
    await page.goto('/role-selection');
    await page.fill('#student-id-input', 'STU_DUP_TEST');
    await page.click('#btn-enter-student');

    // Go to Category A Candidates list
    await page.goto('/student/vote/cat-1');
    
    // Select first candidate
    await page.click('h3:has-text("Alex Rivera")');
    
    // Submit vote
    await page.click('#btn-vote-candidate');
    await page.click('#btn-confirm-vote');
    
    // Verify receipt is shown (successful vote)
    await expect(page).toHaveURL(/\/student\/receipt\/receipt-/);

    // Go back to the same candidate page (Alex Rivera)
    await page.goto('/student/candidate/cand-1');

    // Verify warning that user has already voted is visible
    await expect(page.locator('text=You have already voted in this category')).toBeVisible();

    // Verify the primary vote button is hidden or disabled
    const voteBtn = page.locator('#btn-vote-candidate');
    await expect(voteBtn).not.toBeVisible();
  });
});
