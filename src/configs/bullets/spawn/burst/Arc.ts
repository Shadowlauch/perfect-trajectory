import {Transform} from '../../../../components/Transform';
import {BurstFunction} from './BurstFunction';

export const createArcBurst = (burstBulletCount: number, angleSpread: number): BurstFunction => {
  return (_world, spawner) => {
    const x = Transform.position.x[spawner];
    const y = Transform.position.y[spawner];
    const burstAngleSpread = angleSpread / 180 * Math.PI;
    const angleStep = burstAngleSpread / (burstBulletCount - 1);
    const initialVelAngle = Transform.rotation[spawner] - burstAngleSpread / 2;
    const bullets = [];
    for (let i = 0; i < burstBulletCount; ++i) {
      const velAngel = initialVelAngle + i * angleStep;
      bullets.push({x, y, angle: velAngel, speed: 0.1})
    }
    return bullets;
  }
}
