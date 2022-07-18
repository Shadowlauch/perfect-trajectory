import {defineQuery, exitQuery, removeEntity} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {Enemy} from '../components/Enemy';
import {World} from '../main';
import {StageComponent} from '../components/Stage';

export const createEnemyDeSpawnSystem = () => {
  const enemyQuery = defineQuery([Position, Velocity, Enemy]);
  const stageQuery = defineQuery([StageComponent]);
  const exitStageQuery = exitQuery(stageQuery);

  return (world: World) => {
    const stageExit = exitStageQuery(world).length > 0;
    for (const enemy of enemyQuery(world)) {
      if (stageExit || Enemy.hp[enemy] <= 0) removeEntity(world, enemy);
    }
    return world;
  }
}
