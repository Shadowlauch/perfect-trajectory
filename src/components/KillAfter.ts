import {defineComponent, Types} from 'bitecs';

/** Kill an entity after a specified amount time */
export const KillAfter = defineComponent({
    /** Time to kill entity, in milliseconds */
    ms: Types.f32
});

/** Used for initializing positions when spawning entities. Entity removes AttachmentComponent at end of frame. */
export const Unparent = defineComponent();
