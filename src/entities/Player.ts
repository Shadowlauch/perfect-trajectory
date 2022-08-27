import {addEntity} from 'bitecs';
import {addTransformComponent} from '../components/TransformComponent';
import {addVelocityComponent} from '../components/Physics';
import {addGraphicsCircleComponent} from '../components/GraphicsCircleComponent';
import {addPlayerComponent} from '../components/PlayerComponent';
import {World} from '../main';
import {addCollisionComponent} from '../components/CollisionComponent';
import {addSpriteComponent} from '../components/SpriteComponent';

export const playerStartCoords = (world: World) => [world.size.width / 2, world.size.height - 50];

export const createPlayerEntity = (world: World) => {
  const eid = addEntity(world);
  const [x, y] = playerStartCoords(world);
  addTransformComponent(world, eid, x, y);
  addVelocityComponent(world, eid);
  addGraphicsCircleComponent(world, eid, 6, 0x000000, 20);
  addPlayerComponent(world, eid, 3);
  addCollisionComponent(world, eid, 4, {filter: 0b000001});
  addSpriteComponent(world, eid, 'player-test', {scale: 0.5, zIndex: 10});
};
