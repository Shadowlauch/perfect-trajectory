import {addComponent, addEntity, defineQuery} from 'bitecs';
import {World} from '../main';
import {Player} from '../components/Player';
import {Transform} from '../components/Transform';
import {Velocity} from '../components/Physics';
import {SpriteComponent} from '../components/Sprite';
import {CollisionComponent} from '../components/Collision';
import {BulletComponent} from '../components/Bullet';

export const createPlayerShootSystem = () => {
  const playerQuery = defineQuery([Player]);
  const cooldown = 80;

  return (world: World) => {
    const { time: {elapsed, delta} } = world
    if ((elapsed % cooldown) - delta < 0) {
      const pid = playerQuery(world)[0];
      const bullet = addEntity(world);

      addComponent(world, Transform, bullet);
      addComponent(world, Velocity, bullet);
      addComponent(world, SpriteComponent, bullet);
      addComponent(world, CollisionComponent, bullet);
      addComponent(world, BulletComponent, bullet);
      SpriteComponent.spriteIndex[bullet] = 3;
      SpriteComponent.scale[bullet] = 0.2;

      Transform.position.x[bullet] = Transform.position.x[pid];
      Transform.position.y[bullet] = Transform.position.y[pid] - 40;
      Velocity.x[bullet] = 0;
      Velocity.y[bullet] = -0.7;
      CollisionComponent.group[bullet] = 0b000010;
      //TODO: Collision shape does not fit at all
      CollisionComponent.radius[bullet] = 2;
      BulletComponent.damage[bullet] = 1;
      BulletComponent.spawnedBy[bullet] = pid;
    }



    return world
  }
}
