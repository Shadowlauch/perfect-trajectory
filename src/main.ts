import {Application, Container} from 'pixi.js';
import './style.css';
import {createWorld, IWorld, pipe} from 'bitecs';
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
import {createKeyboardSystem} from './systems/KeyboardSystem';
import {createBulletSpawnSystem} from './systems/BulletSpawnSystem';
import {createCollisionSystem} from './systems/CollisionSystem';
import {createCollisionDebugSystem} from './systems/CollisionDebugSystem';
import {createBulletCleanUpSystem} from './systems/BulletCleanUpSystem';
import {createMediaRecorder} from './utils/recordVideo';

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
const mediaRecorder = createMediaRecorder(app);

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
  //createBulletSpawnTestSystem(),
  createMovementSystem(),
  createPlayerBoundarySystem(),
  createBulletCleanUpSystem(),
  createCollisionSystem(),
  createGraphicsCircleSystem(app),
  createSpriteSystem(container, loader),
  createCollisionDebugSystem(container),
  createShowFpsSystem(app),
  createTimeSystem(app.ticker),
  createKeyboardSystem(world),
);

createPlayerEntity(world);
createEnemyEntity(world);

document.addEventListener('keydown', (e) => {
  if (e.key === "p") {
    if (app.ticker.started) app.ticker.stop();
    else app.ticker.start();
  } else if (e.key === "r") {
    if (mediaRecorder.state === "recording") mediaRecorder.stop();
    else mediaRecorder.start();
  }
})

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world);
});




