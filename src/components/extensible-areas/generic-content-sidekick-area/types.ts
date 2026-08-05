import { CurrentUserData, PluginApi } from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';
import { PickRandomUserSettings } from '../../../commons/types';

export interface GenericContentSidekickAreaManagerProps {
    pluginApi: PluginApi;
    intl: IntlShape;
    currentUser: CurrentUserData;
    pickRandomUserSettings: PickRandomUserSettings;
}
