import {World} from '../../main';

export interface EnemySpawnConfig {
  time: number;
  onSpawn: (world: World) => void;
}

export interface StageConfig {
  enemySpawns: EnemySpawnConfig[];
}
