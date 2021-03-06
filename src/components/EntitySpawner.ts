import {defineComponent, Types} from 'bitecs';

// Define tag-like components here
// Components with minimally modified data or no data at all

// How to use EntitySpawner:
// Add a pre-defined entity to an EntityPrefabWorld
// Create another entity with EntitySpawner component in the main world
// Give the entity spawner the pre-defined entity's eid

/** Spawns a pre-defined entity */
export const EntitySpawner = defineComponent({
    /** EID of the template to be spawned by the EntitySpawner */
    // note: don't use Types.eid
    templateEntity: Types.ui32,
    /**
     * Time in milliseconds before entity is spawned.
     * EntitySpawnerSystem will decrement this until it becomes <=0, which will then spawn the entity.
     * If loop is true, delay will be reset back to loopInterval.
     */
    delay: Types.f32,
    /** Number of times to loop, INT8MAX is infinite loop */
    loop: Types.i8,
    /** Time in milliseconds between each spawn loop */
    loopInterval: Types.f32,
    /** Boolean, if true, entity is removed after last iteration of loop */
    killAfterLastLoop: Types.ui8,
    /** Boolean, if true, adds spawner as parent to spawned entity */
    parentOfSpawned: Types.ui8,
});
