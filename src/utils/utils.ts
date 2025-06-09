import { DataChannelEntryResponseType, GraphqlResponseWrapper } from 'bigbluebutton-html-plugin-sdk';
import { PickedUserSeenEntryDataChannel } from '../components/pick-random-user/types';

/**
 * It process data-channel information on the picked-users already seen
 * and returns a boolean indicating if the current user has seen the picked-user
 * @param pickedUserSeenEntries DataChannelEntry result
 * @param currentUserId userId from current user on which the plugin is running
 * @param pickedUserId userId from the picked user
 * @returns boolean indicating if the current user has seen the picked-user
 */
const hasCurrentUserSeenPickedUser = (
  pickedUserSeenEntries: GraphqlResponseWrapper<
    DataChannelEntryResponseType<PickedUserSeenEntryDataChannel>[]>,
  currentUserId: string,
  pickedUserId: string,
) => pickedUserSeenEntries?.data
  && pickedUserSeenEntries?.data.length > 0
  && pickedUserSeenEntries.data.some((view) => view.payloadJson
    && view.payloadJson.seenByUserId === currentUserId
    && view.payloadJson.pickedUserId === pickedUserId);

export default hasCurrentUserSeenPickedUser;
