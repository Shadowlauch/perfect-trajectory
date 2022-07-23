import {defineComponent, Types} from 'bitecs';
import { Vector2 } from './Common';

/**
 * Displacement of entity in world frame.
 * If {@link LocalTransform} is also on the entity, it is applied to this
 * component to obtain the final entity position.
 * */
export const Transform = defineComponent({position: Vector2, rotation: Types.f32});
/**
 * Displacement of entity in local origin frame.
 * MovementSystem applies {@link Transform} to this component to obtain the final entity position.
 */
export const LocalTransform = defineComponent({position: Vector2, rotation: Types.f32});
