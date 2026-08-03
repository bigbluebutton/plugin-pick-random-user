import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import * as Styled from './styles';
import { PickUserModalProps } from './types';
import { PickedUserViewComponent } from './picked-user-view/component';
import { useHandleCurrentUserNotification, usePreventCloseModalCountdown } from './hooks';
import { MIN_PREVENT_CLOSE_DELAY_FOR_TOAST_SECONDS } from '../../commons/constants';

// Time a bot user is given to look at the picked user before the modal closes itself.
const BOT_AUTO_CLOSE_DURATION_MS = 5000;
const BOT_AUTO_CLOSE_TICK_MS = 30;

const intlMessages = defineMessages({
  currentUserPicked: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.title.currentUserPicked',
    description: 'Title to show that current user has been picked',
    defaultMessage: 'You have been randomly picked',
  },
  modalTitle: {
    id: 'pickRandomUserPlugin.modal.title',
    description: 'Title of the pick random user modal',
    defaultMessage: 'Pick random user',
  },
  closeButtonAriaLabel: {
    id: 'pickRandomUserPlugin.modal.closeButton.ariaLabel',
    description: 'Aria label for the modal close button',
    defaultMessage: 'Close',
  },
  modalCloseDelayMessage: {
    id: 'pickRandomUserPlugin.modal.closeDelayMessage',
    description: 'Message showing countdown before modal can be closed',
    defaultMessage: 'You can close this modal in {seconds} seconds',
  },
  modalCloseDelayMessageSingular: {
    id: 'pickRandomUserPlugin.modal.closeDelayMessageSingular',
    description: 'Message showing countdown before modal can be closed (singular)',
    defaultMessage: 'You can close this modal in {seconds} second',
  },
  modalCloseDelayMessageMs: {
    id: 'pickRandomUserPlugin.modal.closeDelayMessageMs',
    description: 'Message showing millisecond countdown before modal can be closed',
    defaultMessage: 'You can close this modal in {ms}ms',
  },
});

function OverlayWithToast({
  overlayProps,
  contentEl,
  toast,
}: {
  overlayProps: React.ComponentPropsWithRef<'div'>;
  contentEl: React.ReactElement;
  toast: React.ReactNode;
}) {
  return (
    <div {...overlayProps}>
      <Styled.ModalWithToastWrapper>
        {contentEl}
        {toast}
      </Styled.ModalWithToastWrapper>
    </div>
  );
}

/**
 * On BigBlueButton 4.0 the presenter view lives in the plugin's sidekick area (see
 * `extensible-areas/generic-content-sidekick-area/component`), because the actions-button
 * dropdown that opens the modal on the v0.0.x branch does not exist in the 0.1.x SDK. The
 * modal is therefore always the picked-user view, for presenters and viewers alike.
 */
