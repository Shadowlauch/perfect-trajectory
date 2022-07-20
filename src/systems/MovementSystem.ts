import {defineQuery} from 'bitecs';
import {Velocity} from '../components/Physics';
import {Transform} from '../components/Transform';
import {World} from '../main';

export const createMovementSystem = () => {
  const movementQuery = defineQuery([Transform, Velocity])

  return (world: World) => {
    const { time: { delta } } = world
    const ents = movementQuery(world)
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i]
      Transform.position.x[eid] += Velocity.x[eid] * delta
      Transform.position.y[eid] += Velocity.y[eid] * delta
    }
    return world
  }
}
