import { DataChannelEntryResponseType, UsersBasicInfoResponseFromGraphqlWrapper } from 'bigbluebutton-html-plugin-sdk';
import {
  PickedUser,
} from '../../pick-random-user/types';
import { Role } from '../../pick-random-user/enums';
import { FilterOptionsType } from '../types';

export const filterPossibleUsersToBePicked = (
  allUsers: UsersBasicInfoResponseFromGraphqlWrapper | undefined,
  pickedUserFromDataChannel: DataChannelEntryResponseType<PickedUser>[],
  filterOptions: FilterOptionsType,
) => ({
  user: allUsers?.user.filter((user) => !user.bot).filter((user) => {
    if (!filterOptions.includeModerators) return user.role === Role.VIEWER;
    return true;
  }).filter((user) => {
    if (!filterOptions.includePresenter) return !user.presenter;
    return true;
  }).filter((user) => {
    if (!filterOptions.includePickedUsers && pickedUserFromDataChannel) {
      return pickedUserFromDataChannel.findIndex(
        (u) => u?.payloadJson?.userId === user?.userId,
      ) === -1;
    }
    return true;
  }) || [],
});

/**
 * Formats the moment a user was picked as a zero-padded local `HH:mm` label,
 * used in the "previously picked" list of the presenter view.
 * @param createdAt timestamp of the pick (anything accepted by the Date constructor)
 * @returns the local time as `HH:mm`
 */
export const formatPickedTime = (createdAt: string | number | Date): string => {
  const time = new Date(createdAt);
  const hh = String(time.getHours()).padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};
