import {defineQuery} from 'bitecs';
import {World} from '../main';
import {Player} from '../components/Player';
import {Position} from '../components/Position';

export const createPlayerBoundarySystem = () => {
  const playerQuery = defineQuery([Player])

  return (world: World) => {
    const { size: {width, height} } = world
    const pid = playerQuery(world)[0];

    Position.x[pid] = Math.max(0, Math.min(width, Position.x[pid]));
    Position.y[pid] = Math.max(0, Math.min(height, Position.y[pid]));

    return world
  }
}
