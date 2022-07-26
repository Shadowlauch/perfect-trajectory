import { addComponent, removeEntity } from 'bitecs';
import { BulletSpawnComponent } from '../../../../components/BulletSpawn';
import { TimelineComponent } from '../../../../components/Timeline';
import { configManager } from '../../../ConfigManager';
import { Timeline } from '../../../stages/Stage0';
import { spawnBullet } from '../../spawnBullet';
import { BulletSpawnConfig } from '../BulletSpawnConfig';
import { createArcBurst } from '../burst/Arc';
import {BulletSpawnCallback} from './BulletSpawnCallback';

export const addExplosionTimer = (delay: number, numberOfBullets: number): BulletSpawnCallback => {
  return (world, bullet) => {


    addComponent(world, TimelineComponent, bullet);
    TimelineComponent.configIndex[bullet] = configManager.add<Timeline>([
      {
        delay: delay,
        onTime: () => {
          
          const bullets = createArcBurst(numberOfBullets, 360)(world, bullet, 0)
          for (const bullet of bullets) {
            spawnBullet(world, bullet.x, bullet.y, bullet.rotation, bullet.speed)

          }
        }
      },
      {
        delay: 150,
        onTime: () => {
          removeEntity(world, bullet)
        }
      }
    ])

  }
}
