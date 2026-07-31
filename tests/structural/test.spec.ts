// eslint-disable-next-line import/no-extraneous-dependencies
import {
  test, BrowserContext, Browser, APIRequestContext, TestInfo,
} from '@playwright/test';
import { checkPluginAvailability } from '../core/fixtures/pluginBeforeAll';
import { ELEMENT_WAIT_LONGER_TIME, ELEMENT_WAIT_TIME } from '../core/constants';
import { elements as e } from '../elements';
import { SessionPage as ModPage } from '../core/sessionPage';
import { Plugin } from '../core/plugin';
import { encodeCustomParams } from '../core/helpers';

const PLUGIN_NAME = 'pick-random-user-plugin';
const ENV_VAR_NAME = 'PICK_RANDOM_USER_PLUGIN_URL';

let pluginUrl: string | undefined = process.env[ENV_VAR_NAME];
const setPluginUrl = (url: string) => { pluginUrl = url; };
const getPluginUrl = () => pluginUrl;

/** Helper: open the plugin modal from the actions dropdown. */
async function openPickRandomUserModal(modPage: ModPage) {
  await modPage.page.waitForSelector(e.whiteboard, { timeout: ELEMENT_WAIT_LONGER_TIME });
  await modPage.page.click(e.actions);
  await modPage.hasElement(e.pickRandomUserActionButton, 'action button should be visible');
  await modPage.page.click(e.pickRandomUserActionButton);
}

/**
 * Reset state after each test: close the presenter modal if open,
 * or dismiss the actions dropdown if it was left open without opening the modal.
 */
async function cleanupAfterTest(modPage: ModPage): Promise<void> {
  // If on the picked-user view, go back to the presenter view first.
  if (await modPage.page.locator(e.pickRandomUserPickedUserViewTitle).isVisible()) {
    await modPage.page.click(e.pickRandomUserBackButton);
    await modPage.page.locator(e.pickRandomUserModalCloseButton).waitFor({ state: 'visible', timeout: ELEMENT_WAIT_TIME });
  }

  // If the modal is open, clear the picked-user history and close it.
  const closeBtn = modPage.page.locator(e.pickRandomUserModalCloseButton);
  if (await closeBtn.isVisible()) {
    const clearBtn = modPage.page.locator(e.pickRandomUserClearAllButton);
    if (await clearBtn.isVisible()) {
      await modPage.page.click(e.pickRandomUserClearAllButton);
    }
    await closeBtn.click();
    return;
  }

  // If only the actions dropdown is open (modal was never opened), dismiss it.
  if (await modPage.page.locator(e.pickRandomUserActionButton).isVisible()) {
    await modPage.page.keyboard.press('Escape');
  }
}

const ISOLATED = process.env.TEST_MEETINGS === 'isolated';

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Pick Random User Plugin - Structural', () => {
  test.describe.configure({ mode: ISOLATED ? 'default' : 'serial' });

  let modPage: ModPage;
  let sharedContext: BrowserContext;

  async function setupMeeting(browser: Browser, request: APIRequestContext, testInfo: TestInfo) {
    await checkPluginAvailability({
      pluginName: PLUGIN_NAME,
      envVarName: ENV_VAR_NAME,
      setPluginUrl,
      getPluginUrl,
    })({ request }, testInfo);

    const resolvedUrl = getPluginUrl();
    if (!resolvedUrl) return;

    const createParameter = encodeCustomParams(
      `pluginManifests=${JSON.stringify([{ url: resolvedUrl }])}`,
    );
    sharedContext = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write', 'camera', 'microphone'],
      viewport: { width: 1280, height: 720 },
    });
    const page = await sharedContext.newPage();
    const plugin = new Plugin({ browser, context: sharedContext });
    await plugin.initModPage(page, { createParameter });
    modPage = plugin.modPage;
  }

  if (ISOLATED) {
    test.beforeEach(async ({ browser, request }, testInfo) => {
      await setupMeeting(browser, request, testInfo);
    });
    test.afterEach(async () => {
      await sharedContext?.close();
    });
  } else {
    test.beforeAll(async ({ browser, request }, testInfo) => {
      await setupMeeting(browser, request, testInfo);
    });
    test.afterAll(async () => {
      await sharedContext?.close();
    });
    test.afterEach(async () => {
      if (modPage) await cleanupAfterTest(modPage);
    });
  }

  test('should show "Pick random user" label in the actions dropdown for a presenter', async (): Promise<void> => {
    await modPage.page.waitForSelector(e.whiteboard, { timeout: ELEMENT_WAIT_LONGER_TIME });
    await modPage.page.click(e.actions);
    await modPage.hasElement(e.pickRandomUserActionButton, 'should display the plugin action-button item');
    await modPage.hasText(
      e.pickRandomUserActionButton,
      'Pick random user',
      'should display the correct label "Pick random user"',
    );
  });

  test('should open the presenter modal when clicking the action-button option', async (): Promise<void> => {
    await openPickRandomUserModal(modPage);
    await modPage.hasElement(
      e.includeModeratorsChip,
      'should show the modal presenter view with the "Include moderators" chip',
    );
    await modPage.hasElement(
      e.pickRandomUserAvailableContent,
      'should display the "Available for selection" section',
    );
  });

  test('should display all three filter checkboxes in the presenter view', async (): Promise<void> => {
    await openPickRandomUserModal(modPage);
    await modPage.hasElement(e.includeModeratorsChip, 'should display the "Include moderators" chip');
    await modPage.hasElement(e.includePresenterChip, 'should display the "Include presenter" chip');
    await modPage.hasElement(e.includePickedUsersChip, 'should display the "Include already picked" chip');
  });

  test('should have all three filter checkboxes unchecked by default', async (): Promise<void> => {
    await openPickRandomUserModal(modPage);
    await test.expect(
      modPage.getLocator(e.includeModeratorsCheckbox),
      '"Include moderators" should be unchecked by default',
    ).not.toBeChecked();
    await test.expect(
      modPage.getLocator(e.includePresenterCheckbox),
      '"Include presenter" should be unchecked by default',
    ).not.toBeChecked();
    await test.expect(
      modPage.getLocator(e.includePickedUsersCheckbox),
      '"Include already picked user" should be unchecked by default',
    ).not.toBeChecked();
  });

  test('should show "no users" warning and hide the pick button with default filters (only presenter in meeting)', async (): Promise<void> => {
    // Default: includeModerators=false, includePresenter=false →
    // the single moderator/presenter user is excluded by both rules → 0 eligible.
    await openPickRandomUserModal(modPage);
    await modPage.hasElement(
      e.pickRandomUserNoUsersWarning,
      'should show the "No {0} available" warning when 0 users are eligible',
    );
    await modPage.wasRemoved(
      e.pickRandomUserPickButton,
      'should NOT render the pick button when there are no eligible users',
      ELEMENT_WAIT_TIME,
    );
  });
});
