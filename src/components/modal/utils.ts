import { pluginLogger } from 'bigbluebutton-html-plugin-sdk';

import { TIMEOUT_CLOSE_NOTIFICATION } from '../../commons/constants';
import { WindowClientSettings } from './types';

declare const window: WindowClientSettings;

export function notifyRandomlyPickedUser(message: string) {
  if (!('Notification' in window)) {
    pluginLogger.warn('This browser does not support notifications');
  } else if (Notification.permission === 'granted') {
    const notification = new Notification(message);
    setTimeout(() => {
      notification.close();
    }, TIMEOUT_CLOSE_NOTIFICATION);
  } else if (Notification.permission !== 'denied') {
    pluginLogger.warn('Browser notification permission has been denied');
  }
}

export function pingSoundForRandomlyPickedUser(pingSoundUrl: string) {
  const audio = new Audio(pingSoundUrl);
  audio.play();
}
