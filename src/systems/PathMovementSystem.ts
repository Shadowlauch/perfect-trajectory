import {defineQuery, exitQuery} from 'bitecs';
import { TransformComponent } from '../components/TransformComponent';
import {World} from '../main';
import { EnemyComponent } from '../components/EnemyComponent';
import {configManager} from '../configs/ConfigManager';
import {PathComponent} from '../components/PathComponent';
import {PathPoint} from '../configs/enemies/EnemyConfig';
import {lerp} from '../utils/math';

export const createPathMovementSystem = () => {
  const pathQuery = defineQuery([TransformComponent, EnemyComponent, PathComponent]);
  const pathExitQuery = exitQuery(pathQuery);

  return (world: World) => {
    const {time: {elapsed}} = world;
    for (const pathEntity of pathQuery(world)) {

      const path = configManager.get<PathPoint[]>(PathComponent.configIndex[pathEntity]);
      if (path === undefined) continue

      const spawnTime = PathComponent.starTime[pathEntity];
      const aliveTime = elapsed - spawnTime
      
      let targetTime = 0
      let prevPointAbsTime = 0
      let prevPoint = {
        x: 0,
        y: 0,
        delay: 0
      }
      const timeFactor = 1 / PathComponent.speed[pathEntity]
      for (const point of path) {
        targetTime += point.delay * timeFactor

        if (aliveTime < targetTime) {
          const relativeTime = (aliveTime - prevPointAbsTime) / point.delay

          const shiftX = lerp(prevPoint.x, point.x, relativeTime)
          TransformComponent.position.x[pathEntity] = PathComponent.startX[pathEntity] + shiftX
          const shiftY = lerp(prevPoint.y, point.y, relativeTime)
          TransformComponent.position.y[pathEntity] = PathComponent.startY[pathEntity] + shiftY
          break
        }
        prevPoint = point
        prevPointAbsTime = targetTime
      }
    }

    for (const entity of pathExitQuery(world)) {
      configManager.remove(PathComponent.configIndex[entity]);
    }

    return world;
  }
}
