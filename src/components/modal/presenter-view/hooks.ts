import { useEffect } from 'react';
import {
  PluginApi,
  RESET_DATA_CHANNEL,
  UsersBasicInfoData,
  pluginLogger,
} from 'bigbluebutton-html-plugin-sdk';
import {
  FilterOptionsType,
} from '../types';
import { PickedUser, PickedUserSeenEntryDataChannel } from '../../pick-random-user/types';
import { filterPossibleUsersToBePicked } from './utils';

export function useGetPickRandomUserFunction(
  pluginApi: PluginApi,
  possibleUsersToBePicked: UsersBasicInfoData[],
) {
  const currentUserInfo = pluginApi.useCurrentUser();
  const { data: currentUser } = currentUserInfo;

  const {
    pushEntry: pushPickedUser,
  } = pluginApi.useDataChannel<PickedUser>('pickRandomUser');

  const {
    deleteEntry: deletePickedUserSeenEntries,
  } = pluginApi.useDataChannel<PickedUserSeenEntryDataChannel>('pickedUserSeenEntry');

  const handlePickRandomUser = () => {
    if (
      possibleUsersToBePicked
      && possibleUsersToBePicked.length > 0
      && currentUser?.presenter
    ) {
      deletePickedUserSeenEntries([RESET_DATA_CHANNEL]);
      const randomIndex = Math.floor(Math.random() * possibleUsersToBePicked.length);
      const randomlyPickedUser = possibleUsersToBePicked[randomIndex];
      pushPickedUser(randomlyPickedUser);
    }
  };

  return handlePickRandomUser;
}

export function useGetPossibleUsersToBePicked(
  pluginApi: PluginApi,
  filterOptions: FilterOptionsType,
) {
  const allUsersInfo = pluginApi?.useUsersBasicInfo
    ? pluginApi?.useUsersBasicInfo()
    : { data: undefined as undefined, loading: false, error: undefined };
  const { data: allUsers } = allUsersInfo;

  // TEMPORARY DEBUG INSTRUMENTATION — investigating an "unstable connection empties
  // the available-users list" report. Remove once diagnosed.
  useEffect(() => {
    pluginLogger.debug({
      logCode: 'pick_random_user_debug_users_basic_info',
      extraInfo: {
        timestamp: new Date().toISOString(),
        loading: allUsersInfo.loading,
        hasError: !!allUsersInfo.error,
        userCount: allUsers?.user?.length,
        users: allUsers?.user?.map((u) => ({
          userId: u.userId,
          name: u.name,
          role: u.role,
          isModerator: u.isModerator,
          presenter: u.presenter,
          bot: u.bot,
        })),
      },
    }, '[DEBUG pick-random-user] useUsersBasicInfo update');
  }, [allUsersInfo]);

  const {
    data: pickedUserFromDataChannelResponse,
  } = pluginApi.useDataChannel<PickedUser>('pickRandomUser');
  const pickedUserFromDataChannel = pickedUserFromDataChannelResponse?.data || [];

  const result = filterPossibleUsersToBePicked(
    allUsers,
    pickedUserFromDataChannel,
    filterOptions,
  ).user;

  // TEMPORARY DEBUG INSTRUMENTATION — see above.
  useEffect(() => {
    pluginLogger.debug({
      logCode: 'pick_random_user_debug_filtered_result',
      extraInfo: {
        timestamp: new Date().toISOString(),
        resultCount: result.length,
        resultUserIds: result.map((u) => u.userId),
        filterOptions,
      },
    }, '[DEBUG pick-random-user] usersToBePicked recomputed');
  }, [result, filterOptions]);

  return result;
}
