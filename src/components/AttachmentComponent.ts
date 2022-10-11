import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';

/**
 * Parent an entity to another entity.
 * MovementSystem applies {@link Transform} to this local transform to obtain the final entity position.
 */
export const AttachmentComponent = defineComponent({
    /** EID of parent */
    attachedTo: Types.eid,
    /** Boolean, if true, applies parent's rotation to local reference frame */
    applyParentRotation: Types.i8,
    applyParentPosition: Types.i8
});

export const addAttachmentComponent = (world: World, entity: number, attachedTo: number, applyParentRotation = false, applyParentPosition = true) => {
    addComponent(world, AttachmentComponent, entity);
    AttachmentComponent.attachedTo[entity] = attachedTo;
    AttachmentComponent.applyParentRotation[entity] = !applyParentRotation ? 0 : 1;
    AttachmentComponent.applyParentPosition[entity] = !applyParentPosition ? 0 : 1;
};
