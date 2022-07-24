import {defineQuery, enterQuery, exitQuery} from 'bitecs';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {Container, Graphics} from 'pixi.js';
import {CollisionComponent} from '../components/Collision';

export const createCollisionDebugSystem = (container: Container) => {
  const collisionQuery = defineQuery([Transform, CollisionComponent]);
  const enterCollisionQuery = enterQuery(collisionQuery);
  const exitCollisionQuery = exitQuery(collisionQuery);
  const circleMap: Record<number, Graphics> = {};

  return (world: World) => {
    for (const eid of enterCollisionQuery(world)) {
      const graphics = new Graphics();
      graphics.lineStyle({width: 1, color: 0xff0000});
      graphics.drawCircle(0, 0, CollisionComponent.radius[eid]);
      graphics.zIndex = 10;
      container.addChild(graphics);
      circleMap[eid] = graphics;
    }

    for (const eid of collisionQuery(world)) {
      const graphics = circleMap[eid];
      graphics.x = Transform.finalPosition.x[eid];
      graphics.y = Transform.finalPosition.y[eid];
    }

    for (const eid of exitCollisionQuery(world)) {
      const graphics = circleMap[eid];
      graphics.destroy();
      delete circleMap[eid];
    }

    return world;
  }
}
