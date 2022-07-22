import {Transform} from '../../../../components/Transform';
import {LoopFunction} from './LoopFunction';

export const createPlayerTargetLoop = (player: number): LoopFunction => {
  return (_world, spawner) => {
    // get player position if now is the start of a burst
    const targetX = Transform.position.x[player];
    const targetY = Transform.position.y[player];

    const distanceX = targetX - Transform.position.x[spawner];
    const distanceY = targetY - Transform.position.y[spawner];

    Transform.rotation[spawner] = Math.atan2(distanceY, distanceX);
  }
}
