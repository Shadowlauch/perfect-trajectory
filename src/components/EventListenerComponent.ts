import {addComponent, addEntity, defineComponent, Types} from 'bitecs';
import {World} from '../main';
import {configManager} from '../configs/ConfigManager';


export const EventListenerComponent = defineComponent({
  eid: Types.eid,
  configIndex: Types.ui8
});

export interface EventConfig {
  onDeath?: () => void;
}

export const addEventListenerEntity = (world: World, referenceEntity: number, config: EventConfig) => {
  const eid = addEntity(world);
  addComponent(world, EventListenerComponent, eid);
  EventListenerComponent.eid[eid] = referenceEntity;
  EventListenerComponent.configIndex[eid] = configManager.add(config);

  return eid;
}
