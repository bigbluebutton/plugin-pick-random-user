import * as React from 'react';
import { useState, useEffect } from 'react';
import { createIntl, createIntlCache } from 'react-intl';

import { BbbPluginSdk, PluginApi, RESET_DATA_CHANNEL } from 'bigbluebutton-html-plugin-sdk';
import hasCurrentUserSeenPickedUser from '../../utils/utils';
import {
  ModalInformationFromPresenter,
  PickRandomUserPluginProps,
  PickedUserSeenEntryDataChannel,
  PickedUser,
  PickedUserWithEntryId,
  UsersMoreInformationGraphqlResponse,
} from './types';
import { USERS_MORE_INFORMATION } from './queries';
import { PickUserModal } from '../modal/component';
import { Role } from './enums';
import ActionButtonDropdownManager from '../extensible-areas/action-button-dropdown/component';

const LOCALE_REQUEST_OBJECT = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  ? {
    headers: {
      'ngrok-skip-browser-warning': 'any',
    },
  } : null;

function PickRandomUserPlugin({ pluginUuid: uuid }: PickRandomUserPluginProps) {
  BbbPluginSdk.initialize(uuid);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [
    pickedUserWithEntryId,
    setPickedUserWithEntryId] = useState<PickedUserWithEntryId | undefined>();
  const [userFilterViewer, setUserFilterViewer] = useState<boolean>(true);
  const [filterOutPresenter, setFilterOutPresenter] = useState<boolean>(true);
  const [filterOutPickedUsers, setFilterOutPickedUsers] = useState<boolean>(true);

  const { data: pluginSettings, loading: isPluginSettingsLoading } = pluginApi.usePluginSettings();

  useEffect(() => {
    if (!isPluginSettingsLoading
      && pluginSettings
      && pluginSettings.pingSoundEnabled) {
      Notification.requestPermission();
    }
  }, [isPluginSettingsLoading, pluginSettings]);

  const currentUserInfo = pluginApi.useCurrentUser();
  const shouldUnmountPlugin = pluginApi.useShouldUnmountPlugin();
  const { data: currentUser } = currentUserInfo;
  const allUsersInfo = pluginApi
    .useCustomSubscription<UsersMoreInformationGraphqlResponse>(USERS_MORE_INFORMATION);
  const { data: allUsers } = allUsersInfo;

  const {
    messages: localeMessages,
    currentLocale,
    loading: localeMessagesLoading,
  } = pluginApi.useLocaleMessages(LOCALE_REQUEST_OBJECT);

  const cache = createIntlCache();
  const intl = (!localeMessagesLoading && localeMessages) ? createIntl({
    locale: currentLocale,
    messages: localeMessages,
    fallbackOnEmptyString: true,
  }, cache) : null;

  const {
    data: pickedUserFromDataChannelResponse,
    pushEntry: pushPickedUser,
    deleteEntry: deletePickedUser,
  } = pluginApi.useDataChannel<PickedUser>('pickRandomUser');
  const {
    data: modalInformationFromPresenter,
    pushEntry: dispatchModalInformationFromPresenter,
  } = pluginApi.useDataChannel<ModalInformationFromPresenter>('modalInformationFromPresenter');

  const {
    data: pickedUserSeenEntries,
    pushEntry: pushPickedUserSeen,
    deleteEntry: deletePickedUserSeenEntries,
  } = pluginApi.useDataChannel<PickedUserSeenEntryDataChannel>('pickedUserSeenEntry');

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
      setFilterOutPickedUsers(!modalInformation.includePickedUsers);
    }
  }, [modalInformationFromPresenter]);

  const usersToBePicked: UsersMoreInformationGraphqlResponse = {
    user: allUsers?.user.filter((user) => {
      let roleFilter = true;
      if (userFilterViewer) roleFilter = user.role === Role.VIEWER;
      if (filterOutPickedUsers && pickedUserFromDataChannel.data) {
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
      deletePickedUserSeenEntries([RESET_DATA_CHANNEL]);
      const randomIndex = Math.floor(Math.random() * usersToBePicked.user.length);
      const randomlyPickedUser = usersToBePicked.user[randomIndex];
      pushPickedUser(randomlyPickedUser);
    }
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    if (currentUser?.presenter) {
      dispatchModalInformationFromPresenter({
        skipModerators: userFilterViewer,
        skipPresenter: filterOutPresenter,
        includePickedUsers: !filterOutPickedUsers,
      });
      pushPickedUser(null);
    }
    setShowModal(false);
  };

  useEffect(() => {
    if (pickedUserFromDataChannel.data
      && pickedUserFromDataChannel.data?.length > 0) {
      const pickedUserToUpdate = pickedUserFromDataChannel
        .data[0];
      if (pickedUserToUpdate?.entryId !== pickedUserWithEntryId?.entryId) {
        setPickedUserWithEntryId({
          pickedUser: pickedUserToUpdate?.payloadJson,
          entryId: pickedUserToUpdate.entryId,
        });
      }
      const hasCurrentUserSeen = hasCurrentUserSeenPickedUser(
        pickedUserSeenEntries,
        currentUser?.userId,
        pickedUserToUpdate?.payloadJson.userId,
      );
      if (!hasCurrentUserSeen && !pickedUserSeenEntries?.loading) {
        setShowModal(true);
      }
    } else if (pickedUserFromDataChannel.data
        && pickedUserFromDataChannel.data?.length === 0) {
      setPickedUserWithEntryId(null);
      if (currentUser && !currentUser.presenter) setShowModal(false);
    }
  }, [pickedUserFromDataChannelResponse, pickedUserSeenEntries]);

  useEffect(() => {
    if (!pickedUserWithEntryId && !currentUser?.presenter) setShowModal(false);
  }, [pickedUserWithEntryId]);

  useEffect(() => {
    if (!currentUser?.presenter && dispatchModalInformationFromPresenter) handleCloseModal();
  }, [currentUser]);
  if (!intl || localeMessagesLoading) return null;
  return !shouldUnmountPlugin && (
    <>
      <PickUserModal
        {...{
          pluginSettings,
          isPluginSettingsLoading,
          intl,
          showModal,
          handleCloseModal,
          users: usersToBePicked?.user,
          pickedUserWithEntryId,
          handlePickRandomUser,
          currentUser,
          filterOutPresenter,
          setFilterOutPresenter,
          userFilterViewer,
          setUserFilterViewer,
          filterOutPickedUsers,
          setFilterOutPickedUsers,
          dataChannelPickedUsers: pickedUserFromDataChannel.data,
          dispatcherPickedUser: pushPickedUser,
          deletionFunction: deletePickedUser,
          pickedUserSeenEntries,
          pushPickedUserSeen,
        }}
      />
      <ActionButtonDropdownManager
        {...{
          intl,
          pickedUserWithEntryId,
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
