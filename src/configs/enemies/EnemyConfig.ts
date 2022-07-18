import {BulletSpawnConfig} from '../bullets/spawn/BulletSpawnConfig';
import {createTurnLoop} from '../bullets/spawn/loop/Turn';
import {createPlayerTargetLoop} from '../bullets/spawn/loop/PlayerTarget';
import {createArcBurst} from '../bullets/spawn/burst/Arc';

export interface CircleDisplay {
  color: number;
  radius: number;
}

// points of the path the enemy follows
// controlled only by time, so doesn't have
// "make 3 shots, then fly away" mechanic
// time is relative - "length of this step"
export interface PathPoint {
  x: number;
  y: number;
  delay: number;
}

export interface EnemyConfig {
  display: CircleDisplay;
  bulletSpawnConfig: BulletSpawnConfig;
  hp: number;
  path?: PathPoint[];
}

export const ENEMIES: EnemyConfig[] = [
  {
    hp: 100,
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
  },
  {
    hp: 100,
    display: {
      color: 0x008888,
      radius: 40
    },
    bulletSpawnConfig: {
      loopDelay: 400,
      loop: 3,
      burstCount: 4,
      burstDelay: 200,
      onLoop: createPlayerTargetLoop(),
      onBurst: createArcBurst(3, 60),
    },
    path: [
      {
        x: 0,
        y: 100,
        delay: 3000
      },
      {
        x: 50,
        y: 100,
        delay: 3000
      },
      {
        x: 50,
        y: 0,
        delay: 3000
      }
    ]
  }
]
