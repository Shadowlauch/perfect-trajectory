import {addComponent, addEntity, defineQuery} from 'bitecs';
import {World} from '../main';
import {Player} from '../components/Player';
import {Position} from '../components/Position';
import {Velocity} from '../components/Velocity';
import {SpriteComponent} from '../components/Sprite';
import {CollisionComponent} from '../components/Collision';
import {BulletComponent} from '../components/Bullet';
import {GraphicsCircle} from '../components/GraphicsCircle';

export const createPlayerShootSystem = () => {
  const playerQuery = defineQuery([Player]);
  const cooldown = 50;

  return (world: World) => {
    const { time: {elapsed, delta} } = world
    if ((elapsed % cooldown) - delta < 0) {
      const pid = playerQuery(world)[0];
      const bullet = addEntity(world);

      addComponent(world, Position, bullet);
      addComponent(world, Velocity, bullet);
      addComponent(world, SpriteComponent, bullet);
      addComponent(world, CollisionComponent, bullet);
      addComponent(world, BulletComponent, bullet);
      SpriteComponent.spriteIndex[bullet] = 1;
      SpriteComponent.scale[bullet] = 0.2;

      Position.x[bullet] = Position.x[pid] + GraphicsCircle.radius[pid];
      Position.y[bullet] = Position.y[pid] - 40;
      Velocity.x[bullet] = 0;
      Velocity.y[bullet] = -0.7;
      //CollisionComponent.group[bullet] = 0b000001;
      //CollisionComponent.radius[bullet] = 6;
    }



    return world
  }
}
