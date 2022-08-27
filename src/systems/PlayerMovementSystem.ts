import {defineQuery} from 'bitecs';
import {VelocityComponent} from '../components/Physics';
import {World} from '../main';
import {PlayerComponent} from '../components/PlayerComponent';
import Flatten from '@flatten-js/core';
import vector = Flatten.vector;

export const createPlayerMovementSystem = () => {
  const playerQuery = defineQuery([PlayerComponent])

  return (world: World) => {
    const { input } = world
    const pid = playerQuery(world)[0];
    const gamepad = navigator.getGamepads()[0];

    let dX: number;
    let dY: number;

    if (gamepad && (gamepad?.axes[2] || gamepad?.axes[3])) {
      dX = gamepad?.axes[2];
      dY = gamepad?.axes[3];
    } else {
      dX = input.down('a') ? -1 : (input.down('d') ? 1 : 0);
      dY = input.down('w') ? -1 : (input.down('s') ? 1 : 0);
    }

    const {x: velX, y: velY} = dX !== 0 || dY !== 0 ? vector(dX, dY).normalize() : {x: 0, y: 0};
    const moveSpeed = 0.2;

    VelocityComponent.x[pid] = Math.abs(dX) * velX * moveSpeed;
    VelocityComponent.y[pid] = Math.abs(dY) * velY * moveSpeed;


    return world
  }
}
