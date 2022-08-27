import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';
import {PathPoint} from '../configs/enemies/EnemyConfig';
import {configManager} from '../configs/ConfigManager';

export const PathComponent = defineComponent({starTime: Types.f32, configIndex: Types.ui8, startX: Types.f32, startY: Types.f32});

export const addPathComponent = (world: World, entity:number, x: number, y: number, config: PathPoint[]) => {
  addComponent(world, PathComponent, entity);
  PathComponent.startX[entity] = x;
  PathComponent.startY[entity] = y;
  PathComponent.configIndex[entity] = configManager.add(config);
  PathComponent.starTime[entity] = world.time.elapsed;
}
