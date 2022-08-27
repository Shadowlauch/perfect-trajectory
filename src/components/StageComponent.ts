import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';

export const StageComponent = defineComponent({startTime: Types.ui32, stageIndex: Types.ui8});

export const addStageComponent = (world: World, entity: number, stageIndex: number) => {
  addComponent(world, StageComponent, entity);
  StageComponent.stageIndex[entity] = stageIndex;
  StageComponent.startTime[entity] = world.time.elapsed;
}
