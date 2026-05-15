import { PluginApi } from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';

export interface PickedUser {
    isPresenterViewing: boolean;
    presenter: boolean;
    userId: string;
    name: string;
    role: string;
    color: string;
    bot: boolean;
}

export interface PickedUserWithEntryId {
    pickedUser: PickedUser;
    entryId: string;
}

export interface PickRandomUserPluginProps {
    pluginApi: PluginApi,
    intl: IntlShape,
}

export interface UsersMoreInformationGraphqlResponse {
    user: PickedUser[];
}

export interface DataChannelArrayMessages <T> {
    createdAt: string;
    dataChannel: string;
    fromUserId: string;
    messageId: string;
    payloadJson: T;
    pluginName: string;
    toRoles: string[];
}

export interface DataChannelPickedUserResponse {
    pluginDataChannelMessage: DataChannelArrayMessages<PickedUser>[];
}

export interface DataChannelLastResetTimeResponse {
    pluginDataChannelMessage: DataChannelArrayMessages<Date>[];
}
