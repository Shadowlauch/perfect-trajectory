import {defineComponent, Types} from 'bitecs';

export const Enemy = defineComponent({bulletAngle: Types.f32, configIndex: Types.ui8, spawnTime: Types.ui32});
