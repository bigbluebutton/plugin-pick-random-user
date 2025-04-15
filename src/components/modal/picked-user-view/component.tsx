import * as React from 'react';
import { PickedUserViewComponentProps } from './types';
import * as Styled from './styles';

export function PickedUserViewComponent(props: PickedUserViewComponentProps) {
  const {
    title,
    pickedUserWithEntryId,
    currentUser,
    updatePickedRandomUser,
    setShowPresenterView,
    dispatcherPickedUser,
  } = props;

  React.useEffect(() => {
    if (currentUser?.presenter) {
      updatePickedRandomUser(pickedUserWithEntryId.entryId, {
        ...pickedUserWithEntryId.pickedUser,
        isPresenterViewing: true,
      });
    }
    return () => {
      if (currentUser?.presenter) {
        updatePickedRandomUser(pickedUserWithEntryId.entryId, {
          ...pickedUserWithEntryId.pickedUser,
          isPresenterViewing: false,
        });
      }
    };
  }, []);

  const handleBackToPresenterView = () => {
    if (currentUser?.presenter) {
      setShowPresenterView(true);
      dispatcherPickedUser(null);
    }
  };
  return (
    <Styled.PickedUserViewWrapper>
      <Styled.PickedUserViewTitle>{title}</Styled.PickedUserViewTitle>
      {
        (pickedUserWithEntryId) ? (
          <>
            <Styled.PickedUserAvatar
              background={pickedUserWithEntryId.pickedUser?.color}
            >
              {pickedUserWithEntryId.pickedUser?.name.slice(0, 2)}
            </Styled.PickedUserAvatar>
            <Styled.PickedUserName>{pickedUserWithEntryId.pickedUser?.name}</Styled.PickedUserName>
          </>
        ) : null
      }
      {
        (currentUser?.presenter) ? (
          <button type="button" onClick={handleBackToPresenterView}>back</button>
        ) : null
      }
    </Styled.PickedUserViewWrapper>
  );
}
