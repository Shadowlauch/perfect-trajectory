import {Transform} from '../../../../components/Transform';
import {Enemy} from '../../../../components/Enemy';
import {LoopFunction} from './LoopFunction';

export const createPlayerTargetLoop = (): LoopFunction => {
  return (_world, enemy, player) => {
    // get player position if now is the start of a burst
    const targetX = Transform.position.x[player];
    const targetY = Transform.position.y[player];

    const distanceX = targetX - Transform.position.x[enemy];
    const distanceY = targetY - Transform.position.y[enemy];

    Enemy.bulletAngle[enemy] = Math.atan2(distanceY, distanceX);
  }
}
