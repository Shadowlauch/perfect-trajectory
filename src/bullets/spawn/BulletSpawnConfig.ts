import {Position} from '../../components/Position';
import {createArcBurst} from './burst/Arc';
import {BurstFunction} from './burst/BurstFunction';
import {createPlayerTargetInit} from './init/PlayerTarget';
import {createTurnInit} from './init/Turn';
import {InitFunction} from './init/InitFunction';

export interface BulletSpawnConfig {
  startDelay: number;
  loop: number | boolean;
  burstCount: number;
  burstDelay: number;
  onInit?: InitFunction;
  onBurst: BurstFunction;
}

export const testConfig: BulletSpawnConfig = {
  startDelay: 2000,
  loop: true,
  burstCount: 6,
  burstDelay: 200,
  onInit: createPlayerTargetInit(),
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

export const test2Config: BulletSpawnConfig = {
  startDelay: 0,
  loop: true,
  burstCount: 1,
  burstDelay: 100,
  onInit: createTurnInit(),
  onBurst: createArcBurst(4, 180),
};




