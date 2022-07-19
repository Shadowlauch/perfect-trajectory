import {defineQuery} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {World} from '../main';
import { Player } from '../components/Player';
import { Enemy } from '../components/Enemy';
import {spawnBullet} from '../configs/bullets/spawnBullet';
import {ENEMIES} from '../configs/enemies/EnemyConfig';
import {BulletComponent} from '../components/Bullet';

export const createBulletSpawnSystem = () => {
  const playerQuery = defineQuery([Position, Velocity, Player]);
  const enemyQuery = defineQuery([Position, Velocity, Enemy]);

  return (world: World) => {
    const {time: {elapsed, delta}} = world;
    for (const enemy of enemyQuery(world)) {
      const config = ENEMIES[Enemy.configIndex[enemy]].bulletSpawnConfig;
      const spawnTime = Enemy.spawnTime[enemy];
      const startTime = elapsed - spawnTime - (config.startDelay ?? 0);
      const lifeTime = elapsed - spawnTime

      if (startTime < 0) continue;

      const timePerLoop = (config.burstDelay * config.burstCount) + (config.loopDelay ?? 0);
      const intraLoopTime = lifeTime % timePerLoop;
      const loopedTimes = Math.floor(lifeTime / timePerLoop);
      const infiniteLoop = typeof config.loop === "boolean" && config.loop;
      const loopTimes = config.loop === false ? 0 : config.loop

      if (!infiniteLoop && loopTimes < loopedTimes) continue;

      const player = playerQuery(world)[0];
      if (intraLoopTime - delta <= 0) config.onLoop?.(world, enemy, player);

      const currentBurstCount = Math.floor(intraLoopTime / config.burstDelay);
      if (currentBurstCount < config.burstCount && (intraLoopTime - (currentBurstCount * config.burstDelay) - delta) <= 0){
        const bulletSpawns = config.onBurst(world, enemy, player, currentBurstCount);
        for (const bulletSpawn of bulletSpawns) {
          const bullet = spawnBullet(world, bulletSpawn.x, bulletSpawn.y, bulletSpawn.angle, bulletSpawn.speed);
          BulletComponent.spawnedBy[bullet] = enemy;
          BulletComponent.damage[bullet] = 1;
        }
      }


    }
    return world;
  }
}
