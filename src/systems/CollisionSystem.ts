import {defineQuery} from 'bitecs';
import {Position} from '../components/Position';
import {World} from '../main';
import {CollisionComponent} from '../components/Collision';
import Flatten from '@flatten-js/core';
import circle = Flatten.circle;
import point = Flatten.point;
import {GraphicsCircle} from '../components/GraphicsCircle';
import Circle = Flatten.Circle;

export const createCollisionSystem = () => {
  const collisionQuery = defineQuery([Position, CollisionComponent]);

  return (world: World) => {
    //const {time: {delta}, size: {height}} = world;
    const circles: Circle[] = [];
    const collisionObjects = collisionQuery(world);
    for (let a = 0; a < collisionObjects.length; a++){
      const objA = collisionObjects[a];
      const filter = CollisionComponent.filter[objA];
      for (let b = a + 1; b < collisionObjects.length; b++){
        const objB = collisionObjects[b];
        const group = CollisionComponent.group[objB];

        if ((filter & group) > 0) {
          circles[objA] = circles[objA] ?? circle(point(Position.x[objA], Position.y[objA]), GraphicsCircle.radius[objA] || 10);
          circles[objB] = circles[objB] ?? circle(point(Position.x[objB], Position.y[objB]), GraphicsCircle.radius[objB] || 10);
          const intersection = circles[objA].intersect(circles[objB]);

          if (intersection.length > 0) console.log('intersection')
        }

      }
    }
    return world;
  }
}
