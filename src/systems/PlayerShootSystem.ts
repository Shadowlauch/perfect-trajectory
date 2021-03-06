import {addComponent, addEntity, defineQuery} from 'bitecs';
import {World} from '../main';
import {PlayerComponent} from '../components/PlayerComponent';
import {Transform} from '../components/Transform';
import {Speed, Velocity} from '../components/Physics';
import {SpriteComponent} from '../components/Sprite';
import {CollisionComponent} from '../components/Collision';
import {BulletComponent} from '../components/Bullet';
import {spriteLoader} from '../loader/Loader';

export const createPlayerShootSystem = () => {
  const playerQuery = defineQuery([PlayerComponent]);
  const cooldown = 80;

  return (world: World) => {
    const { time: {elapsed, delta} } = world
    if ((elapsed % cooldown) - delta < 0) {
      const pid = playerQuery(world)[0];
      const bullet = addEntity(world);

      addComponent(world, Transform, bullet);
      addComponent(world, Velocity, bullet);
      addComponent(world, Speed, bullet);
      addComponent(world, SpriteComponent, bullet);
      addComponent(world, CollisionComponent, bullet);
      addComponent(world, BulletComponent, bullet);
      SpriteComponent.spriteIndex[bullet] = spriteLoader.getIndex('needle01');
      SpriteComponent.scale[bullet] = 1;

      Transform.position.x[bullet] = Transform.position.x[pid];
      Transform.position.y[bullet] = Transform.position.y[pid] - 40;
      Transform.rotation[bullet] = 3*Math.PI/2;
      Transform.origin.x[bullet] = 0;
      Transform.origin.y[bullet] = 0;
      Transform.frameRotation[bullet] = 0;
      Speed.val[bullet] = 0.7;
      CollisionComponent.group[bullet] = 0b000010;
      //TODO: Collision shape does not fit at all
      CollisionComponent.radius[bullet] = 2;
      BulletComponent.damage[bullet] = 1;
      BulletComponent.spawnedBy[bullet] = pid;
    }



    return world
  }
}
