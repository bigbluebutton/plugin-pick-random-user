import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import * as React from 'react';
import { defineMessages, IntlShape } from 'react-intl';
import {
  CurrentUserData,
  DataChannelEntryResponseType,
  DeleteEntryFunction,
  GraphqlResponseWrapper,
  PluginApi,
  PushEntryFunction,
} from 'bigbluebutton-html-plugin-sdk';
import * as Styled from './styles';
import { FilterOptionsType, PickUserModalProps } from './types';
import { PickedUserViewComponent } from './picked-user-view/component';
import { PresenterViewComponent } from './presenter-view/component';
import { useGetPossibleUsersToBePicked } from './presenter-view/hooks';
import { useGetFilterOptions, useHandleCurrentUserNotification, usePreventCloseModalCountdown } from './hooks';
import { MIN_PREVENT_CLOSE_DELAY_FOR_TOAST_SECONDS } from '../../commons/constants';
import { PickedUser, PickedUserWithEntryId, PickedUserSeenEntryDataChannel } from '../pick-random-user/types';

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

interface PresenterModalContentProps {
  showPresenterView: boolean;
  pluginApi: PluginApi;
  filterOptions: FilterOptionsType;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptionsType>>;
  deletionFunction: DeleteEntryFunction;
  dataChannelPickedUsers: DataChannelEntryResponseType<PickedUser>[] | undefined;
  pickedUserWithEntryId: PickedUserWithEntryId | null;
  intl: IntlShape;
  currentUser: CurrentUserData;
  pickedUserSeenEntries: GraphqlResponseWrapper<
    DataChannelEntryResponseType<PickedUserSeenEntryDataChannel>[]>;
  pushPickedUserSeen: PushEntryFunction<PickedUserSeenEntryDataChannel>;
  setShowPresenterView: React.Dispatch<React.SetStateAction<boolean>>;
  remainingSeconds: number;
  canClose: boolean;
}

// Kept mounted for as long as the presenter has the modal open, regardless of whether
// they are looking at the presenter view or the just-picked-user view. This keeps the
// useUsersBasicInfo subscription (and its loading state) alive across picks instead of
// tearing it down and recreating it every time the presenter picks someone, which used
// to cause the "Available for selection" list to flash back into a loading state on
// every pick. The subscription still dies normally when the modal closes or the
// component stops rendering (e.g. the user is no longer the presenter).
function PresenterModalContent(props: PresenterModalContentProps) {
  const {
    showPresenterView,
    pluginApi,
    filterOptions,
    setFilterOptions,
    deletionFunction,
    dataChannelPickedUsers,
    pickedUserWithEntryId,
    intl,
    currentUser,
    pickedUserSeenEntries,
    pushPickedUserSeen,
    setShowPresenterView,
    remainingSeconds,
    canClose,
  } = props;

  const { users: usersToBePicked, isLoading } = useGetPossibleUsersToBePicked(
    pluginApi,
    filterOptions,
  );

  if (showPresenterView) {
    return (
      <PresenterViewComponent
        {...{
          intl,
          filterOptions,
          setFilterOptions,
          deletionFunction,
          dataChannelPickedUsers,
          pluginApi,
          pickedUserWithEntryId,
          usersToBePicked,
          isLoading,
        }}
      />
    );
  }

  return (
    <PickedUserViewComponent
      {...{
        pickedUserSeenEntries,
        pushPickedUserSeen,
        pickedUserWithEntryId,
        intl,
        currentUser,
        setShowPresenterView,
        remainingSeconds,
        canClose,
      }}
    />
  );
}

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

export function PickUserModal(props: PickUserModalProps) {
  const {
    pickRandomUserSettings,
    pluginApi,
    intl,
    showModal,
    handleCloseModal,
    currentPickedUser,
    currentUser,
    dataChannelPickedUsers,
    deletionFunction,
    pickedUserSeenEntries,
    pushPickedUserSeen,
    uuid,
  } = props;

  const [filterOptions, setFilterOptions] = useGetFilterOptions(
    pluginApi,
    currentUser?.presenter ?? false,
  );

  const modalAnchor = useRef(document.getElementById(uuid));

  const [showPresenterView, setShowPresenterView] = useState<boolean>(
    currentUser?.presenter && !currentPickedUser,
  );

  useHandleCurrentUserNotification(
    currentUser,
    pickedUserSeenEntries,
    currentPickedUser,
    pickRandomUserSettings,
    intl.formatMessage(intlMessages.currentUserPicked),
  );

  const isPresenter = currentUser?.presenter;
  useEffect(() => {
    setShowPresenterView(isPresenter && !currentPickedUser);
  }, [isPresenter, currentPickedUser]);

  const { preventCloseDelaySeconds } = pickRandomUserSettings;

  const { remainingSeconds, canClose } = usePreventCloseModalCountdown(
    currentUser,
    pickedUserSeenEntries,
    currentPickedUser,
    pickRandomUserSettings,
  );

  const toastPhaseRef = useRef<'hidden' | 'visible' | 'exiting'>('hidden');
  const [toastRendered, setToastRendered] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);

  useEffect(() => {
    const phase = toastPhaseRef.current;
    const show = !showPresenterView && !canClose && remainingSeconds >= 0.3
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
    } else if (showPresenterView && phase !== 'hidden') {
      toastPhaseRef.current = 'hidden';
      setToastRendered(false);
      setToastExiting(false);
    }
    return undefined;
  }, [showPresenterView, canClose, remainingSeconds]);

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
    if (canClose) {
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
      shouldCloseOnOverlayClick={canClose}
      shouldCloseOnEsc={canClose}
      overlayElement={renderOverlay}
    >
      <Styled.ModalHeader>
        <Styled.ModalTitle>
          {intl.formatMessage(intlMessages.modalTitle)}
        </Styled.ModalTitle>
        <Styled.CloseButton
          type="button"
          onClick={handleCloseModal}
          aria-label={intl.formatMessage(intlMessages.closeButtonAriaLabel)}
          data-test="pickRandomUserModalCloseButton"
        >
          <i className="icon-bbb-close" />
        </Styled.CloseButton>
      </Styled.ModalHeader>
      {
        isPresenter
          ? (
            <PresenterModalContent
              {...{
                showPresenterView,
                pluginApi,
                filterOptions,
                setFilterOptions,
                deletionFunction,
                dataChannelPickedUsers,
                pickedUserWithEntryId: currentPickedUser,
                intl,
                currentUser,
                pickedUserSeenEntries,
                pushPickedUserSeen,
                setShowPresenterView,
                remainingSeconds,
                canClose,
              }}
            />
          ) : (
            <PickedUserViewComponent
              {...{
                pickedUserSeenEntries,
                pushPickedUserSeen,
                pickedUserWithEntryId: currentPickedUser,
                intl,
                currentUser,
                setShowPresenterView,
                remainingSeconds,
                canClose,
              }}
            />
          )
      }
    </Styled.PluginModal>
  );
}
