import { useEffect, useState } from 'react';
import * as React from 'react';
import * as ReactModal from 'react-modal';
import { pluginLogger } from 'bigbluebutton-html-plugin-sdk';
import { PickUserModalProps, WindowClientSettings } from './types';
import './style.css';
import { PickedUserViewComponent } from './picked-user-view/component';
import { PresenterViewComponent } from './presenter-view/component';

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
    updatePickedRandomUser,
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
      notifyRandomlyPickedUser(title);
    }
  }, [currentUser, pickedUserWithEntryId]);
  return (
    <ReactModal
      className="plugin-modal"
      overlayClassName="modal-overlay"
      isOpen={showModal}
      onRequestClose={handleCloseModal}
    >
      <div
        style={{
          width: '100%', alignItems: 'flex-end', display: 'flex', flexDirection: 'column',
        }}
      >
        <button
          type="button"
          className="clickable-close"
          onClick={() => {
            handleCloseModal();
          }}
          aria-label="Close button"
        >
          <i
            className="icon-bbb-close"
          />
        </button>
      </div>
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
                pickedUserWithEntryId,
                intl,
                updatePickedRandomUser,
                currentUser,
                setShowPresenterView,
                dispatcherPickedUser,
              }}
            />
          )

      }
    </ReactModal>
  );
}
