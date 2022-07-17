import {World} from '../../../main';

export interface BulletSpawn {
  x: number;
  y: number;
  angle: number;
  speed: number;
}

export type BurstFunction = (world: World, enemy: number, player: number, currentBurst: number) => BulletSpawn[];
