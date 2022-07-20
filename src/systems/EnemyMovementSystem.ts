import {defineQuery} from 'bitecs';
import { Velocity } from '../components/Physics';
import { Transform } from '../components/Transform';
import {World} from '../main';
import { Enemy } from '../components/Enemy';
import {ENEMIES} from '../configs/enemies/EnemyConfig';

const lerp = (a: number, b: number, t: number) => {
  return a * (1 - t) + b * t
}

export const createEnemyMovementSystem = () => {
  const enemyQuery = defineQuery([Transform, Velocity, Enemy]);

  return (world: World) => {
    const {time: {elapsed}} = world;
    for (const enemy of enemyQuery(world)) {

      const path = ENEMIES[Enemy.configIndex[enemy]].path;
      if (path === undefined) continue

      const spawnTime = Enemy.spawnTime[enemy];
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
          Transform.position.x[enemy] = Enemy.spawnX[enemy] + shiftX
          const shiftY = lerp(prevPoint.y, point.y, relativeTime)
          Transform.position.y[enemy] = Enemy.spawnY[enemy] + shiftY
          break
        }
        prevPoint = point
        prevPointAbsTime = targetTime
      }



    }
    return world;
  }
}
