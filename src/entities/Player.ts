import {addComponent, addEntity} from 'bitecs';
import {Position} from '../components/Position';
import {Velocity} from '../components/Velocity';
import {GraphicsCircle} from '../components/GraphicsCircle';
import {Player} from '../components/Player';
import {World} from '../main';
import {CollisionComponent} from '../components/Collision';

export const createPlayerEntity = (world: World) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, GraphicsCircle, eid);
  addComponent(world, Player, eid);
  addComponent(world, CollisionComponent, eid);
  GraphicsCircle.color[eid] = 0xffffff;
  GraphicsCircle.radius[eid] = 10;
  CollisionComponent.filter[eid] = 0b000001;
  CollisionComponent.radius[eid] = 7;
  Position.x[eid] = 100;
  Position.y[eid] = 100;
}
