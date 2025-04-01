import { useEffect, useState } from 'react';
import * as React from 'react';
import * as ReactModal from 'react-modal';
import { pluginLogger } from 'bigbluebutton-html-plugin-sdk';
import { PickUserModalProps } from './types';
import './style.css';
import { PickedUserViewComponent } from './picked-user-view/component';
import { PresenterViewComponent } from './presenter-view/component';

const TIMEOUT_CLOSE_NOTIFICATION = 5000;

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

  let userRole: string;
  if (userFilterViewer) {
    userRole = (users?.length !== 1) ? 'viewers' : 'viewer';
  } else {
    userRole = (users?.length !== 1) ? 'users' : 'user';
  }
  const title = (pickedUserWithEntryId?.pickedUser?.userId === currentUser?.userId)
    ? 'You have been randomly picked'
    : 'Randomly picked user';

  const [showPresenterView, setShowPresenterView] = useState<boolean>(
    currentUser?.presenter && !pickedUserWithEntryId,
  );
  useEffect(() => {
    setShowPresenterView(currentUser?.presenter && !pickedUserWithEntryId);
    // Play audio when user is selected
    const isPingSoundEnabled = !isPluginSettingsLoading && pluginSettings?.pingSoundEnabled;
    const pingSoundUrl: string = pluginSettings?.pingSoundUrl ? String(pluginSettings?.pingSoundUrl) : 'resources/sounds/doorbell.mp3';
    if (isPingSoundEnabled && pickedUserWithEntryId
      && pickedUserWithEntryId?.pickedUser?.userId === currentUser?.userId) {
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
                userRole,
                dispatcherPickedUser,
              }}
            />
          ) : (
            <PickedUserViewComponent
              {...{
                pickedUserWithEntryId,
                title,
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
