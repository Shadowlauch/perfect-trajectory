import {Enemy} from '../../../../components/Enemy';
import {LoopFunction} from './LoopFunction';

export const createTurnLoop = (): LoopFunction => {
  return (_world, enemy) => {
    // get player position if now is the start of a burst

    Enemy.bulletAngle[enemy] = (Enemy.bulletAngle[enemy] + (Math.PI / 32)) % (Math.PI * 2);
  }
}
