import { test } from '@playwright/test';
import { ELEMENT_WAIT_LONGER_TIME, ELEMENT_WAIT_TIME } from '../core/constants';
import { elements as e } from '../elements';
import { SessionPage as Page } from '../core/sessionPage';

/**
 * Click a chip and verify the underlying checkbox reaches checked state, retrying once.
 * @param clickSelector - the visible chip label to click
 * @param checkSelector - the hidden input whose checked state to assert (defaults to clickSelector)
 */
export async function clickToggleOnWithRetry(
  page: Page,
  clickSelector: string,
  description: string,
  checkSelector: string = clickSelector,
): Promise<void> {
  const checkLocator = page.page.locator(checkSelector);
  await page.page.click(clickSelector);
  try {
    await test.expect(checkLocator, `${description} toggle should be on`).toBeChecked({ timeout: ELEMENT_WAIT_LONGER_TIME });
  } catch {
    test.info().annotations.push({
      type: 'toggle-retry',
      description: `"${description}" toggle didn't register on first click and was retried`,
    });
    await page.page.click(clickSelector);
    await test.expect(checkLocator, `${description} toggle should be on (retry)`).toBeChecked({ timeout: ELEMENT_WAIT_LONGER_TIME });
  }
}

export async function openModal(modPage: Page): Promise<void> {
  await modPage.page.waitForSelector(e.whiteboard, { timeout: ELEMENT_WAIT_LONGER_TIME });
  await modPage.page.click(e.actions);
  await modPage.hasElement(e.pickRandomUserActionButton, 'action button should appear');
  await modPage.page.click(e.pickRandomUserActionButton);
}

export async function goBackToPresenterView(modPage: Page): Promise<void> {
  await modPage.hasElement(e.pickRandomUserBackButton, 'back button should be visible');
  await modPage.page.click(e.pickRandomUserBackButton);
  await modPage.hasElement(
    e.includeModeratorsChip,
    'presenter view should be restored after clicking back',
    ELEMENT_WAIT_TIME,
  );
}

export async function moderatorCleanupAfterTest(modPage: Page): Promise<void> {
  if (await modPage.page.locator(e.pickRandomUserPickedUserViewTitle).isVisible()) {
    await modPage.page.click(e.pickRandomUserBackButton);
    await modPage.page.locator(e.pickRandomUserModalCloseButton).waitFor({ state: 'visible', timeout: ELEMENT_WAIT_TIME });
  }

  const modCloseBtn = modPage.page.locator(e.pickRandomUserModalCloseButton);
  if (await modCloseBtn.isVisible()) {
    // Uncheck any filter chips that were left enabled.
    const includePickedUsers = modPage.page.locator(e.includePickedUsersCheckbox);
    if (await includePickedUsers.isChecked()) await modPage.page.click(e.includePickedUsersChip);
    const includeModerators = modPage.page.locator(e.includeModeratorsCheckbox);
    if (await includeModerators.isChecked()) await modPage.page.click(e.includeModeratorsChip);
    const includePresenter = modPage.page.locator(e.includePresenterCheckbox);
    if (await includePresenter.isChecked()) await modPage.page.click(e.includePresenterChip);

    // Clear the previously-picked history.
    const clearBtn = modPage.page.locator(e.pickRandomUserClearAllButton);
    if (await clearBtn.isVisible()) {
      await modPage.page.click(e.pickRandomUserClearAllButton);
    }

    await modCloseBtn.click();
    return;
  }

  // Dismiss the mod's actions dropdown if it was left open.
  if (await modPage.page.locator(e.pickRandomUserActionButton).isVisible()) {
    await modPage.page.keyboard.press('Escape');
  }
}

export async function attendeeCleanupAfterTest(attendeePage: Page): Promise<void> {
  const attendeeCloseBtn = attendeePage.page.locator(e.pickRandomUserModalCloseButton);
  if (await attendeeCloseBtn.isVisible()) {
    await attendeeCloseBtn.click();
  }
  // Dismiss the attendee's actions dropdown if it was left open.
  if (await attendeePage.page.locator(e.pickRandomUserActionButton).isVisible()) {
    await attendeePage.page.keyboard.press('Escape');
  }
}
