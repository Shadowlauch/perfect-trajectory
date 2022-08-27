import {defineQuery, enterQuery, exitQuery} from 'bitecs';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';
import {Container, Graphics} from 'pixi.js';
import {GraphicsCircleComponent} from '../components/GraphicsCircleComponent';

export const createGraphicsCircleSystem = (container: Container) => {
  //container.filters = [new AdvancedBloomFilter()];
  const graphicsQuery = defineQuery([TransformComponent, GraphicsCircleComponent]);
  const enterGraphicsQuery = enterQuery(graphicsQuery);
  const exitGraphicsQuery = exitQuery(graphicsQuery);
  const graphicsMap: Record<number, Graphics> = {};

  return (world: World) => {
    for (const eid of enterGraphicsQuery(world)) {
      const graphics = new Graphics();
      graphics.beginFill(GraphicsCircleComponent.color[eid]);
      graphics.drawCircle(0, 0, GraphicsCircleComponent.radius[eid]);
      container.addChild(graphics);
      graphicsMap[eid] = graphics;
    }

    for (const eid of graphicsQuery(world)) {
      const graphics = graphicsMap[eid];
      graphics.x = TransformComponent.globalPosition.x[eid];
      graphics.y = TransformComponent.globalPosition.y[eid];
      graphics.zIndex = GraphicsCircleComponent.zIndex[eid];
    }

    for (const eid of exitGraphicsQuery(world)) {
      const graphics = graphicsMap[eid];
      graphics.destroy();
      delete graphicsMap[eid];
    }

    return world;
  }
}
