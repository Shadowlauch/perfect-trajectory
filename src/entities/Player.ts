import {addComponent, addEntity} from 'bitecs';
import {Transform} from '../components/Transform';
import {Velocity} from '../components/Physics';
import {GraphicsCircle} from '../components/GraphicsCircle';
import {PlayerComponent} from '../components/PlayerComponent';
import {World} from '../main';
import {CollisionComponent} from '../components/Collision';

export const createPlayerEntity = (world: World) => {
  const eid = addEntity(world);
  addComponent(world, Transform, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, GraphicsCircle, eid);
  addComponent(world, PlayerComponent, eid);
  addComponent(world, CollisionComponent, eid);
  GraphicsCircle.color[eid] = 0xffffff;
  GraphicsCircle.radius[eid] = 10;
  CollisionComponent.filter[eid] = 0b000001;
  CollisionComponent.radius[eid] = 7;
  Transform.position.x[eid] = world.size.width / 2;
  Transform.position.y[eid] = world.size.height - 50;
  PlayerComponent.lives[eid] = 3;
  PlayerComponent.maxLives[eid] = 3;
}
