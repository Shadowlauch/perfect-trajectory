import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';

export const BulletComponent = defineComponent({damage: Types.f32, spawnedBy: Types.eid});

export const addBulletComponent = (world: World, entity: number, spawnedBy?: number, damage = 1) => {
  addComponent(world, BulletComponent, entity);
  BulletComponent.spawnedBy[entity] = spawnedBy ?? 0;
  BulletComponent.damage[entity] = damage;
}
