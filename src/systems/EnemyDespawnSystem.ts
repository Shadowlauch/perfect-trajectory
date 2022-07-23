import {defineQuery, entityExists, exitQuery, hasComponent, removeEntity} from 'bitecs';
import {Velocity} from '../components/Physics';
import {Transform} from '../components/Transform';
import {EnemyComponent} from '../components/EnemyComponent';
import {World} from '../main';
import {StageComponent} from '../components/Stage';
import {AttachmentComponent} from '../components/Attachment';

export const createEnemyDeSpawnSystem = () => {
  const attachmentQuery = defineQuery([AttachmentComponent]);
  const enemyQuery = defineQuery([Transform, Velocity, EnemyComponent]);
  const stageQuery = defineQuery([StageComponent]);
  const exitStageQuery = exitQuery(stageQuery);

  const despawnAttached = (world: World, current: number, target: number): number[] | null => {
    const rec = hasComponent(world, AttachmentComponent, current) ? despawnAttached(world, AttachmentComponent.attachedTo[current], target) : null;
    if (current === target) {
      return [];
    } else if (rec !== null) {
      return [current, ...rec];
    } else return null;
  };

  return (world: World) => {
    const stageExit = exitStageQuery(world).length > 0;
    for (const enemy of enemyQuery(world)) {
      if (stageExit || EnemyComponent.hp[enemy] <= 0) {
        removeEntity(world, enemy);

        for (const attached of attachmentQuery(world)) {
          for (const attachedElement of despawnAttached(world, attached, enemy) ?? []) {
            if (entityExists(world, attachedElement)) removeEntity(world, attachedElement);
          }
        }
      }
    }
    return world;
  }
}
