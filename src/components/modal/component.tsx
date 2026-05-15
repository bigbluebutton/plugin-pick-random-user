import * as React from 'react';
import { useEffect, useState } from 'react';
import { PickUserModalProps } from './types';
import { PickedUserViewComponent } from './picked-user-view/component';
import Styled from './styles';
import './raw_styles.css';
import { intlMessages } from '../../intlMessages';

export function PickUserModal(props: PickUserModalProps) {
  const {
    intl,
    showModal,
    handleCloseModal,
    updatePickedRandomUser,
    pickedUserWithEntryId,
    currentUser,
    isBot,
  } = props;

  const [progress, setProgress] = useState(0);

  const isYou = (pickedUserWithEntryId?.pickedUser?.userId === currentUser?.userId);

  useEffect(() => {
    if (isBot && showModal) {
      setProgress(0);
      const startTime = Date.now();
      const duration = 5000; // Modal will be displayed for 5 seconds

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / duration) * 100;

        if (newProgress >= 100) {
          setProgress(100);
          clearInterval(interval);
          handleCloseModal();
        } else {
          setProgress(newProgress);
        }
      }, 30);

      return () => clearInterval(interval);
    }
    return () => {};
  }, [isBot, showModal, handleCloseModal]);

  const title = isYou
    ? intl.formatMessage(intlMessages.youWerePicked)
    : intl.formatMessage(intlMessages.pickedUser);

  return (
    <Styled.PluginModal
      overlayClassName="modal-overlay"
      isOpen={showModal}
      onRequestClose={handleCloseModal}
    >
      <Styled.ModalContainer>
        {!isBot && (
          <Styled.ButtonClose
            type="button"
            onClick={() => {
              handleCloseModal();
            }}
            aria-label={intl.formatMessage(intlMessages.closeButton)}
          >
            <i
              className="icon-bbb-close"
            />
          </Styled.ButtonClose>
        )}
      </Styled.ModalContainer>
      <PickedUserViewComponent
        {...{
          currentUser,
          updatePickedRandomUser,
          pickedUserWithEntryId,
          title,
          isYou,
        }}
      />
      {isBot && showModal && (
        <Styled.ProgressBarContainer>
          <Styled.ProgressBarFill progress={progress} />
        </Styled.ProgressBarContainer>
      )}
    </Styled.PluginModal>
  );
}
