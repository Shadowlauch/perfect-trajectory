import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';

export const EnemyComponent = defineComponent({spawnTime: Types.ui32, hp: Types.f32, maxHp: Types.f32});

export const addEnemyComponent = (world: World, entity: number, maxHp: number, currentHp?: number) => {
  addComponent(world, EnemyComponent, entity);
  EnemyComponent.hp[entity] = currentHp ?? maxHp;
  EnemyComponent.maxHp[entity] = maxHp;
  EnemyComponent.spawnTime[entity] = world.time.elapsed;
}
