import {World} from '../main';
import {addComponent, addEntity} from 'bitecs';
import {Position} from '../components/Position';
import {Velocity} from '../components/Velocity';
import {SpriteComponent} from '../components/Sprite';
import {CollisionComponent} from '../components/Collision';
import {BulletComponent} from '../components/Bullet';

export const spawnBullet = (world: World, x: number, y: number, angle: number, speed: number) => {
  const vx = speed * Math.cos(angle);
  const vy = speed * Math.sin(angle);

  const bullet = addEntity(world);

  addComponent(world, Position, bullet);
  addComponent(world, Velocity, bullet);
  addComponent(world, SpriteComponent, bullet);
  addComponent(world, CollisionComponent, bullet);
  addComponent(world, BulletComponent, bullet);
  SpriteComponent.spriteIndex[bullet] = 0;
  SpriteComponent.scale[bullet] = 0.5;

  Position.x[bullet] = x;
  Position.y[bullet] = y;
  Velocity.x[bullet] = vx;
  Velocity.y[bullet] = vy;
  CollisionComponent.group[bullet] = 0b000001;
  CollisionComponent.radius[bullet] = 6;
  return bullet;
}
