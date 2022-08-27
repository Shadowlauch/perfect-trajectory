import {defineQuery} from 'bitecs';
import {AccelComponent, AngularSpeedComponent, SpeedComponent, VelocityComponent} from '../components/Physics';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';

export const createMovementSystem = () => {
  const accelQuery = defineQuery([AccelComponent, SpeedComponent]);
  const angspdQuery = defineQuery([AngularSpeedComponent, TransformComponent]);
  const speedQuery = defineQuery([SpeedComponent, VelocityComponent, TransformComponent]);
  const movementQuery = defineQuery([VelocityComponent, TransformComponent]);

  return (world: World) => {
    const { time: { delta } } = world;
    const accel = accelQuery(world);
    const angspd = angspdQuery(world);
    const speed = speedQuery(world);
    const move = movementQuery(world);

    // Modify higher order derivatives first
    for (let i = 0; i < accel.length; i++) {
      const eid = accel[i];
      SpeedComponent.val[eid] += AccelComponent.val[eid];
    }

    for (let i = 0; i < angspd.length; i++) {
      const eid = angspd[i];
      TransformComponent.rotation[eid] += AngularSpeedComponent.val[eid];
    }

    for (let i = 0; i < speed.length; i++) {
      const eid = speed[i];
      VelocityComponent.x[eid] = Math.cos(TransformComponent.rotation[eid]) * SpeedComponent.val[eid];
      VelocityComponent.y[eid] = Math.sin(TransformComponent.rotation[eid]) * SpeedComponent.val[eid];
    }

    for (let i = 0; i < move.length; i++) {
      const eid = move[i];
      TransformComponent.position.x[eid] += VelocityComponent.x[eid] * delta;
      TransformComponent.position.y[eid] += VelocityComponent.y[eid] * delta;
    }
    return world;
  }
}
