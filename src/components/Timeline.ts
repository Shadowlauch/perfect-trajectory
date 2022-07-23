import {defineComponent, Types} from 'bitecs';

/** Controls timings of stages, enemies, etc. */
export const TimelineComponent = defineComponent({
    /** add comment */
    referenceTime: Types.f32,
    /** Index into ConfigManager */
    configIndex: Types.ui8,
    currentTimelineIndex: Types.i16,
    calledTimelineIndex: Types.i16,
});
