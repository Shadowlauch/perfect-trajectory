import {World} from '../../main';
import {addComponent, addEntity} from 'bitecs';
import {Transform} from '../../components/Transform';
import {Speed,Velocity} from '../../components/Physics';
import {SpriteComponent} from '../../components/Sprite';
import {CollisionComponent} from '../../components/Collision';
import {BulletComponent} from '../../components/Bullet';
import {spriteLoader} from '../../loader/Loader';

export const spawnBullet = (world: World, x: number, y: number, rotation: number, speed: number) => {
  const bullet = addEntity(world);

  addComponent(world, Transform, bullet);
  addComponent(world, Velocity, bullet);
  addComponent(world, Speed, bullet);
  addComponent(world, SpriteComponent, bullet);
  addComponent(world, CollisionComponent, bullet);
  addComponent(world, BulletComponent, bullet);
  SpriteComponent.spriteIndex[bullet] = spriteLoader.getIndex('bullet01');
  SpriteComponent.zIndex[bullet] = 30;
  SpriteComponent.scale[bullet] = 0.5;

  Transform.position.x[bullet] = x;
  Transform.position.y[bullet] = y;
  Transform.rotation[bullet] = rotation;
  Transform.origin.x[bullet] = 0;
  Transform.origin.y[bullet] = 0;
  Transform.frameRotation[bullet] = 0;
  Speed.val[bullet] = speed;
  CollisionComponent.group[bullet] = 0b000001;
  CollisionComponent.radius[bullet] = 6;
  return bullet;
}
