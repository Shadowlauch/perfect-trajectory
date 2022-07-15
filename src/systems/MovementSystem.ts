import {defineQuery} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {World} from '../main';

export const createMovementSystem = () => {
  const movementQuery = defineQuery([Position, Velocity])

  return (world: World) => {
    const { time: { delta } } = world
    const ents = movementQuery(world)
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]
      Position.x[eid] += Velocity.x[eid] * delta
      Position.y[eid] += Velocity.y[eid] * delta
    }
    return world
  }
}
