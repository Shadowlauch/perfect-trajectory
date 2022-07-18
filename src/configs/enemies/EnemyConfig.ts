import {BulletSpawnConfig} from '../bullets/spawn/BulletSpawnConfig';
import {createTurnLoop} from '../bullets/spawn/loop/Turn';
import {createArcBurst} from '../bullets/spawn/burst/Arc';

export interface CircleDisplay {
  color: number;
  radius: number;
}

export interface EnemyConfig {
  display: CircleDisplay;
  bulletSpawnConfig: BulletSpawnConfig;
}

export const ENEMIES: EnemyConfig[] = [
  {
    display: {
      color: 0x00ff00,
      radius: 50
    },
    bulletSpawnConfig: {
      loop: true,
      burstCount: 1,
      burstDelay: 100,
      onLoop: createTurnLoop(),
      onBurst: createArcBurst(4, 180),
    }
  }
]
