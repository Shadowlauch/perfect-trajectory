import {World} from '../main';

export const createTimeSystem = () => {
  return (world: World) => {
    const { time } = world
    const now = performance.now()
    const delta = now - time.then
    time.delta = delta
    time.elapsed += delta
    time.then = now
    return world
  }
}
