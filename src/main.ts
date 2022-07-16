import {Application, Container} from 'pixi.js';
import './style.css';
import {addComponent, addEntity, createWorld, IWorld, pipe} from 'bitecs';
import {createMovementSystem} from './systems/MovementSystem';
import {createTimeSystem} from './systems/TimeSystem';
import {createGraphicsCircleSystem} from './systems/GraphicsCircleSystem';
import {createPlayerEntity} from './entities/Player';
import {createEnemyEntity} from './entities/Enemy';
import {createPlayerMovementSystem} from './systems/PlayerMovementSystem';
import {createPlayerBoundarySystem} from './systems/PlayerBoundarySystem';
import {createShowFpsSystem} from './systems/ShowFpsSystem';
import {loadSpirtes} from './loader/Loader';
import {createSpriteSystem} from './systems/SpriteSystem';
import {Position} from './components/Position';
import {GraphicsCircle} from './components/GraphicsCircle';
import {CollisionComponent} from './components/Collision';
import {createKeyboardSystem} from './systems/KeyboardSystem';
import {createBulletSpawnSystem} from './systems/BulletSpawnSystem';

export interface World extends IWorld {
  time: {
    delta: number;
    elapsed: number;
    then: number;
  };
  input: { down: (key: typeof KeyboardEvent.prototype["key"]) => boolean};
  size: {
    width: number;
    height: number;
  };
}

const size = {width: 640, height: 800};
const app = new Application({
  ...size,
  antialias: false,
  powerPreference: 'high-performance'
});
document.body.appendChild(app.view);
const container = new Container();
container.interactive = false;
container.interactiveChildren = false;
//container.filters = [new AdvancedBloomFilter()];
app.stage.addChild(container);

const loader = await loadSpirtes();

const world = createWorld() as World;
world.time = {delta: 0, elapsed: 0, then: performance.now()};
world.input = {down: () => false};
world.size = size;
const pipeline = pipe(
  createPlayerMovementSystem(),
  createBulletSpawnSystem(),
  createMovementSystem(),
  createPlayerBoundarySystem(),
  //createCollisionSystem(),
  createGraphicsCircleSystem(app),
  createSpriteSystem(container, loader),
  createShowFpsSystem(app),
  createTimeSystem(),
  createKeyboardSystem(world),
);

const eid = addEntity(world);
addComponent(world, Position, eid);
addComponent(world, GraphicsCircle, eid);
addComponent(world, CollisionComponent, eid);
GraphicsCircle.color[eid] = 0xffff00;
GraphicsCircle.radius[eid] = 30;
CollisionComponent.filter[eid] = 0b000001;
Position.x[eid] = 300;
Position.y[eid] = 300;

createPlayerEntity(world);
createEnemyEntity(world);

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world);
});

