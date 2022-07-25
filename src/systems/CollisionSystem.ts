import {addComponent, defineQuery, enterQuery, exitQuery, hasComponent, removeEntity} from 'bitecs';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {CollisionComponent} from '../components/Collision';
import {Circle, System, Body} from 'detect-collisions';
import {EnemyComponent} from '../components/EnemyComponent';
import {BulletComponent} from '../components/Bullet';
import {eventManager} from '../events/EventManager';
import {TweenComponent} from '../components/TweenComponent';
import {configManager} from '../configs/ConfigManager';
import {TweenConfig} from './TweenSystem';
import {SpriteComponent} from '../components/Sprite';

export const createCollisionSystem = () => {
  const collisionQuery = defineQuery([Transform, CollisionComponent]);
  const enterCollisionQuery = enterQuery(collisionQuery);
  const exitCollisionQuery = exitQuery(collisionQuery);
  const circleMap: Map<number, Body> = new Map();
  const eidMap: Map<Body, number> = new Map();
  const system = new System();

  return (world: World) => {
    for (const eid of enterCollisionQuery(world)) {
      const circle = new Circle({x: Transform.globalPosition.x[eid], y: Transform.globalPosition.y[eid]}, CollisionComponent.radius[eid]);
      system.insert(circle);
      circleMap.set(eid, circle);
      eidMap.set(circle, eid);
    }

    for (const eid of collisionQuery(world)) {
      circleMap.get(eid)?.setPosition(Transform.globalPosition.x[eid], Transform.globalPosition.y[eid]);
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

            if (!hasComponent(world, TweenComponent, target)) {
              addComponent(world, TweenComponent, target);
              TweenComponent.tweenConfigIndex[target] = configManager.add<TweenConfig>({
                startValue: 0,
                endValue: 0.5,
                onUpdate: (currentValue, eid) => {
                  SpriteComponent.darkR[eid] = currentValue;
                  SpriteComponent.darkG[eid] = currentValue;
                  SpriteComponent.darkB[eid] = currentValue;
                },
                duration: 100,
                yoyo: true
              })
            }

          }
        }
      }
    }

    return world;
  }
}
