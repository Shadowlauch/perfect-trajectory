import {BurstFunction} from './burst/BurstFunction';
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





