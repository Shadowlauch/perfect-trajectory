import {World} from '../main';
import {eventManager} from '../events/EventManager';
import {hasComponent, removeEntity} from 'bitecs';
import {PlayerComponent} from '../components/PlayerComponent';

export const createPlayerHitSystem = (world: World) => {
  eventManager.on('collision', ({first, second}) => {
    if (hasComponent(world, PlayerComponent, first)) {
      removeEntity(world, second);
      PlayerComponent.lives[first] = Math.max(0, PlayerComponent.lives[first] - 1);
    }
  });

  return (world: World) => world;
};
