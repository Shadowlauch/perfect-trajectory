import {Application} from 'pixi.js';
import './style.css';
import {createWorld, IWorld, pipe} from 'bitecs';
import {createMovementSystem} from './systems/MovementSystem';
import {createTimeSystem} from './systems/TimeSystem';
import {createGraphicsSystem} from './systems/GraphicsSystem';
import {createEnemySystem} from './systems/EnemySystem';
import {createPlayerEntity} from './entities/Player';
import {StInput} from './utils/StInput';
import {createPlayerMovementSystem} from './systems/PlayerMovementSystem';
import {createPlayerBoundarySystem} from './systems/PlayerBoundarySystem';
import {createShowFpsSystem} from './systems/ShowFpsSystem';

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
  }
}

const size = {width: 640, height: 800};
const app = new Application(size);
document.body.appendChild(app.view);

const world = createWorld() as World;
world.time = {delta: 0, elapsed: 0, then: performance.now()};
world.input = new StInput(window);
world.size = size;
const pipeline = pipe(
  createPlayerMovementSystem(),
  createEnemySystem(),
  createMovementSystem(),
  createPlayerBoundarySystem(),
  createGraphicsSystem(app),
  createShowFpsSystem(app),
  createTimeSystem()
);
createPlayerEntity(world);

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world);
  world.input.endFrame();
});
