import {defineQuery} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {World} from '../main';
import {Player} from '../components/Player';

export const createPlayerMovementSystem = () => {
  const playerQuery = defineQuery([Player])

  return (world: World) => {
    const { input, time: {delta} } = world
    const pid = playerQuery(world)[0];

    const moveSpeed = 0.06 * delta;
    const dX = input.down('a') ? -1 : (input.down('d') ? 1 : 0);
    const dY = input.down('w') ? -1 : (input.down('s') ? 1 : 0);
    const angle = Math.atan2(dY, dX);
    const velX = dX !== 0 ? moveSpeed * Math.cos(angle) : 0;
    const velY = dY !== 0 ? moveSpeed * Math.sin(angle) : 0;
    //const totalVel = Math.abs(velX) + Math.abs(velY);

    Velocity.x[pid] = velX;
    Velocity.y[pid] = velY;


    return world
  }
}
