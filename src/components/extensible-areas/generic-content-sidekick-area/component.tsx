import * as React from 'react';
import { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom/client';
import { defineMessages } from 'react-intl';

import { GenericContentSidekickArea } from 'bigbluebutton-html-plugin-sdk';
import { GenericContentSidekickAreaManagerProps } from './types';
import { PickRandomUserPanel } from '../../pick-random-user-panel/component';

const NAVIGATION_SIDEBAR_BUTTON_ICON = 'random';

const intlMessages = defineMessages({
  sidekickAreaTitle: {
    id: 'pickRandomUserPlugin.sidekickArea.title',
    description: 'Name of the plugin entry in the apps gallery / sidekick area',
    defaultMessage: 'Pick random user',
  },
});

/**
 * Registers the plugin's sidekick area. This is the plugin's only entry point on
 * BigBlueButton 4.0: the actions-button dropdown the v0.0.x branch relies on does not
 * exist in the 0.1.x SDK, so the presenter view lives in this panel instead of inside
 * the modal. The modal is left with the picked-user view only.
 *
 * As on v0.0.x, the presenter view is presenter-only, so the entry is registered while
 * the current user is the presenter and removed again as soon as they are not.
 */
function GenericContentSidekickAreaManager(
  props: GenericContentSidekickAreaManagerProps,
): React.ReactNode {
  const {
    pluginApi,
    intl,
    currentUser,
    currentUserInfo,
    pickRandomUserSettings,
  } = props;

  const genericContentId = useRef<string | undefined>('');

  const sidekickAreaName = intl.formatMessage(intlMessages.sidekickAreaTitle);
  const { modalUiScale } = pickRandomUserSettings;

  useEffect(() => {
    if (currentUser?.presenter) {
      const generatedIds = pluginApi.setGenericContentItems([
        new GenericContentSidekickArea({
          contentFunction: (element: HTMLElement) => {
            const root = ReactDOM.createRoot(element);
            root.render(
              <React.StrictMode>
                <PickRandomUserPanel
                  {...{
                    pluginApi,
                    intl,
                    modalUiScale,
                  }}
                />
              </React.StrictMode>,
            );
            return root;
          },
          name: sidekickAreaName,
          section: '',
          open: false,
          buttonIcon: NAVIGATION_SIDEBAR_BUTTON_ICON,
          ...(genericContentId.current && { id: genericContentId.current }),
        }),
      ]);
      genericContentId.current = generatedIds.pop();
      return;
    }
    if (genericContentId.current) {
      pluginApi.setGenericContentItems([]);
      genericContentId.current = '';
    }
  }, [intl, sidekickAreaName, modalUiScale, currentUserInfo, currentUser]);

  return null;
}

export default GenericContentSidekickAreaManager;
