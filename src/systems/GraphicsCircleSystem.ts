import {defineQuery, enterQuery, exitQuery} from 'bitecs';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {Container, Graphics} from 'pixi.js';
import {GraphicsCircle} from '../components/GraphicsCircle';

export const createGraphicsCircleSystem = (container: Container) => {
  //container.filters = [new AdvancedBloomFilter()];
  const graphicsQuery = defineQuery([Transform, GraphicsCircle]);
  const enterGraphicsQuery = enterQuery(graphicsQuery);
  const exitGraphicsQuery = exitQuery(graphicsQuery);
  const graphicsMap: Record<number, Graphics> = {};

  return (world: World) => {
    for (const eid of enterGraphicsQuery(world)) {
      const graphics = new Graphics();
      graphics.beginFill(GraphicsCircle.color[eid]);
      graphics.drawCircle(0, 0, GraphicsCircle.radius[eid]);
      container.addChild(graphics);
      graphicsMap[eid] = graphics;
    }

    for (const eid of graphicsQuery(world)) {
      const graphics = graphicsMap[eid];
      graphics.x = Transform.finalPosition.x[eid];
      graphics.y = Transform.finalPosition.y[eid];
    }

    for (const eid of exitGraphicsQuery(world)) {
      const graphics = graphicsMap[eid];
      graphics.destroy();
      delete graphicsMap[eid];
    }

    return world;
  }
}
