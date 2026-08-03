import { PluginApi } from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';

export interface PickRandomUserPanelContentProps {
    pluginApi: PluginApi;
    intl: IntlShape;
}

export interface PickRandomUserPanelProps extends PickRandomUserPanelContentProps {
    modalUiScale: number;
}
