import {defineQuery} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {World} from '../main';
import { Player } from '../components/Player';
import { EnemyData } from '../components/EnemyData';
import {spawnBullet} from '../bullets/spawnBullet';
import {test2Config} from '../bullets/spawn/BulletSpawnConfig';

export const createBulletSpawnSystem = () => {
  const playerQuery = defineQuery([Position, Velocity, Player]);
  const enemyQuery = defineQuery([Position, Velocity, EnemyData]);

  return (world: World) => {
    const {time: {elapsed, delta}} = world;
    for (const enemy of enemyQuery(world)) {
      const config = test2Config;
      const timePerLoop = (config.burstDelay * config.burstCount) + config.startDelay;
      const intraLoopTime = elapsed % timePerLoop;
      const loopedTimes = Math.floor(elapsed / timePerLoop);
      const infiniteLoop = typeof config.loop === "boolean" && config.loop;
      const loopTimes = config.loop === false ? 0 : config.loop

      if (!infiniteLoop && loopTimes > loopedTimes) continue;

      const player = playerQuery(world)[0];
      if (intraLoopTime - delta <= 0) config.onInit?.(world, enemy, player);

      const currentBurstCount = Math.floor(intraLoopTime / config.burstDelay);
      if (currentBurstCount < config.burstCount && (intraLoopTime - (currentBurstCount * config.burstDelay) - delta) <= 0){
        const bulletSpawns = config.onBurst(world, enemy, player, currentBurstCount);
        for (const bulletSpawn of bulletSpawns) {
          spawnBullet(world, bulletSpawn.x, bulletSpawn.y, bulletSpawn.angle, bulletSpawn.speed);
        }
      }


    }
    return world;
  }
}
