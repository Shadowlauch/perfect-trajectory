import {EnemyData} from '../../../components/EnemyData';
import {InitFunction} from './InitFunction';

export const createTurnInit = (): InitFunction => {
  return (_world, enemy) => {
    // get player position if now is the start of a burst

    EnemyData.bulletAngle[enemy] = (EnemyData.bulletAngle[enemy] + (Math.PI / 32)) % (Math.PI * 2);
  }
}
