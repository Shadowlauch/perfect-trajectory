import {Stage0} from './Stage0';

export interface EnemySpawnConfig {
  x: number;
  y: number;
  time: number;
  enemyConfigIndex: number;
}

export interface StageConfig {
  enemySpawns: EnemySpawnConfig[];
}

export const STAGES = [
  Stage0
];
