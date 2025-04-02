import * as React from 'react';
import { PickedUserViewComponentProps } from './types';

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
  const avatarUrl = pickedUserWithEntryId.pickedUser.avatar;
  return (
    <div
      style={{
        width: '100%', height: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column',
      }}
    >
      <h1 className="title">{title}</h1>
      {
        (pickedUserWithEntryId) ? (
          <>
            {avatarUrl ? (
              <img
                alt={`Avatar of user ${pickedUserWithEntryId.pickedUser.name}`}
                src={avatarUrl}
                className="modal-avatar-img"
              />
            ) : (
              <div
                className="modal-avatar"
                style={{ backgroundColor: `${pickedUserWithEntryId.pickedUser?.color}` }}
              >
                {pickedUserWithEntryId.pickedUser?.name.slice(0, 2)}
              </div>
            )}
            <p className="user-name">{pickedUserWithEntryId.pickedUser?.name}</p>
          </>
        ) : null
      }
      {
        (currentUser?.presenter) ? (
          <button type="button" onClick={handleBackToPresenterView}>back</button>
        ) : null
      }
    </div>
  );
}
