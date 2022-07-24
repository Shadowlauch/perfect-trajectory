import {addComponent, addEntity} from 'bitecs';
import {Transform} from '../components/Transform';
import {Velocity} from '../components/Physics';
import {GraphicsCircle} from '../components/GraphicsCircle';
import {PlayerComponent} from '../components/PlayerComponent';
import {World} from '../main';
import {CollisionComponent} from '../components/Collision';
import {SpriteComponent} from '../components/Sprite';
import {spriteLoader} from '../loader/Loader';

export const createPlayerEntity = (world: World) => {
  const eid = addEntity(world);
  addComponent(world, Transform, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, GraphicsCircle, eid);
  addComponent(world, PlayerComponent, eid);
  addComponent(world, CollisionComponent, eid);
  addComponent(world, SpriteComponent, eid);
  GraphicsCircle.color[eid] = 0x000000;
  GraphicsCircle.radius[eid] = 6;
  GraphicsCircle.zIndex[eid] = 20;
  SpriteComponent.spriteIndex[eid] = spriteLoader.getIndex('player-test');
  SpriteComponent.scale[eid] = 0.5;
  SpriteComponent.zIndex[eid] = 10;
  CollisionComponent.filter[eid] = 0b000001;
  CollisionComponent.radius[eid] = 4;
  Transform.position.x[eid] = world.size.width / 2;
  Transform.position.y[eid] = world.size.height - 50;
  PlayerComponent.lives[eid] = 3;
  PlayerComponent.maxLives[eid] = 3;
}
