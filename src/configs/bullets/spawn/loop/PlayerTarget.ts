import {Transform} from '../../../../components/Transform';
import {LoopFunction} from './LoopFunction';

export const createPlayerTargetLoop = (player: number): LoopFunction => {
  return (_world, spawner) => {
    // get player position if now is the start of a burst
    const targetX = Transform.finalPosition.x[player];
    const targetY = Transform.finalPosition.y[player];

    const distanceX = targetX - Transform.finalPosition.x[spawner];
    const distanceY = targetY - Transform.finalPosition.y[spawner];

    Transform.rotation[spawner] = Math.atan2(distanceY, distanceX);
  }
}
