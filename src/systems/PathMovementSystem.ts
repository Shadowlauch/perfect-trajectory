import {defineQuery} from 'bitecs';
import { Transform } from '../components/Transform';
import {World} from '../main';
import { EnemyComponent } from '../components/EnemyComponent';
import {configManager} from '../configs/ConfigManager';
import {PathComponent} from '../components/Path';
import {PathPoint} from '../configs/enemies/EnemyConfig';

const lerp = (a: number, b: number, t: number) => {
  return a * (1 - t) + b * t
}

export const createPathMovementSystem = () => {
  const pathQuery = defineQuery([Transform, EnemyComponent]);

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
      for (const point of path) {
        targetTime += point.delay

        if (aliveTime < targetTime) {
          const relativeTime = (aliveTime - prevPointAbsTime) / point.delay

          const shiftX = lerp(prevPoint.x, point.x, relativeTime)
          Transform.position.x[pathEntity] = PathComponent.startX[pathEntity] + shiftX
          const shiftY = lerp(prevPoint.y, point.y, relativeTime)
          Transform.position.y[pathEntity] = PathComponent.startY[pathEntity] + shiftY
          break
        }
        prevPoint = point
        prevPointAbsTime = targetTime
      }



    }
    return world;
  }
}
