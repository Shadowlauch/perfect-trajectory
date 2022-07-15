import {Application} from 'pixi.js';
import './style.css'
import {addComponent, addEntity, createWorld, IWorld, pipe} from 'bitecs';
import {createMovementSystem} from './systems/MovementSystem';
import {createTimeSystem} from './systems/TimeSystem';
import {Position} from './components/Position';
import {Velocity} from './components/Velocity';
import {createGraphicsSystem} from './systems/GraphicsSystem';
import {GraphicsCircle} from './components/GraphicsCircle';

export interface World extends IWorld {
  time: {
    delta: number;
    elapsed: number;
    then: number;
  }
}

const app = new Application({ width: 640, height: 800 });
document.body.appendChild(app.view);

const world = createWorld() as World;
world.time = { delta: 0, elapsed: 0, then: performance.now() };
const pipeline = pipe(createMovementSystem(), createGraphicsSystem(app), createTimeSystem());

const eid = addEntity(world);
addComponent(world, Position, eid);
addComponent(world, Velocity, eid);
addComponent(world, GraphicsCircle, eid);
GraphicsCircle.color[eid] = 0xffffff;
GraphicsCircle.radius[eid] = 10;
Velocity.x[eid] = 0.05;
Velocity.y[eid] = 0.05;

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world);
});
