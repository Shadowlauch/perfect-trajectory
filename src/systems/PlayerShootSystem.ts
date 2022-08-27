import {addEntity, defineQuery} from 'bitecs';
import {World} from '../main';
import {PlayerComponent} from '../components/PlayerComponent';
import {addTransformComponent, TransformComponent} from '../components/TransformComponent';
import {addSpeedComponent, addVelocityComponent} from '../components/Physics';
import {addSpriteComponent} from '../components/SpriteComponent';
import {addCollisionComponent} from '../components/CollisionComponent';
import {addBulletComponent} from '../components/BulletComponent';

export const createPlayerShootSystem = () => {
  const playerQuery = defineQuery([PlayerComponent]);
  const cooldown = 80;

  return (world: World) => {
    const { time: {elapsed, delta} } = world
    if ((elapsed % cooldown) - delta < 0) {
      const pid = playerQuery(world)[0];
      const bullet = addEntity(world);

      addTransformComponent(world, bullet, TransformComponent.position.x[pid], TransformComponent.position.y[pid], 3 * Math.PI / 2);
      addVelocityComponent(world, bullet);
      addSpeedComponent(world, bullet, 0.7);
      addSpriteComponent(world, bullet, 'needle01');
      addCollisionComponent(world, bullet, 2, {group: 0b000010});
      addBulletComponent(world, bullet, pid, 1);
    }

    return world
  }
}
