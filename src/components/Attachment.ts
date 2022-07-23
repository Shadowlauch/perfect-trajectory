import {defineComponent, Types} from 'bitecs';

/** Parent an entity to another entity */
export const AttachmentComponent = defineComponent({
    /** EID of parent */
    attachedTo: Types.eid,
    /** Boolean, if true, applies parent's position to transform */
    referenceParentPosition: Types.i8,
    /** Boolean, if true, applies parent's rotation to transform */
    referenceParentRotation: Types.i8,
});
