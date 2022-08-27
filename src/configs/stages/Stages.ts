import {Stage0} from './stage0/Stage0';
import {Stage1} from './Stage1';
import {addEntity, defineQuery, removeEntity} from 'bitecs';
import {addStageComponent, StageComponent} from '../../components/StageComponent';
import {addTimelineComponent} from '../../components/TimelineComponent';
import {World} from '../../main';

export const STAGES = [
  Stage0,
  Stage1
] as const;

export const startStage = (world: World, index?: number) => {
  const stageQuery = defineQuery([StageComponent]);
  const currentStage = stageQuery(world);
  const currentStageIndex = currentStage.length > 0 ? StageComponent.stageIndex[currentStage[0]] : null;

  if (currentStage.length > 0) removeEntity(world, currentStage[0]);

  const stageIndex =index ?? currentStageIndex ?? 0;
  const stage = addEntity(world);
  addStageComponent(world, stage, stageIndex);
  addTimelineComponent(world, stage, STAGES[stageIndex]);
};
