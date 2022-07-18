import {Position} from '../../../../components/Position';
import {Enemy} from '../../../../components/Enemy';
import {LoopFunction} from './LoopFunction';

export const createPlayerTargetLoop = (): LoopFunction => {
  return (_world, enemy, player) => {
    // get player position if now is the start of a burst
    const targetX = Position.x[player];
    const targetY = Position.y[player];

    const distanceX = targetX - Position.x[enemy];
    const distanceY = targetY - Position.y[enemy];

    Enemy.bulletAngle[enemy] = Math.atan2(distanceY, distanceX);
  }
}
