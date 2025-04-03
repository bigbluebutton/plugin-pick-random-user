import { PluginSettingsData } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-consumption/domain/settings/plugin-settings/types';
import { CurrentUserData, DeleteEntryFunction } from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';
import { DataChannelEntryResponseType, PushEntryFunction, ReplaceEntryFunction } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import { PickedUser, PickedUserWithEntryId } from '../pick-random-user/types';

export interface PickUserModalProps {
  pluginSettings: PluginSettingsData;
  isPluginSettingsLoading: boolean;
  intl: IntlShape
  showModal: boolean;
  updatePickedRandomUser: ReplaceEntryFunction<PickedUser>;
  handleCloseModal: () => void;
  users?: PickedUser[];
  pickedUserWithEntryId: PickedUserWithEntryId;
  handlePickRandomUser: () => void;
  currentUser: CurrentUserData;
  filterOutPresenter: boolean,
  setFilterOutPresenter: (filter: boolean) => void,
  userFilterViewer: boolean;
  setUserFilterViewer: (filter: boolean) => void;
  filterOutPickedUsers: boolean,
  setFilterOutPickedUsers: (filter: boolean) => void,
  dataChannelPickedUsers?: DataChannelEntryResponseType<PickedUser>[];
  deletionFunction: DeleteEntryFunction;
  dispatcherPickedUser: PushEntryFunction;
}

export interface WindowClientSettings extends Window {
  meetingClientSettings?: {
    public: {
      app: {
        cdn: string;
        basename: string;
      }

    }
  }
}