export function PickUserModal(props: PickUserModalProps) {
  const {
    pickRandomUserSettings,
    intl,
    showModal,
    handleCloseModal,
    currentPickedUser,
    currentUser,
    pickedUserSeenEntries,
    pushPickedUserSeen,
    isBot,
    uuid,
  } = props;

  const modalAnchor = useRef(document.getElementById(uuid));

  const [botProgress, setBotProgress] = useState(0);

  useHandleCurrentUserNotification(
    currentUser,
    pickedUserSeenEntries,
    currentPickedUser,
    pickRandomUserSettings,
    intl.formatMessage(intlMessages.currentUserPicked),
  );

  const { preventCloseDelaySeconds } = pickRandomUserSettings;

  const { remainingSeconds, canClose } = usePreventCloseModalCountdown(
    currentUser,
    pickedUserSeenEntries,
    currentPickedUser,
    pickRandomUserSettings,
  );

  // Bots cannot dismiss the modal themselves, so it closes on its own after a fixed
  // window while a progress bar shows how much of that window is left.
  useEffect(() => {
    if (!isBot || !showModal) return undefined;

    setBotProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / BOT_AUTO_CLOSE_DURATION_MS) * 100;

      if (newProgress >= 100) {
        setBotProgress(100);
        clearInterval(interval);
        handleCloseModal();
      } else {
        setBotProgress(newProgress);
      }
    }, BOT_AUTO_CLOSE_TICK_MS);

    return () => clearInterval(interval);
  }, [isBot, showModal]);

  const toastPhaseRef = useRef<'hidden' | 'visible' | 'exiting'>('hidden');
  const [toastRendered, setToastRendered] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);

  useEffect(() => {
    const phase = toastPhaseRef.current;
    const show = !isBot && !canClose && remainingSeconds >= 0.3
      && preventCloseDelaySeconds >= MIN_PREVENT_CLOSE_DELAY_FOR_TOAST_SECONDS;
    if (show && phase === 'hidden') {
      toastPhaseRef.current = 'visible';
      setToastRendered(true);
      setToastExiting(false);
    } else if (!show && phase === 'visible') {
      toastPhaseRef.current = 'exiting';
      setToastExiting(true);
      const t = setTimeout(() => {
        toastPhaseRef.current = 'hidden';
        setToastRendered(false);
        setToastExiting(false);
      }, 400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isBot, canClose, remainingSeconds]);

  const toastMessage = remainingSeconds < 1
    ? intl.formatMessage(intlMessages.modalCloseDelayMessageMs, {
      ms: Math.round(remainingSeconds * 1000),
    })
    : intl.formatMessage(
      Math.ceil(remainingSeconds) === 1
        ? intlMessages.modalCloseDelayMessageSingular
        : intlMessages.modalCloseDelayMessage,
      { seconds: Math.ceil(remainingSeconds) },
    );

  const toast = toastRendered ? (
    <Styled.FloatingToast data-test="countDownMessage" $exiting={toastExiting}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4A6CF7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {toastMessage}
    </Styled.FloatingToast>
  ) : null;

  const renderOverlay = useCallback(
    (
      overlayProps: React.ComponentPropsWithRef<'div'>,
      contentEl: React.ReactElement,
    ) => (
      <OverlayWithToast overlayProps={overlayProps} contentEl={contentEl} toast={toast} />
    ),
    [toast],
  );

  if (!showModal) return null;

  const handleCloseAttempt = () => {
    if (canClose && !isBot) {
      handleCloseModal();
    }
  };

  return (
    <Styled.PluginModal
      overlayClassName="modalOverlay"
      portalClassName="modal-low"
      appElement={modalAnchor.current}
      parentSelector={() => document.querySelector('#modals-container')}
      isOpen={showModal}
      onRequestClose={handleCloseAttempt}
      shouldCloseOnOverlayClick={canClose && !isBot}
      shouldCloseOnEsc={canClose && !isBot}
      overlayElement={renderOverlay}
      $modalUiScale={pickRandomUserSettings.modalUiScale}
    >
      <Styled.ModalHeader>
        <Styled.ModalTitle>
          {intl.formatMessage(intlMessages.modalTitle)}
        </Styled.ModalTitle>
        {!isBot && (
          <Styled.CloseButton
            type="button"
            onClick={handleCloseModal}
            aria-label={intl.formatMessage(intlMessages.closeButtonAriaLabel)}
            data-test="pickRandomUserModalCloseButton"
          >
            <i className="icon-bbb-close" />
          </Styled.CloseButton>
        )}
      </Styled.ModalHeader>
      <PickedUserViewComponent
        {...{
          pickedUserSeenEntries,
          pushPickedUserSeen,
          pickedUserWithEntryId: currentPickedUser,
          intl,
          currentUser,
          handleBack: handleCloseModal,
          showBackButton: !isBot,
          remainingSeconds,
          canClose,
        }}
      />
      {isBot && (
        <Styled.ProgressBarContainer>
          <Styled.ProgressBarFill $progress={botProgress} />
        </Styled.ProgressBarContainer>
      )}
    </Styled.PluginModal>
  );
}
