import {BurstFunction} from './burst/BurstFunction';
import {LoopFunction} from './loop/LoopFunction';
import {BulletSpawnCallback} from './spawn/BulletSpawnCallback';

export interface BulletSpawnConfig {
  startDelay?: number;
  loop: number | boolean;
  loopDelay?: number;
  burstCount: number;
  burstDelay: number;
  onStart?: LoopFunction;
  onLoop?: LoopFunction;
  onBurst: BurstFunction;
  onSpawn?: BulletSpawnCallback;
}





