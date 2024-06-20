import * as React from 'react';
import * as ReactModal from 'react-modal';
import { PickUserModalProps } from './types';
import './style.css';
import { PickedUserViewComponent } from './picked-user-view/component';
import { PresenterViewComponent } from './presenter-view/component';

export function PickUserModal(props: PickUserModalProps) {
  const {
    showModal,
    handleCloseModal,
    users,
    pickedUser,
    handlePickRandomUser,
    currentUser,
    filterOutPresenter,
    setFilterOutPresenter,
    userFilterViewer,
    setUserFilterViewer,
    dataChannelPickedUsers,
    resetPickedUserHistory,
    handleBackToPresenterView,
    showPresenterView,
  } = props;

  let userRole: string;
  if (userFilterViewer) {
    userRole = (users?.length !== 1) ? 'viewers' : 'viewer';
  } else {
    userRole = (users?.length !== 1) ? 'users' : 'user';
  }
  let title = (users?.length === 1)
    ? `There is only one ${userRole}`
    : 'Randomly picked user';
  if (pickedUser?.userId === currentUser?.userId) {
    title = 'You have been randomly picked';
  }

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
                resetPickedUserHistory,
                handlePickRandomUser,
                dataChannelPickedUsers,
                pickedUser,
                users,
                userRole,
              }}
            />
          ) : (
            <PickedUserViewComponent
              {...{
                pickedUser,
                title,
                currentUser,
                handleBackToPresenterView,
              }}
            />
          )

      }
    </ReactModal>
  );
}
