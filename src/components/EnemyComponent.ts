import {defineComponent, Types} from 'bitecs';

export const EnemyComponent = defineComponent({spawnTime: Types.ui32, hp: Types.f32, maxHp: Types.f32});
