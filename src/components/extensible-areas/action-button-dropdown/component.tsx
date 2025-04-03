import * as React from 'react';
import { useEffect } from 'react';
import { defineMessages } from 'react-intl';

import { ActionButtonDropdownOption, ActionButtonDropdownSeparator } from 'bigbluebutton-html-plugin-sdk';
import { ActionButtonDropdownManagerProps } from './types';

const intlMessages = defineMessages({
  pickUserLabel: {
    id: 'pickRandomUserPlugin.actionsButtonDropdown.label.pickUser',
    description: 'Title to show that current user has been picked',
  },
  viewLastPickedUserLabel: {
    id: 'pickRandomUserPlugin.actionsButtonDropdown.label.viewLastPickedUser',
    description: 'Label of the actions button dropdown option to display the last picked user',
  },
});

function ActionButtonDropdownManager(props: ActionButtonDropdownManagerProps): React.ReactNode {
  const {
    intl,
    pickedUserWithEntryId,
    currentUser,
    pluginApi,
    setShowModal,
    currentUserInfo,
  } = props;

  useEffect(() => {
    if (currentUser?.presenter) {
      pluginApi.setActionButtonDropdownItems([
        new ActionButtonDropdownSeparator(),
        new ActionButtonDropdownOption({
          label: intl.formatMessage(intlMessages.pickUserLabel),
          icon: 'user',
          tooltip: '',
          allowed: true,
          onClick: () => {
            setShowModal(true);
          },
        }),
      ]);
    } else if (!currentUser?.presenter && pickedUserWithEntryId) {
      pluginApi.setActionButtonDropdownItems([
        new ActionButtonDropdownSeparator(),
        new ActionButtonDropdownOption({
          label: intl.formatMessage(intlMessages.viewLastPickedUserLabel),
          icon: 'user',
          tooltip: '',
          allowed: true,
          onClick: () => {
            setShowModal(true);
          },
        }),
      ]);
    } else {
      pluginApi.setActionButtonDropdownItems([]);
    }
  }, [currentUserInfo, pickedUserWithEntryId, intl]);
  return null;
}

export default ActionButtonDropdownManager;
