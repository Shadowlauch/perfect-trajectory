import {defineComponent, Types} from 'bitecs';

export const PlayerComponent = defineComponent({
  lives: Types.ui8,
  maxLives: Types.ui8,
  score: Types.ui32
});
