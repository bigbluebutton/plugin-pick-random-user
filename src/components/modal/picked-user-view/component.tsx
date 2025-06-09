import * as React from 'react';
import { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { PickedUserViewComponentProps } from './types';
import * as Styled from './styles';
import hasCurrentUserSeenPickedUser from '../../../utils/utils';

const intlMessages = defineMessages({
  currentUserPicked: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.title.currentUserPicked',
    description: 'Title to show that current user has been picked',
    defaultMessage: 'You have been randomly picked',
  },
  randomUserPicked: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.title.randomUserPicked',
    description: 'Title to show that random user has been picked',
    defaultMessage: 'Randomly picked user',
  },
  backButtonLabel: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.backButton.label',
    description: 'Label of back button in picked-user view on the modal',
    defaultMessage: 'back',
  },
  avatarImageAlternativeText: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.avatarImage.alternativeText',
    description: 'Alternative text for avatar image',
    defaultMessage: 'Avatar image of user {0}',
  },
});

export function PickedUserViewComponent(props: PickedUserViewComponentProps) {
  const {
    intl,
    pickedUserWithEntryId,
    currentUser,
    setShowPresenterView,
    pickedUserSeenEntries,
    pushPickedUserSeen,
  } = props;

  const handleBackToPresenterView = () => {
    if (currentUser?.presenter) {
      setShowPresenterView(true);
    }
  };
  const avatarUrl = pickedUserWithEntryId?.pickedUser?.avatar;

  useEffect(() => {
    const hasCurrentUserSeen = hasCurrentUserSeenPickedUser(
      pickedUserSeenEntries,
      currentUser?.userId,
      pickedUserWithEntryId?.pickedUser?.userId,
    );
    if (pickedUserWithEntryId && !hasCurrentUserSeen) {
      pushPickedUserSeen({
        pickedUserId: pickedUserWithEntryId?.pickedUser.userId,
        seenByUserId: currentUser.userId,
      });
    }
  }, []);
  const title = (pickedUserWithEntryId?.pickedUser?.userId === currentUser?.userId)
    ? intl.formatMessage(intlMessages.currentUserPicked)
    : intl.formatMessage(intlMessages.randomUserPicked);

  const avatarAltDescriptor = intl.formatMessage(intlMessages.currentUserPicked, {
    0: pickedUserWithEntryId?.pickedUser?.name,
  });
  return (
    <Styled.PickedUserViewWrapper>
      <Styled.PickedUserViewTitle>{title}</Styled.PickedUserViewTitle>
      {
        (pickedUserWithEntryId) ? (
          <>
            {avatarUrl ? (
              <Styled.PickedUserAvatarImage
                alt={avatarAltDescriptor}
                src={avatarUrl}
              />
            ) : (
              <Styled.PickedUserAvatarInitials
                background={pickedUserWithEntryId?.pickedUser?.color}
              >
                {pickedUserWithEntryId?.pickedUser?.name.slice(0, 2)}
              </Styled.PickedUserAvatarInitials>
            )}
            <Styled.PickedUserName>{pickedUserWithEntryId?.pickedUser?.name}</Styled.PickedUserName>
          </>
        ) : null
      }
      {
        (currentUser?.presenter) ? (
          <button type="button" onClick={handleBackToPresenterView}>
            {intl.formatMessage(intlMessages.backButtonLabel)}
          </button>
        ) : null
      }
    </Styled.PickedUserViewWrapper>
  );
}
