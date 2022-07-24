import {defineComponent, Types} from 'bitecs';

/**
 * Parent an entity to another entity.
 * MovementSystem applies {@link Transform} to this local transform to obtain the final entity position.
 */
export const AttachmentComponent = defineComponent({
    /** EID of parent */
    attachedTo: Types.eid,
    /** Boolean, if true, applies parent's angle to local reference frame */
    applyParentAngle: Types.i8,
});
