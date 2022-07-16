import {defineComponent, Types} from 'bitecs';

export const CollisionComponent = defineComponent({
  group: Types.ui32,
  filter: Types.ui32
});
