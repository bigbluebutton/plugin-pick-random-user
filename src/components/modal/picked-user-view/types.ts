import { CurrentUserData } from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';
import { PushEntryFunction, ReplaceEntryFunction } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import { PickedUser, PickedUserWithEntryId } from '../../pick-random-user/types';

export interface PickedUserViewComponentProps {
    intl: IntlShape;
    updatePickedRandomUser: ReplaceEntryFunction<PickedUser>;
    pickedUserWithEntryId: PickedUserWithEntryId;
    currentUser: CurrentUserData;
    setShowPresenterView: React.Dispatch<React.SetStateAction<boolean>>;
    dispatcherPickedUser: PushEntryFunction
}
