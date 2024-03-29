import {TransformComponent} from '../../../../components/TransformComponent';
import {BurstFunction} from './BurstFunction';

export const createSprayBurst = (arcBulletCount: number, angleSpread: number, mirror: boolean = false): BurstFunction => {
  return (_world, spawner, currentBurst) => {
    const x = TransformComponent.globalPosition.x[spawner];
    const y = TransformComponent.globalPosition.y[spawner];
    const burstAngleSpread = angleSpread / 180 * Math.PI;

    const angleStep = burstAngleSpread / (arcBulletCount - 1);
    const initialVelAngle = TransformComponent.globalRotation[spawner] - burstAngleSpread / 2;

    if (mirror) {
        currentBurst += arcBulletCount - 1
    }

    const bullets = [];

    // offset from inital rotation
    // 0 means "all the way to the left"
    // angleSpread means "all the way to the right"
    
    // Example:
    // arcBulletCount = 4
    // currentBurst   position in arc      rotation
    // 0              0                    initialVelAngle
    // 1              1                    initialVelAngle + angleStep
    // 2              2                    initialVelAngle + 2*angleStep
    // 3              3                    initialVelAngle + 3*angleStep
    // 4              2                    initialVelAngle + 2*angleStep
    // 5              1                    initialVelAngle + angleStep
    // 6              0                    initialVelAngle
    // 7              1                    initialVelAngle + angleStep

    const positionLargeStep = currentBurst % (2*(arcBulletCount - 1))
    const position = (arcBulletCount - 1) - Math.abs(positionLargeStep - (arcBulletCount - 1))
    const velAngel = initialVelAngle + position * angleStep;
    
    bullets.push({x, y, rotation: velAngel, speed: 0.1})
    return bullets;
  }
}
