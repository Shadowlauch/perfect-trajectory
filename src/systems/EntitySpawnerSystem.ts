import { defineDeserializer, defineQuery, defineSerializer, DESERIALIZE_MODE } from 'bitecs';
import { EntityPrefabWorld, World } from '../main';
import { EntitySpawner } from '../components/EntitySpawner';
import { Transform } from '../components/Transform';

export const EntitySpawnerSystem = (epworld: EntityPrefabWorld) => {
  const entitySpawnerQuery = defineQuery([Transform, EntitySpawner]);
  // world is the main world, epworld holds premade entities for spawner to spawn
  // Copy from epworld into world
  const prefabSerializer = defineSerializer(epworld);
  const prefabDeserializer = defineDeserializer(epworld);

  return (world: World) => {
    const { time: { delta } } = world;
    
    for (const eid of entitySpawnerQuery(world)) {
      // Manage delays and loops
      EntitySpawner.delay[eid] -= delta;
      if (EntitySpawner.delay[eid] > 0) {
        continue;
      }
      if (!!EntitySpawner.loop[eid]) {
        EntitySpawner.delay[eid] += EntitySpawner.loopInterval[eid];
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
