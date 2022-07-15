import {addComponent, addEntity} from 'bitecs';
import {Position} from '../components/Position';
import {Velocity} from '../components/Velocity';
import {GraphicsCircle} from '../components/GraphicsCircle';
import {Player} from '../components/Player';
import {World} from '../main';
import {EnemyData} from '../components/EnemyData';

export const createPlayerEntity = (world: World) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, GraphicsCircle, eid);
  addComponent(world, Player, eid);
  addComponent(world, EnemyData, eid);
  GraphicsCircle.color[eid] = 0xffffff;
  GraphicsCircle.radius[eid] = 10;
  Velocity.x[eid] = 0.05;
  Velocity.y[eid] = 0.05;
}
