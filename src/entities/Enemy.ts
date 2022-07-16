import {addComponent, addEntity} from 'bitecs';
import {Position} from '../components/Position';
import {Velocity} from '../components/Velocity';
import {GraphicsCircle} from '../components/GraphicsCircle';
import {World} from '../main';
import {EnemyData} from '../components/EnemyData';

export const createEnemyEntity = (world: World) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, GraphicsCircle, eid);
  addComponent(world, EnemyData, eid);
  GraphicsCircle.color[eid] = 0x00ff00;
  GraphicsCircle.radius[eid] = 20;
  Position.x[eid] = 400;
  Position.y[eid] = 100;
}
