import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';

export const GraphicsCircleComponent = defineComponent({
  radius: Types.ui8,
  color: Types.ui32,
  zIndex: Types.ui8
});

export const addGraphicsCircleComponent = (world: World, entity: number, radius: number, color: number, zIndex: number) => {
  addComponent(world, GraphicsCircleComponent, entity);
  GraphicsCircleComponent.color[entity] = color;
  GraphicsCircleComponent.radius[entity] = radius;
  GraphicsCircleComponent.zIndex[entity] = zIndex;
}
