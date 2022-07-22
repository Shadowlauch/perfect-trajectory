import { defineQuery, removeEntity } from 'bitecs';
import { World } from '../main';
import { KillAfter } from '../components/KillAfter';

export const KillSystem = () => {
  const killQuery = defineQuery([KillAfter]);

  return (world: World) => {
    const { time: { delta } } = world;

    for (const eid of killQuery(world)) {
      // Manage delays and loops
      KillAfter.ms[eid] -= delta;
      if (KillAfter.ms[eid] < 0) {
        removeEntity(world, eid);
      }
    }

    return world;
  }
}
