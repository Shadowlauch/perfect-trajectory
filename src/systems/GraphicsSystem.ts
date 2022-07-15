import {defineQuery} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {World} from '../main';
import {Application, Sprite} from 'pixi.js';

export const createGraphicsSystem = (app: Application) => {
  const sprite = Sprite.from('sample.png');
  app.stage.addChild(sprite);
  const movementQuery = defineQuery([Position, Velocity]);

  return (world: World) => {
    const {time: {delta}} = world;
    for (const entity of movementQuery(world)) {
      sprite.x = Position.x[entity] + delta * Velocity.x[entity];
      sprite.y = Position.y[entity] + delta * Velocity.y[entity];
    }
    return world;
  }
}
