import {addEntity, defineQuery} from 'bitecs';
import {World} from '../main';
import {PlayerComponent} from '../components/PlayerComponent';
import {addTransformComponent, TransformComponent} from '../components/TransformComponent';
import {addSpeedComponent, addVelocityComponent} from '../components/Physics';
import {addSpriteComponent} from '../components/SpriteComponent';
import {addCollisionComponent} from '../components/CollisionComponent';
import {addBulletComponent} from '../components/BulletComponent';
import {EnemyComponent} from '../components/EnemyComponent';

export const createPlayerShootSystem = () => {
  const playerQuery = defineQuery([PlayerComponent]);
  const enemyQuery = defineQuery([EnemyComponent]);
  const cooldown = 100;

  const spawnBullet = (world: World, x: number, y: number, toX: number, toY: number, player: number, main = true) => {
    const bullet = addEntity(world);

    const angle = Math.atan2(toY - y, toX - x);
    const color = main ? 'red' : 'white';
    const damage = main ? 1 : 0.5;
    const opacity = main ? 1 : 0.2;
    const zIndex = main ? 20 : 15;

    addTransformComponent(world, bullet, x, y, angle);
    addVelocityComponent(world, bullet);
    addSpeedComponent(world, bullet, 1.4);
    addSpriteComponent(world, bullet, 'characters.bullets.cards.frame.' + color, {alpha: opacity, zIndex});
    addCollisionComponent(world, bullet, 5, {group: 0b000010});
    addBulletComponent(world, bullet, player, damage);
  }

  return (world: World) => {
    const { time: {elapsed, delta} } = world

    if ((elapsed % cooldown) - delta < 0) {
      const pid = playerQuery(world)[0];

      const [px, py] = [TransformComponent.position.x[pid], TransformComponent.position.y[pid]];
      const enemies = enemyQuery(world);

      let shortestDistance = Number.MAX_SAFE_INTEGER;
      let closestEntity: number | undefined = undefined;
      for (const enemy of enemies) {
        const distance =  Math.abs(px - TransformComponent.position.x[enemy]) + Math.abs(py - TransformComponent.position.y[enemy]);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          closestEntity = enemy;
        }
      }
      const [cx, cy] = closestEntity ? [TransformComponent.position.x[closestEntity], TransformComponent.position.y[closestEntity]] : [undefined, undefined];

      spawnBullet(world, px - 15, py, px - 15, py - 20, pid);
      spawnBullet(world, px - 15, py, cx ?? px - 17, cy ?? py - 20, pid, false);

      spawnBullet(world, px + 15, py, px + 15, py - 20, pid);
      spawnBullet(world, px + 15, py, cx ?? px + 17, cy ?? py - 20, pid, false);
    }

    return world
  }
}
