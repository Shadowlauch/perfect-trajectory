import {TransformComponent} from '../../../../components/TransformComponent';
import {LoopFunction} from './LoopFunction';

export const createPlayerTargetLoop = (player: number): LoopFunction => {
  return (_world, spawner) => {
    // get player position if now is the start of a burst
    const targetX = TransformComponent.globalPosition.x[player];
    const targetY = TransformComponent.globalPosition.y[player];

    const distanceX = targetX - TransformComponent.globalPosition.x[spawner];
    const distanceY = targetY - TransformComponent.globalPosition.y[spawner];

    TransformComponent.rotation[spawner] = Math.atan2(distanceY, distanceX);
  }
}
