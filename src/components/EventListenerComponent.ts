import {addComponent, addEntity, defineComponent, Types} from 'bitecs';
import {World} from '../main';
import {configManager} from '../configs/ConfigManager';

export enum EventTypes {
  'DEATH'
}

export const EventListenerComponent = defineComponent({
  eid: Types.eid,
  type: Types.ui8,
  configIndex: Types.ui8
});

export interface EventConfig {
  callback: () => void;
}

export const addEventListenerEntity = (world: World, referenceEntity: number, type: `${Lowercase<keyof typeof EventTypes>}`, config: EventConfig) => {
  const eid = addEntity(world);
  addComponent(world, EventListenerComponent, eid);
  EventListenerComponent.eid[eid] = referenceEntity;
  EventListenerComponent.type[eid] = EventTypes[type.toUpperCase() as keyof typeof EventTypes];
  EventListenerComponent.configIndex[eid] = configManager.add(config);

  return eid;
}
