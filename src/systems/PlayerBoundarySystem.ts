import {defineQuery} from 'bitecs';
import {World} from '../main';
import {PlayerComponent} from '../components/PlayerComponent';
import {TransformComponent} from '../components/TransformComponent';

export const createPlayerBoundarySystem = () => {
  const playerQuery = defineQuery([PlayerComponent])

  return (world: World) => {
    const { size: {width, height} } = world
    const pid = playerQuery(world)[0];

    TransformComponent.globalPosition.x[pid] = Math.max(0, Math.min(width, TransformComponent.globalPosition.x[pid]));
    TransformComponent.globalPosition.y[pid] = Math.max(0, Math.min(height, TransformComponent.globalPosition.y[pid]));

    return world
  }
}
