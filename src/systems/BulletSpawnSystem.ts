import {defineQuery} from 'bitecs';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';
import {spawnBullet} from '../configs/bullets/spawnBullet';
import {BulletComponent} from '../components/BulletComponent';
import {BulletSpawnComponent} from '../components/BulletSpawnComponent';
import {configManager} from '../configs/ConfigManager';
import {BulletSpawnConfig} from '../configs/bullets/spawn/BulletSpawnConfig';

export const createBulletSpawnSystem = () => {
  const bulletSpawnQuery = defineQuery([TransformComponent, BulletSpawnComponent]);

  return (world: World) => {
    const {time: {elapsed, delta}} = world;
    for (const bulletSpawn of bulletSpawnQuery(world)) {
      const config = configManager.get<BulletSpawnConfig>(BulletSpawnComponent.configIndex[bulletSpawn]);
      const spawnTime = BulletSpawnComponent.startTime[bulletSpawn];
      const startTime = elapsed - spawnTime - (config.startDelay ?? 0);
      const lifeTime = elapsed - spawnTime

      if (startTime < 0) continue;

      const timePerLoop = (config.burstDelay * config.burstCount) + (config.loopDelay ?? 0);
      const intraLoopTime = lifeTime % timePerLoop;
      const loopedTimes = Math.floor(lifeTime / timePerLoop);
      const infiniteLoop = typeof config.loop === "boolean" && config.loop;
      const loopTimes = config.loop === false ? 0 : config.loop;

      if (!infiniteLoop && loopTimes <= loopedTimes) continue;

      if (intraLoopTime - delta <= 0) config.onLoop?.(world, bulletSpawn);

      const currentBurstCount = Math.floor(intraLoopTime / config.burstDelay);
      if (currentBurstCount < config.burstCount && (intraLoopTime - (currentBurstCount * config.burstDelay) - delta) <= 0){
        const bulletSpawns = config.onBurst(world, bulletSpawn, currentBurstCount);
        for (const bulletSpawn of bulletSpawns) {
          const bullet = spawnBullet(world, bulletSpawn.x, bulletSpawn.y, bulletSpawn.rotation, bulletSpawn.speed);
          if (config.onSpawn !== undefined) {
            config.onSpawn(world, bullet);
          }
          BulletComponent.damage[bullet] = 1;
        }
      }


    }
    return world;
  }
}
