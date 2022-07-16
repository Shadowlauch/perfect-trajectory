import {Application, Container} from 'pixi.js';
import './style.css';
import {createWorld, IWorld, pipe} from 'bitecs';
import {createMovementSystem} from './systems/MovementSystem';
import {createTimeSystem} from './systems/TimeSystem';
import {createGraphicsCircleSystem} from './systems/GraphicsCircleSystem';
import {createBulletSpawnSystem} from './systems/BulletSpawnSystem';
import {createPlayerEntity} from './entities/Player';
import {createEnemyEntity} from './entities/Enemy';
import {StInput} from './utils/StInput';
import {createPlayerMovementSystem} from './systems/PlayerMovementSystem';
import {createPlayerBoundarySystem} from './systems/PlayerBoundarySystem';
import {createShowFpsSystem} from './systems/ShowFpsSystem';
import {loadSpirtes} from './loader/Loader';
import {createSpriteSystem} from './systems/SpriteSystem';
import {AdvancedBloomFilter} from 'pixi-filters';

export interface World extends IWorld {
  time: {
    delta: number;
    elapsed: number;
    then: number;
  };
  input: StInput;
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
container.filters = [new AdvancedBloomFilter()];
app.stage.addChild(container);

const loader = await loadSpirtes();

const world = createWorld() as World;
world.time = {delta: 0, elapsed: 0, then: performance.now()};
world.input = new StInput(window);
world.size = size;
const pipeline = pipe(
  createPlayerMovementSystem(),
  createBulletSpawnSystem(),
  createMovementSystem(),
  createPlayerBoundarySystem(),
  createGraphicsCircleSystem(app),
  createSpriteSystem(container, loader),
  createShowFpsSystem(app),
  createTimeSystem()
);
createPlayerEntity(world);
createEnemyEntity(world);

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world);
  world.input.endFrame();
});
