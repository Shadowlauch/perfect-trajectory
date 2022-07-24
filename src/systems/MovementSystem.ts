import {defineQuery} from 'bitecs';
import {Accel, AngularSpeed, Speed, Velocity} from '../components/Physics';
import {Transform} from '../components/Transform';
import {World} from '../main';

export const createMovementSystem = () => {
  const accelQuery = defineQuery([Accel, Speed]);
  const angspdQuery = defineQuery([AngularSpeed, Transform]);
  const speedQuery = defineQuery([Speed, Velocity, Transform]);
  const movementQuery = defineQuery([Velocity, Transform]);

  return (world: World) => {
    const { time: { delta } } = world;
    const accel = accelQuery(world);
    const angspd = angspdQuery(world);
    const speed = speedQuery(world);
    const move = movementQuery(world);

    // Modify higher order derivatives first
    for (let i = 0; i < accel.length; i++) {
      const eid = accel[i];
      Speed.val[eid] += Accel.val[eid];
    }

    for (let i = 0; i < angspd.length; i++) {
      const eid = angspd[i];
      Transform.angle[eid] += AngularSpeed.val[eid];
    }

    for (let i = 0; i < speed.length; i++) {
      const eid = speed[i];
      Velocity.x[eid] = Math.cos(Transform.angle[eid]) * Speed.val[eid];
      Velocity.y[eid] = Math.sin(Transform.angle[eid]) * Speed.val[eid];
    }

    for (let i = 0; i < move.length; i++) {
      const eid = move[i];
      Transform.position.x[eid] += Velocity.x[eid] * delta;
      Transform.position.y[eid] += Velocity.y[eid] * delta;
    }
    return world;
  }
}
