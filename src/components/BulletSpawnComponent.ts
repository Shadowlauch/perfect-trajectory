import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';
import {BulletSpawnConfig} from '../configs/bullets/spawn/BulletSpawnConfig';
import {configManager} from '../configs/ConfigManager';

export const BulletSpawnComponent = defineComponent({startTime: Types.f32, configIndex: Types.ui8});

export const addBulletSpawnComponent = (world: World, entity: number, config: BulletSpawnConfig) => {
  addComponent(world, BulletSpawnComponent, entity);
  BulletSpawnComponent.startTime[entity] = world.time.elapsed;
  BulletSpawnComponent.configIndex[entity] = configManager.add(config);
}
