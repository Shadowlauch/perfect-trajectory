import {TransformComponent} from '../../../../components/TransformComponent';
import {BurstFunction} from './BurstFunction';

export const createSingleBurst = (): BurstFunction => {
  return (_world, spawner) => {
    const x = TransformComponent.globalPosition.x[spawner];
    const y = TransformComponent.globalPosition.y[spawner];
    const initialVelAngle = TransformComponent.globalRotation[spawner];
    const bullets = [];
    bullets.push({x, y, rotation: initialVelAngle, speed: 0.1})
    return bullets;
  }
}
