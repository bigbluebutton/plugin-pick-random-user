import { coreElements } from './core/coreElements';

export const elements = {
  ...coreElements,

  // Action button dropdown items injected by the plugin
  pickRandomUserActionButton: 'li[data-test="actionDropdownButtonPlugin"]',
  displayLastRandomlyPickedUser: 'li[data-test="displayLastRandomlyPickedUser"]',

  // Modal close button
  pickRandomUserModalCloseButton: '[data-test="pickRandomUserModalCloseButton"]',

  // Presenter view – filter chips (label elements, for click and visibility checks)
  includeModeratorsChip: '[data-test="includeModeratorsChip"]',
  includePresenterChip: '[data-test="includePresenterChip"]',
  includePickedUsersChip: '[data-test="includePickedUsersChip"]',

  // Presenter view – filter checkboxes (hidden inputs, for isChecked / not.toBeChecked only)
  includeModeratorsCheckbox: '#includeModerators',
  includePresenterCheckbox: '#includePresenter',
  includePickedUsersCheckbox: '#includePickedUsers',

  // Presenter view – available users section
  pickRandomUserAvailableContent: '[data-test="pickRandomUserAvailableContent"]',

  // Presenter view – pick button and "no users" warning
  pickRandomUserPickButton: '[data-test="pickRandomUserPickButton"]',
  pickRandomUserNoUsersWarning: '[data-test="pickRandomUserNoUsersWarning"]',

  // Presenter view – previously picked section
  pickRandomUserClearAllButton: '[data-test="pickRandomUserClearAllButton"]',
  pickRandomUserPreviouslyPickedList: '[data-test="pickRandomUserPreviouslyPickedList"]',

  // Picked-user view
  pickRandomUserPickedUserViewTitle: '[data-test="pickRandomUserPickedUserViewTitle"]',
  pickRandomUserPickedUserName: '[data-test="pickRandomUserPickedUserName"]',
  pickRandomUserBackButton: '[data-test="pickRandomUserBackButton"]',
  pickRandomUserCountDownMessage: 'div[data-test="countDownMessage"]',

  // Modal overlay (ReactModal renders this as a full-screen backdrop)
  pickRandomUserModalOverlay: '.modalOverlay',
};
