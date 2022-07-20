import {defineQuery, enterQuery, exitQuery, hasComponent, removeEntity} from 'bitecs';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {CollisionComponent} from '../components/Collision';
import {Circle, System, Body} from 'detect-collisions';
import {Player} from '../components/Player';
import {Enemy} from '../components/Enemy';
import {BulletComponent} from '../components/Bullet';

export const createCollisionSystem = () => {
  const collisionQuery = defineQuery([Transform, CollisionComponent]);
  const enterCollisionQuery = enterQuery(collisionQuery);
  const exitCollisionQuery = exitQuery(collisionQuery);
  const circleMap: Map<number, Body> = new Map();
  const eidMap: Map<Body, number> = new Map();
  const system = new System();

  return (world: World) => {
    for (const eid of enterCollisionQuery(world)) {
      const circle = new Circle({x: Transform.position.x[eid], y: Transform.position.y[eid]}, CollisionComponent.radius[eid]);
      system.insert(circle);
      circleMap.set(eid, circle);
      eidMap.set(circle, eid);
    }

    for (const eid of collisionQuery(world)) {
      circleMap.get(eid)?.setPosition(Transform.position.x[eid], Transform.position.y[eid]);
    }

    for (const eid of exitCollisionQuery(world)) {
      const circle = circleMap.get(eid)!;
      system.remove(circle);
      circleMap.delete(eid);
      eidMap.delete(circle);
    }

    system.update();


    for (const target of collisionQuery(world)) {
      if (CollisionComponent.filter[target] === 0) continue;

      const targetCircle = circleMap.get(target)!;
      const filter = CollisionComponent.filter[target];
      const potentials = system.getPotentials(targetCircle);
      for (const potential of potentials) {
        const potEid = eidMap.get(potential)!;
        const group = CollisionComponent.group[potEid];
        if ((filter & group) > 0 && system.checkCollision(targetCircle, potential)) {
          //TODO: Implement event system
          if (hasComponent(world, Player, target)) removeEntity(world, potEid);
          if (hasComponent(world, Enemy, target) && hasComponent(world, BulletComponent, potEid)){
            removeEntity(world, potEid);
            Enemy.hp[target] -= BulletComponent.damage[potEid];
          }
        }
      }
    }

    return world;
  }
}
