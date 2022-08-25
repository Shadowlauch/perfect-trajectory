import {defineQuery, exitQuery, removeEntity} from 'bitecs';
import {World} from '../main';
import {EventListenerComponent} from '../components/EventListenerComponent';

export const createEventListenerCleanupSystem = () => {
  const entityQuery = defineQuery([]);
  const entityExitQuery = exitQuery(entityQuery);
  const eventListenerQuery = defineQuery([EventListenerComponent]);

  return (world: World) => {
    for (const entity of entityExitQuery(world)) {
      for (const eventListener of eventListenerQuery(world)) {
        if (EventListenerComponent.eid[eventListener] === entity) {
          removeEntity(world, eventListener);
        }
      }
    }

    return world;
  }
}
