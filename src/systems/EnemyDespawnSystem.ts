import {defineQuery, entityExists, exitQuery, hasComponent, removeEntity} from 'bitecs';
import {TransformComponent} from '../components/TransformComponent';
import {EnemyComponent} from '../components/EnemyComponent';
import {World} from '../main';
import {AttachmentComponent} from '../components/AttachmentComponent';
import {EventListenerComponent, EventConfig, EventTypes} from '../components/EventListenerComponent';
import {configManager} from '../configs/ConfigManager';

export const createEnemyDeSpawnSystem = () => {
  const attachmentQuery = defineQuery([AttachmentComponent]);
  const enemyQuery = defineQuery([TransformComponent, EnemyComponent]);
  const onDeathQuery = defineQuery([EventListenerComponent]);

  const getImmediateChildren = (world: World, current: number, target: number): number[] | null => {
    const rec = hasComponent(world, AttachmentComponent, current) ? getImmediateChildren(world, AttachmentComponent.attachedTo[current], target) : null;
    if (current === target) {
      return [];
    } else if (rec !== null) {
      return [current, ...rec];
    } else return null;
  };

  const cleanupChildren = (world: World) => {
    while (true) {
      // Get newly removed nodes
      const exitAttachmentQuery = exitQuery(attachmentQuery);
      const removedNodes = exitAttachmentQuery(world);
      // Loop until all children are removed
      if (removedNodes.length === 0) {
        break;
      }
      // For every node that was just removed,
      for (const removedNode of removedNodes) {
        // Check if it was actually the parent of some child,
        for (const attached of attachmentQuery(world)) {
          // And get its children,
          for (const child of getImmediateChildren(world, attached, removedNode) ?? []) {
            // And eat them
            if (entityExists(world, child)) removeEntity(world, child);
          }
        }
      }
    }
  };

  return (world: World) => {
    const onDeathEntities = onDeathQuery(world);
    const attachments = attachmentQuery(world);

    for (const enemy of enemyQuery(world)) {
      if (EnemyComponent.hp[enemy] <= 0) {
        for (const onDeathEntity of onDeathEntities) {
          if (EventListenerComponent.eid[onDeathEntity] === enemy && EventListenerComponent.type[onDeathEntity] === EventTypes.DEATH) {
            configManager.get<EventConfig>(EventListenerComponent.configIndex[onDeathEntity]).callback();
          }
        }
        removeEntity(world, enemy);

        // First remove immediate children of enemy
        for (const attached of attachments) {
          for (const child of getImmediateChildren(world, attached, enemy) ?? []) {
            if (entityExists(world, child)) removeEntity(world, child);
          }
        }

        // Remove children tree recusively
        cleanupChildren(world);
      }
    }
    return world;
  };
};
