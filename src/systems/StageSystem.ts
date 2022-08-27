import {defineQuery, exitQuery, Not, removeEntity} from 'bitecs';
import {World} from '../main';
import {StageComponent} from '../components/StageComponent';
import {PlayerComponent} from '../components/PlayerComponent';
import {TransformComponent} from '../components/TransformComponent';
import {playerStartCoords} from '../entities/Player';

export const createStageSystem = () => {
  const stageQuery = defineQuery([StageComponent]);
  const stageExitQuery = exitQuery(stageQuery);
  const stageEntitiesQuery = defineQuery([Not(PlayerComponent), Not(StageComponent)]);
  const playerQuery = defineQuery([PlayerComponent]);

  return (world: World) => {
    if (stageExitQuery(world).length > 0) {
      for (const entity of stageEntitiesQuery(world)) {
        removeEntity(world, entity);
      }

      const player = playerQuery(world)[0];
      const [x, y] = playerStartCoords(world);
      TransformComponent.position.x[player] = x;
      TransformComponent.position.y[player] = y;
    }

    return world;
  };

};
