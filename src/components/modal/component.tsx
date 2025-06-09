import { useEffect, useState } from 'react';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { pluginLogger } from 'bigbluebutton-html-plugin-sdk';
import * as Styled from './styles';
import { PickUserModalProps, WindowClientSettings } from './types';
import { PickedUserViewComponent } from './picked-user-view/component';
import { PresenterViewComponent } from './presenter-view/component';

const intlMessages = defineMessages({
  currentUserPicked: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.title.currentUserPicked',
    description: 'Title to show that current user has been picked',
    defaultMessage: 'You have been randomly picked',
  },
});

const TIMEOUT_CLOSE_NOTIFICATION = 5000;

declare const window: WindowClientSettings;

function notifyRandomlyPickedUser(message: string) {
  if (!('Notification' in window)) {
    pluginLogger.warn('This browser does not support notifications');
  } else if (Notification.permission === 'granted') {
    const notification = new Notification(message);
    setTimeout(() => {
      notification.close();
    }, TIMEOUT_CLOSE_NOTIFICATION);
  } else if (Notification.permission !== 'denied') {
    pluginLogger.warn('Browser notification permission has been denied');
  }
}

export function PickUserModal(props: PickUserModalProps) {
  const {
    pluginSettings,
    isPluginSettingsLoading,
    intl,
    showModal,
    handleCloseModal,
    users,
    pickedUserWithEntryId,
    handlePickRandomUser,
    currentUser,
    filterOutPresenter,
    setFilterOutPresenter,
    userFilterViewer,
    setUserFilterViewer,
    filterOutPickedUsers,
    setFilterOutPickedUsers,
    dataChannelPickedUsers,
    deletionFunction,
    dispatcherPickedUser,
    pickedUserSeenEntries,
    pushPickedUserSeen,
  } = props;

  const [showPresenterView, setShowPresenterView] = useState<boolean>(
    currentUser?.presenter && !pickedUserWithEntryId,
  );

  useEffect(() => {
    setShowPresenterView(currentUser?.presenter && !pickedUserWithEntryId);
    // Play audio when user is selected
    const isPingSoundEnabled = !isPluginSettingsLoading && pluginSettings?.pingSoundEnabled;
    if (isPingSoundEnabled && pickedUserWithEntryId
      && pickedUserWithEntryId?.pickedUser?.userId === currentUser?.userId) {
      const { cdn, basename } = window.meetingClientSettings.public.app;
      const host = cdn + basename;
      const pingSoundUrl: string = pluginSettings?.pingSoundUrl
        ? String(pluginSettings?.pingSoundUrl)
        : `${host}/resources/sounds/doorbell.mp3`;
      const audio = new Audio(pingSoundUrl);
      audio.play();
      notifyRandomlyPickedUser(intl.formatMessage(intlMessages.currentUserPicked));
    }
  }, [currentUser, pickedUserWithEntryId]);
  return (
    <Styled.PluginModal
      overlayClassName="modalOverlay"
      isOpen={showModal}
      onRequestClose={handleCloseModal}
    >
      <Styled.CloseButtonWrapper>
        <Styled.CloseButton
          type="button"
          onClick={() => {
            handleCloseModal();
          }}
          aria-label="Close button"
        >
          <i
            className="icon-bbb-close"
          />
        </Styled.CloseButton>
      </Styled.CloseButtonWrapper>
      {
        showPresenterView
          ? (
            <PresenterViewComponent
              {...{
                intl,
                filterOutPresenter,
                setFilterOutPresenter,
                userFilterViewer,
                setUserFilterViewer,
                filterOutPickedUsers,
                setFilterOutPickedUsers,
                deletionFunction,
                handlePickRandomUser,
                dataChannelPickedUsers,
                pickedUserWithEntryId,
                users,
                dispatcherPickedUser,
              }}
            />
          ) : (
            <PickedUserViewComponent
              {...{
                pickedUserSeenEntries,
                pushPickedUserSeen,
                pickedUserWithEntryId,
                intl,
                currentUser,
                showModal,
                setShowPresenterView,
                dispatcherPickedUser,
              }}
            />
          )

      }
    </Styled.PluginModal>
  );
}
