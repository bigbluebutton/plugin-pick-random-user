import * as React from 'react';
import { useState, useEffect } from 'react';

import {
  BbbPluginSdk,
  DataChannelTypes,
  PluginApi,
  RESET_DATA_CHANNEL,
} from 'bigbluebutton-html-plugin-sdk';
import {
  ModalInformationFromPresenter,
  PickRandomUserPluginProps,
  PickedUser,
  PickedUserIsShowing,
  UsersMoreInformationGraphqlResponse,
} from './types';
import { USERS_MORE_INFORMATION } from './queries';
import { PickUserModal } from '../modal/component';
import { Role } from './enums';
import ActionButtonDropdownManager from '../extensible-areas/action-button-dropdown/component';

function PickRandomUserPlugin({ pluginUuid: uuid }: PickRandomUserPluginProps) {
  BbbPluginSdk.initialize(uuid);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pickedUser, setPickedUser] = useState<PickedUser | undefined>();
  const [userFilterViewer, setUserFilterViewer] = useState<boolean>(true);
  const [filterOutPresenter, setFilterOutPresenter] = useState<boolean>(true);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);
  const currentUserInfo = pluginApi.useCurrentUser();
  const { data: currentUser } = currentUserInfo;
  const [showPresenterView, setShowPresenterView] = useState<boolean>(
    currentUser?.presenter && !pickedUser,
  );
  const allUsersInfo = pluginApi
    .useCustomSubscription<UsersMoreInformationGraphqlResponse>(USERS_MORE_INFORMATION);
  const { data: allUsers } = allUsersInfo;

  const { data: pickedUserFromDataChannelResponse, pushEntry: pushEntryPickedUser, deleteEntry: deleteEntryPickedUser } = pluginApi.useDataChannel<PickedUser>('pickRandomUser');
  const { data: pickedUserIsShowingResponse, pushEntry: pushEntryPickedUserIsShowing } = pluginApi.useDataChannel<PickedUserIsShowing>('pickRandomUser', DataChannelTypes.LATEST_ITEM, 'isShowing');
  const { data: modalInformationFromPresenter, pushEntry: pushEntryModalInformationFromPresenter } = pluginApi.useDataChannel<ModalInformationFromPresenter>('modalInformationFromPresenter');

  const pickedUserFromDataChannel = {
    data: pickedUserFromDataChannelResponse?.data,
    loading: false,
  };

  useEffect(() => {
    const modalInformationList = modalInformationFromPresenter
      .data;
    const modalInformation = modalInformationList
      ? modalInformationList[modalInformationList.length - 1]?.payloadJson : null;
    if (modalInformation) {
      setFilterOutPresenter(modalInformation.skipPresenter);
      setUserFilterViewer(modalInformation.skipModerators);
    }
  }, [modalInformationFromPresenter]);

  const usersToBePicked: UsersMoreInformationGraphqlResponse = {
    user: allUsers?.user.filter((user) => {
      let roleFilter = true;
      if (userFilterViewer) roleFilter = user.role === Role.VIEWER;
      // Check if data has loaded
      if (pickedUserFromDataChannel.data) {
        return roleFilter && pickedUserFromDataChannel
          .data.findIndex(
            (u) => u?.payloadJson?.userId === user?.userId,
          ) === -1;
      }
      return roleFilter;
    }).filter((user) => {
      if (filterOutPresenter) return !user.presenter;
      return true;
    }),
  };

  const handlePickRandomUser = () => {
    if (usersToBePicked && usersToBePicked.user.length > 0 && currentUser?.presenter) {
      const randomIndex = Math.floor(Math.random() * usersToBePicked.user.length);
      const randomlyPickedUser = usersToBePicked.user[randomIndex];
      pushEntryPickedUser(randomlyPickedUser);
      pushEntryPickedUserIsShowing({ isShowing: true });
    }
    setShowModal(true);
  };

  const resetPickedUserHistory = () => {
    deleteEntryPickedUser([RESET_DATA_CHANNEL]);
  };

  const handleBackToPresenterView = () => {
    if (currentUser?.presenter) {
      setShowPresenterView(true);
      pushEntryPickedUserIsShowing({ isShowing: false });
    }
  };

  const handleCloseModal = (): void => {
    if (currentUser?.presenter) {
      pushEntryModalInformationFromPresenter({
        skipModerators: userFilterViewer,
        skipPresenter: filterOutPresenter,
      });
      pushEntryPickedUserIsShowing({ isShowing: false });
    }
    setShowModal(false);
  };

  // Check the picked-user response in data-channel
  useEffect(() => {
    // If data already loaded and there is some picked-user:
    // then set local state picked-user and open modal
    if (pickedUserFromDataChannel.data
      && pickedUserFromDataChannel.data?.length > 0) {
      const pickedUserToUpdate = pickedUserFromDataChannel
        .data[0];
      setPickedUser(pickedUserToUpdate?.payloadJson);
      if (pickedUserToUpdate?.payloadJson) setShowModal(true);
    // If data already loaded, but there is none picked user
    // Then set local picked-user to null
    } else if (pickedUserFromDataChannel.data
        && pickedUserFromDataChannel.data?.length === 0) {
      setPickedUser(null);
      if (currentUser && !currentUser.presenter) setShowModal(false);
    }
  }, [pickedUserFromDataChannelResponse]);

  useEffect(() => {
    if (!pickedUser && !currentUser?.presenter) setShowModal(false);
  }, [pickedUser]);

  useEffect(() => {
    if (!currentUser?.presenter && pushEntryModalInformationFromPresenter) handleCloseModal();
  }, [currentUser]);

  const showPickedUser: boolean = (pickedUserIsShowingResponse?.data)
    ? pickedUserIsShowingResponse?.data[0]?.payloadJson.isShowing : false;

  // Keeps track if the current user looses presenter status and if it needs to show the picked-user
  useEffect(() => {
    setShowPresenterView(currentUser?.presenter && !showPickedUser);
  }, [currentUser, pickedUserIsShowingResponse]);
  return (
    <>
      <PickUserModal
        {...{
          showModal,
          handleCloseModal,
          users: usersToBePicked?.user,
          pickedUser,
          handlePickRandomUser,
          currentUser,
          filterOutPresenter,
          setFilterOutPresenter,
          userFilterViewer,
          setUserFilterViewer,
          dataChannelPickedUsers: pickedUserFromDataChannel.data,
          resetPickedUserHistory,
          showPickedUser,
          handleBackToPresenterView,
          showPresenterView,
        }}
      />
      <ActionButtonDropdownManager
        {...{
          pickedUser,
          currentUser,
          pluginApi,
          setShowModal,
          currentUserInfo,
        }}
      />
    </>
  );
}

export default PickRandomUserPlugin;
