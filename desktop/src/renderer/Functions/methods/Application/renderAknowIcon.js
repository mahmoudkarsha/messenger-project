import doubleTickBlack from '../../../Assets/imgs/doubleTickBlack.png';
import singleTick from '../../../Assets/imgs/singleTick.png';
import doubleTickBlue from '../../../Assets/imgs/doubleTickBlue.png';

import wait from '../../../Assets/imgs/wait.png';

export default function renderAknowIcon(msg) {
  if (msg.is_pending) {
    return wait;
  }
  if (msg.is_read) {
    return doubleTickBlue;
  }
  if (!msg.is_recieved && !msg.is_pending) {
    return singleTick;
  }

  if (msg.is_recieved) {
    return doubleTickBlack;
  }
}
