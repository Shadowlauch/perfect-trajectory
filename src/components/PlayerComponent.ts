import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';

export const PlayerComponent = defineComponent({
  lives: Types.ui8,
  maxLives: Types.ui8,
  score: Types.ui32
});

export const addPlayerComponent = (world: World, entity: number, maxLives: number) => {
  addComponent(world, PlayerComponent, entity);
  PlayerComponent.lives[entity] = maxLives;
  PlayerComponent.maxLives[entity] = maxLives;
  PlayerComponent.score[entity] = 0;
}
