import { addComponent, defineDeserializer, defineQuery, defineSerializer, DESERIALIZE_MODE } from 'bitecs';
import { EntityPrefabWorld, World } from '../main';
import { EntitySpawner } from '../components/EntitySpawner';
import { Transform } from '../components/Transform';
import { KillAfter } from '../components/KillAfter';
import { INT8MAX } from '../components/Common';

export const entitySpawnerSystem = (epworld: EntityPrefabWorld) => {
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
          
          // Kill after loop period ended if this was is the last iteration
          if (EntitySpawner.loop[eid] < 0 && EntitySpawner.killAfterLastLoop[eid]) {
        addComponent(world, KillAfter, eid);
        KillAfter.ms[eid] = 0;
          }
        }
      }

      // Create a copy of the predefined entity into the main world
      const prefabEnt = prefabSerializer([EntitySpawner.templateEntity[eid]]);
      const spawnedEnts = prefabDeserializer(world, prefabEnt, DESERIALIZE_MODE.APPEND);
      if (!spawnedEnts.length) {
        continue;
      }
      for (const spawnedEnt of spawnedEnts) {
        // Perform initial positioning using EntitySpawner's final position.
        // If spawnedEnt is a child, ReferenceTransformSystem will automatically
        // recalculate origin based on parent's transforms.
        // This solves the problem of non-parented entities needing to have their
        // initial position relative to the spawner.
        Transform.origin.x[spawnedEnt] += Transform.globalPosition.x[eid];
        Transform.origin.y[spawnedEnt] += Transform.globalPosition.y[eid];
        Transform.angle[spawnedEnt] += Transform.globalAngle[eid];
      }
    }

    return world;
  }
}
