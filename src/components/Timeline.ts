import {defineComponent, Types} from 'bitecs';

/** Controls timings of stages, enemies, etc. */
export const TimelineComponent = defineComponent({
    /** add comment */
    starTime: Types.f32,
    /** Index into ConfigManager */
    configIndex: Types.ui8
});
