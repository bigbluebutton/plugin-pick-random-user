import * as React from 'react';
import { defineMessages } from 'react-intl';
import { PickedUserViewComponentProps } from './types';

const intlMessages = defineMessages({
  currentUserPicked: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.title.currentUserPicked',
    description: 'Title to show that current user has been picked',
  },
  randomUserPicked: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.title.randomUserPicked',
    description: 'Title to show that random user has been picked',
  },
  backButtonLabel: {
    id: 'pickRandomUserPlugin.modal.pickedUserView.backButton.label',
    description: 'Label of back button in picked-user view on the modal',
  },
});

export function PickedUserViewComponent(props: PickedUserViewComponentProps) {
  const {
    intl,
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

  const title = (pickedUserWithEntryId?.pickedUser?.userId === currentUser?.userId)
    ? intl.formatMessage(intlMessages.currentUserPicked)
    : intl.formatMessage(intlMessages.randomUserPicked);
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
            <div
              className="modal-avatar"
              style={{ backgroundColor: `${pickedUserWithEntryId.pickedUser?.color}` }}
            >
              {pickedUserWithEntryId.pickedUser?.name.slice(0, 2)}
            </div>
            <p className="user-name">{pickedUserWithEntryId.pickedUser?.name}</p>
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
    </div>
  );
}
