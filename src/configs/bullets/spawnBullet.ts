import {World} from '../../main';
import {addEntity} from 'bitecs';
import {addTransformComponent} from '../../components/TransformComponent';
import {addSpeedComponent, addVelocityComponent} from '../../components/Physics';
import {addSpriteComponent} from '../../components/SpriteComponent';
import {addCollisionComponent} from '../../components/CollisionComponent';
import {addBulletComponent} from '../../components/BulletComponent';

export const spawnBullet = (world: World, x: number, y: number, rotation: number, speed: number) => {
  const bullet = addEntity(world);

  addTransformComponent(world, bullet, x, y, rotation)
  addVelocityComponent(world, bullet);
  addSpeedComponent(world, bullet, speed);
  addSpriteComponent(world, bullet, 'red01', {zIndex: 30, scale: 0.5});
  addCollisionComponent(world, bullet, 6, {group: 0b000001})
  addBulletComponent(world, bullet);

  return bullet;
}
