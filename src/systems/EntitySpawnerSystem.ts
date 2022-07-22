import { addComponent, defineDeserializer, defineQuery, defineSerializer, DESERIALIZE_MODE } from 'bitecs';
import { EntityPrefabWorld, World } from '../main';
import { EntitySpawner } from '../components/EntitySpawner';
import { Transform } from '../components/Transform';
import { KillAfter } from '../components/KillAfter';
import { INT8MAX } from '../components/Common';

export const EntitySpawnerSystem = (epworld: EntityPrefabWorld) => {
  const entitySpawnerQuery = defineQuery([Transform, EntitySpawner]);
  // world is the main world, epworld holds premade entities for spawner to spawn
  // Copy from epworld into world
  const prefabSerializer = defineSerializer(epworld);
  const prefabDeserializer = defineDeserializer(epworld);

  return (world: World) => {
    const { time: { delta } } = world;

    for (const eid of entitySpawnerQuery(world)) {
      // Spawn delay time
      EntitySpawner.delay[eid] -= delta;
      // Wait until delay time has elapsed, or skip eid if loop was initially 0 (i.e, spawn only once)
      if (EntitySpawner.delay[eid] > 0 || EntitySpawner.loop[eid] < 0) {
        continue;
      }
      // Decrement loop
      if (EntitySpawner.loop[eid] >= 0) {
        EntitySpawner.delay[eid] += EntitySpawner.loopInterval[eid];
        // Infinite loop if INT8MAX
        if (EntitySpawner.loop[eid] < INT8MAX) {
          EntitySpawner.loop[eid]--;
        }
      } else if (!!EntitySpawner.killAfterLastLoop[eid]) {
        // Kill after loop period ended
        addComponent(world, KillAfter, eid);
        KillAfter.ms[eid] = 0;
      }

      // Create a copy of the predefined entity into the main world
      const prefabEnt = prefabSerializer([EntitySpawner.templateEntity[eid]]);
      const spawnedEnts = prefabDeserializer(world, prefabEnt, DESERIALIZE_MODE.APPEND);
      if (!spawnedEnts.length) {
        continue;
      }
      for (const spawnedEnt of spawnedEnts) {
        // Perform initial positioning using EntitySpawner's transform
        Transform.position.x[spawnedEnt] += Transform.position.x[eid];
        Transform.position.y[spawnedEnt] += Transform.position.y[eid];
        Transform.rotation[spawnedEnt] += Transform.rotation[eid];
      }
    }

    return world;
  }
}
