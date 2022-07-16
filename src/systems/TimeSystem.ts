import {World} from '../main';
import {Ticker} from 'pixi.js';

export const createTimeSystem = (ticker: Ticker) => {
  return (world: World) => {
    const { time } = world
    const now = performance.now()
    time.delta = ticker.deltaMS;
    time.elapsed += ticker.elapsedMS;
    time.then = now;
    return world
  }
}
