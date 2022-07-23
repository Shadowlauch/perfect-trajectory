import {defineComponent, Types} from 'bitecs';

/** Kill an entity after a specified amount time */
export const KillAfter = defineComponent({
    /** Time to kill entity, in milliseconds */
    ms: Types.f32
});
