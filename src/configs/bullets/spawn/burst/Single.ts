import {Transform} from '../../../../components/Transform';
import {BurstFunction} from './BurstFunction';

export const createSingleBurst = (): BurstFunction => {
  return (_world, spawner) => {
    const x = Transform.globalPosition.x[spawner];
    const y = Transform.globalPosition.y[spawner];
    const initialVelAngle = Transform.globalRotation[spawner];
    const bullets = [];
    bullets.push({x, y, rotation: initialVelAngle, speed: 0.1})
    return bullets;
  }
}
