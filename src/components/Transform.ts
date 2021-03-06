import {defineComponent, Types} from 'bitecs';
import { Vector2 } from './Common';

/**
 * Displacement of entity in world frame.
 * If {@link Attachment} component is also on the entity, origin and frameRotation are
 * updated to reflect changes to the local reference frame.
 */
export const Transform = defineComponent({
    /** Position displacement relative to origin */
    position: Vector2,
    /** Local rotation of entity. Radians */
    rotation: Types.f32,
    /** Origin of entity. If entity isn't parented to any entity, will probably stay (0,0). */
    origin: Vector2,
    /** Rotation of local reference frame. If entity isn't parented to any entity, will probably stay 0. Radians */
    frameRotation: Types.f32,
    /** Do not touch. Position of entity in global reference frame. */
    globalPosition: Vector2,
    /** Do not touch. Rotation of entity in global reference frame. Radians */
    globalRotation: Types.f32,
});
