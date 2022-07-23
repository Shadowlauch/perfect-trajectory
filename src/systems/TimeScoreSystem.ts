import {defineQuery} from 'bitecs';
import {World} from '../main';
import {PlayerComponent} from '../components/PlayerComponent';

export const createTimeScoreSystem = () => {
  const playerQuery = defineQuery([PlayerComponent]);

  return (world: World) => {
    const { time: {delta} } = world
    const player = playerQuery(world)[0];
    PlayerComponent.score[player] += delta;

    return world
  }
}
