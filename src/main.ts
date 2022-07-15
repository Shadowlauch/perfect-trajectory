import {Application} from 'pixi.js';
import './style.css'
import {addComponent, addEntity, createWorld, IWorld, pipe} from 'bitecs';
import {createMovementSystem} from './systems/MovementSystem';
import {createTimeSystem} from './systems/TimeSystem';
import {Position} from './components/Position';
import {Velocity} from './components/Velocity';
import {EnemyData} from './components/EnemyData';
import {createGraphicsSystem} from './systems/GraphicsSystem';
import {GraphicsCircle} from './components/GraphicsCircle';
import {createEnemySystem} from './systems/EnemySystem';

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
const pipeline = pipe(createEnemySystem(), createMovementSystem(), createGraphicsSystem(app), createTimeSystem());

const eid = addEntity(world);
addComponent(world, Position, eid);
addComponent(world, Velocity, eid);
addComponent(world, GraphicsCircle, eid);
GraphicsCircle.color[eid] = 0xffffff;
GraphicsCircle.radius[eid] = 10;
addComponent(world, EnemyData, eid);
Velocity.x[eid] = 0.05;
Velocity.y[eid] = 0.05;
Position.x[eid] = 100;
Position.y[eid] = 100;

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world);
});
