import {defineQuery, enterQuery, exitQuery} from 'bitecs';
import {Position} from '../components/Position';
import {World} from '../main';
import {Application, Graphics} from 'pixi.js';
import {GraphicsCircle} from '../components/GraphicsCircle';

export const createGraphicsSystem = (app: Application) => {
  const graphicsQuery = defineQuery([Position, GraphicsCircle]);
  const enterGraphicsQuery = enterQuery(graphicsQuery);
  const exitGraphicsQuery = exitQuery(graphicsQuery);
  const graphicsMap: Record<number, Graphics> = {};

  return (world: World) => {
    for (const eid of enterGraphicsQuery(world)) {
      const graphics = new Graphics();
      graphics.beginFill(GraphicsCircle.color[eid]);
      graphics.drawCircle(0, 0, GraphicsCircle.radius[eid]);
      app.stage.addChild(graphics);
      graphicsMap[eid] = graphics;
    }

    for (const eid of graphicsQuery(world)) {
      const graphics = graphicsMap[eid];
      graphics.x = Position.x[eid];
      graphics.y = Position.y[eid];
    }

    for (const eid of exitGraphicsQuery(world)) {
      const graphics = graphicsMap[eid];
      graphics.destroy();
      delete graphicsMap[eid];
    }

    return world;
  }
}
