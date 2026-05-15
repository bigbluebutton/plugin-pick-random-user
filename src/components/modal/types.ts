import { IntlShape } from 'react-intl';
import { CurrentUserData } from 'bigbluebutton-html-plugin-sdk';
import { ReplaceEntryFunction } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import { PickedUser, PickedUserWithEntryId } from '../pick-random-user/types';

export interface PickUserModalProps {
  intl: IntlShape;
  showModal: boolean;
  updatePickedRandomUser: ReplaceEntryFunction<PickedUser>;
  handleCloseModal: () => void;
  pickedUserWithEntryId: PickedUserWithEntryId;
  currentUser: CurrentUserData;
  isBot: boolean;
}
