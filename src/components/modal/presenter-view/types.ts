import { DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import { PickedUser } from '../../pick-random-user/types';

export interface PresenterViewComponentProps {
    filterOutPresenter: boolean;
    setFilterOutPresenter: (filter: boolean) => void;
    userFilterViewer: boolean;
    setUserFilterViewer: (filter: boolean) => void;
    resetPickedUserHistory: () => void;
    handlePickRandomUser: () => void;
    dataChannelPickedUsers?: DataChannelEntryResponseType<PickedUser>[];
    pickedUser: PickedUser;
    users?: PickedUser[];
    userRole: string;
}
