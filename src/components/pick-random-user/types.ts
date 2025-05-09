export interface PickedUser {
    presenter: boolean;
    userId: string;
    name: string;
    role: string;
    avatar: string;
    color: string;
}

export interface PickedUserWithEntryId {
    pickedUser: PickedUser;
    entryId: string;
}

export interface PickRandomUserPluginProps {
    pluginName: string,
    pluginUuid: string,
}

export interface UsersMoreInformationGraphqlResponse {
    user: PickedUser[];
}

export interface ModalInformationFromPresenter {
    skipModerators: boolean;
    skipPresenter: boolean;
    includePickedUsers: boolean;
}

export interface PickedUserSeenEntryDataChannel {
    pickedUserId: string;
    seenByUserId: string;
}
