import * as React from 'react';
import { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { PickedUserViewComponentProps } from './types';
import * as Styled from './styles';
import { hasCurrentUserSeenPickedUser } from '../../../commons/utils';
import { UserAvatar } from '../user-avatar/component';

const intlMessages = defineMessages({
  resultSectionLabel: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.resultSectionLabel',
    description: 'Section label shown above the picked user result',
    defaultMessage: 'Result',
  },
  backButtonLabel: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.backButton.label',
    description: 'Label of back button in picked-user view on the modal',
    defaultMessage: 'back',
  },
});

export function PickedUserViewComponent(props: PickedUserViewComponentProps) {
  const {
    intl,
    pickedUserWithEntryId,
    currentUser,
    handleBack,
    showBackButton,
    pickedUserSeenEntries,
    pushPickedUserSeen,
  } = props;

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
  }, [pickedUserWithEntryId]);
  return (
    <Styled.PickedUserViewWrapper>
      <Styled.PickedUserViewBody>
        <Styled.ResultSectionLabel data-test="pickRandomUserPickedUserViewTitle">
          {intl.formatMessage(intlMessages.resultSectionLabel)}
        </Styled.ResultSectionLabel>
        {
          (pickedUserWithEntryId) ? (
            <>
              <UserAvatar
                user={pickedUserWithEntryId.pickedUser}
                size="large"
              />
              <Styled.PickedUserName data-test="pickRandomUserPickedUserName">{pickedUserWithEntryId?.pickedUser?.name}</Styled.PickedUserName>
            </>
          ) : null
        }
      </Styled.PickedUserViewBody>
      {currentUser?.presenter && showBackButton && (
        <Styled.PickedUserViewFooter>
          <Styled.BackButton type="button" data-test="pickRandomUserBackButton" onClick={handleBack}>
            {intl.formatMessage(intlMessages.backButtonLabel)}
          </Styled.BackButton>
        </Styled.PickedUserViewFooter>
      )}
    </Styled.PickedUserViewWrapper>
  );
}
