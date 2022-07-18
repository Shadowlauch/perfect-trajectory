import {Position} from '../../../components/Position';
import {createArcBurst} from './burst/Arc';
import {BurstFunction} from './burst/BurstFunction';
import {createPlayerTargetLoop} from './loop/PlayerTarget';
import {LoopFunction} from './loop/LoopFunction';

export interface BulletSpawnConfig {
  startDelay?: number;
  loop: number | boolean;
  loopDelay?: number;
  burstCount: number;
  burstDelay: number;
  onLoop?: LoopFunction;
  onBurst: BurstFunction;
}

export const testConfig: BulletSpawnConfig = {
  startDelay: 2000,
  loop: true,
  burstCount: 6,
  burstDelay: 200,
  onLoop: createPlayerTargetLoop(),
  onBurst: createArcBurst(9, 20)
};

export const spiralConfig: BulletSpawnConfig = {
  startDelay: 0,
  loop: true,
  burstCount: 45,
  burstDelay: 20,
  onBurst: (_world, enemy, _player, currentBurst) => {
    const startX = Position.x[enemy];
    const startY = Position.y[enemy];
    return [{x: startX, y: startY, angle: (currentBurst * 8) / 180 * Math.PI, speed: 0.1}];
  },
};





