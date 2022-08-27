import {defineQuery, exitQuery, removeEntity} from 'bitecs';
import {World} from '../main';
import {EventListenerComponent} from '../components/EventListenerComponent';
import {configManager} from '../configs/ConfigManager';

export const createEventListenerCleanupSystem = () => {
  const entityQuery = defineQuery([]);
  const entityExitQuery = exitQuery(entityQuery);
  const eventListenerQuery = defineQuery([EventListenerComponent]);

  return (world: World) => {
    for (const entity of entityExitQuery(world)) {
      for (const eventListener of eventListenerQuery(world)) {
        if (EventListenerComponent.eid[eventListener] === entity) {
          configManager.remove(EventListenerComponent.configIndex[eventListener]);
          removeEntity(world, eventListener);
        }
      }
    }

    return world;
  }
}
