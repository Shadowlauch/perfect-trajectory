import {defineQuery, enterQuery, exitQuery, hasComponent, removeEntity} from 'bitecs';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';
import {CollisionComponent} from '../components/CollisionComponent';
import {Circle, System, Body} from 'detect-collisions';
import {EnemyComponent} from '../components/EnemyComponent';
import {BulletComponent} from '../components/BulletComponent';
import {eventManager} from '../events/EventManager';
import {addTweenComponent, TweenComponent} from '../components/TweenComponent';
import {SpriteComponent} from '../components/SpriteComponent';

export const createCollisionSystem = () => {
  const collisionQuery = defineQuery([TransformComponent, CollisionComponent]);
  const enterCollisionQuery = enterQuery(collisionQuery);
  const exitCollisionQuery = exitQuery(collisionQuery);
  const circleMap: Map<number, Body> = new Map();
  const eidMap: Map<Body, number> = new Map();
  const system = new System();

  return (world: World) => {
    for (const eid of enterCollisionQuery(world)) {
      const circle = new Circle({x: TransformComponent.globalPosition.x[eid], y: TransformComponent.globalPosition.y[eid]}, CollisionComponent.radius[eid]);
      system.insert(circle);
      circleMap.set(eid, circle);
      eidMap.set(circle, eid);
    }

    for (const eid of collisionQuery(world)) {
      circleMap.get(eid)?.setPosition(TransformComponent.globalPosition.x[eid], TransformComponent.globalPosition.y[eid]);
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
          eventManager.trigger('collision', {
            first: target,
            second: potEid
          });

          if (hasComponent(world, EnemyComponent, target) && hasComponent(world, BulletComponent, potEid)){
            removeEntity(world, potEid);
            EnemyComponent.hp[target] -= BulletComponent.damage[potEid];

            if (!hasComponent(world, TweenComponent, target) && hasComponent(world, SpriteComponent, target)) {
              addTweenComponent(world, target, {
                startValue: 0,
                endValue: 0.5,
                onUpdate: (eid, currentValue) => {
                  SpriteComponent.darkR[eid] = currentValue;
                  SpriteComponent.darkG[eid] = currentValue;
                  SpriteComponent.darkB[eid] = currentValue;
                },
                duration: 1000,
                yoyo: true
              });
            }
          }
        }
      }
    }

    return world;
  }
}
