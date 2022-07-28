import { removeEntity } from 'bitecs';
import { Timeline, addTimelineComponent } from '../../../../components/TimelineComponent';
import { spawnBullet } from '../../spawnBullet';
import { createArcBurst } from '../burst/Arc';
import {BulletSpawnCallback} from './BulletSpawnCallback';

export const addExplosionTimer = (delay: number, numberOfBullets: number): BulletSpawnCallback => {
  return (world, bullet) => {

    addTimelineComponent(world, bullet, [
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
    ] as Timeline)
  }
}
