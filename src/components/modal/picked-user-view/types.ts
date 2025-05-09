import {
  CurrentUserData,
  DataChannelEntryResponseType,
  GraphqlResponseWrapper,
  PushEntryFunction,
} from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';
import { PickedUserWithEntryId, PickedUserSeenEntryDataChannel } from '../../pick-random-user/types';

export interface PickedUserViewComponentProps {
    intl: IntlShape;
    pickedUserWithEntryId: PickedUserWithEntryId;
    currentUser: CurrentUserData;
    pickedUserSeenEntries: GraphqlResponseWrapper<
        DataChannelEntryResponseType<PickedUserSeenEntryDataChannel>[]>;
    pushPickedUserSeen: PushEntryFunction<PickedUserSeenEntryDataChannel>;
    setShowPresenterView: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ModalAvatarProps {
    background: string;
}
