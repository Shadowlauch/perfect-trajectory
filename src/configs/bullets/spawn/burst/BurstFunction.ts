import {World} from '../../../../main';

export interface BulletSpawn {
  x: number;
  y: number;
  rotation: number;
  speed: number;
}

export type BurstFunction = (world: World, spawner: number, currentBurst: number) => BulletSpawn[];
