import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';

export const BossComponent = defineComponent({
  stageEid: Types.eid
});

export const addBossComponent = (world: World, entity: number, stageEid: number) => {
  addComponent(world, BossComponent, entity);
  BossComponent.stageEid[entity] = stageEid;
}
