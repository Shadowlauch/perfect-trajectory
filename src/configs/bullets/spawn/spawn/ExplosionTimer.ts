import { addComponent, removeEntity } from 'bitecs';
import { BulletSpawnComponent } from '../../../../components/BulletSpawn';
import { TimelineComponent } from '../../../../components/Timeline';
import { configManager } from '../../../ConfigManager';
import { Timeline } from '../../../stages/Stage0';
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

          addComponent(world, BulletSpawnComponent, bullet);
        
          BulletSpawnComponent.startTime[bullet] = world.time.elapsed;
          BulletSpawnComponent.configIndex[bullet] = configManager.add<BulletSpawnConfig>({
            loop: 1,
            burstCount: 1,
            burstDelay: 1,
            loopDelay: 1,
            onBurst: createArcBurst(numberOfBullets, 360)
          })  

        }
      },
      {
        delay: 100,
        onTime: () => {
          removeEntity(world, bullet)
        }
      }
    ])

  }
}
