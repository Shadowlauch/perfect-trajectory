import {addComponent, addEntity, defineQuery, exitQuery, removeEntity} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {Enemy} from '../components/Enemy';
import {World} from '../main';
import {StageComponent} from '../components/Stage';
import {STAGES} from '../configs/stages/StageConfig';
import {GraphicsCircle} from '../components/GraphicsCircle';
import {ENEMIES} from '../configs/enemies/EnemyConfig';

export const createEnemySpawnSystem = () => {
  const enemyQuery = defineQuery([Position, Velocity, Enemy]);
  const stageQuery = defineQuery([StageComponent]);
  const exitStageQuery = exitQuery(stageQuery);

  return (world: World) => {
    const {time: {elapsed, delta}} = world;

    const stage = stageQuery(world)[0];
    const stageConfig = STAGES[StageComponent.stageIndex[stage]];
    const timeSinceStageStart = elapsed - StageComponent.startTime[stage];
    const enemySpawns = stageConfig.enemySpawns;

    for (const enemySpawn of enemySpawns) {
      if (enemySpawn.time <= timeSinceStageStart && (timeSinceStageStart - enemySpawn.time - delta) < 0) {
        const enemyConfig = ENEMIES[enemySpawn.enemyConfigIndex];
        const eid = addEntity(world);
        addComponent(world, Position, eid);
        addComponent(world, Velocity, eid);
        addComponent(world, Enemy, eid);
        Position.x[eid] = enemySpawn.x;
        Position.y[eid] = enemySpawn.y;
        Enemy.spawnTime[eid] = elapsed;
        Enemy.configIndex[eid] = enemySpawn.enemyConfigIndex;

        addComponent(world, GraphicsCircle, eid);
        GraphicsCircle.color[eid] = enemyConfig.display.color;
        GraphicsCircle.radius[eid] = enemyConfig.display.radius;

      }
    }

    if (exitStageQuery(world).length > 0) {
      for (const eid of enemyQuery(world)) {
        removeEntity(world, eid);
      }
    }

    return world;
  }
}
