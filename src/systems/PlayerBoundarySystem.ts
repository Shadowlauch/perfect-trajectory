import {defineQuery} from 'bitecs';
import {World} from '../main';
import {Player} from '../components/Player';
import {Transform} from '../components/Transform';

export const createPlayerBoundarySystem = () => {
  const playerQuery = defineQuery([Player])

  return (world: World) => {
    const { size: {width, height} } = world
    const pid = playerQuery(world)[0];

    Transform.position.x[pid] = Math.max(0, Math.min(width, Transform.position.x[pid]));
    Transform.position.y[pid] = Math.max(0, Math.min(height, Transform.position.y[pid]));

    return world
  }
}
