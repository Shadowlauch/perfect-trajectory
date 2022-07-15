import {Application} from 'pixi.js';
import './style.css';
import {createWorld, IWorld, pipe} from 'bitecs';
import {createMovementSystem} from './systems/MovementSystem';
import {createTimeSystem} from './systems/TimeSystem';
import {createGraphicsSystem} from './systems/GraphicsSystem';
import {createEnemySystem} from './systems/EnemySystem';
import {createPlayerEntity} from './entities/Player';

export interface World extends IWorld {
  time: {
    delta: number;
    elapsed: number;
    then: number;
  };
}

const app = new Application({width: 640, height: 800});
document.body.appendChild(app.view);

const world = createWorld() as World;
world.time = {delta: 0, elapsed: 0, then: performance.now()};
const pipeline = pipe(createEnemySystem(), createMovementSystem(), createGraphicsSystem(app), createTimeSystem());
createPlayerEntity(world);

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world);
});
