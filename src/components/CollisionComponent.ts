import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';

export const CollisionComponent = defineComponent({
  group: Types.ui32,
  filter: Types.ui32,
  radius: Types.ui32
});

export const addCollisionComponent = (world: World, entity: number, radius: number, options: {group?: number, filter?: number}) => {
  addComponent(world, CollisionComponent, entity);
  CollisionComponent.filter[entity] = options.filter ?? 0;
  CollisionComponent.group[entity] = options.group ?? 0;
  CollisionComponent.radius[entity] = radius;
}
