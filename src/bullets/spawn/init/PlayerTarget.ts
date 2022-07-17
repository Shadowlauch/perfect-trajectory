import {Position} from '../../../components/Position';
import {EnemyData} from '../../../components/EnemyData';
import {InitFunction} from './InitFunction';

export const createPlayerTargetInit = (): InitFunction => {
  return (_world, enemy, player) => {
    // get player position if now is the start of a burst
    const targetX = Position.x[player];
    const targetY = Position.y[player];

    const distanceX = targetX - Position.x[enemy];
    const distanceY = targetY - Position.y[enemy];

    EnemyData.bulletAngle[enemy] = Math.atan2(distanceY, distanceX);
  }
}
