import { defineComponent } from 'bitecs';
import { Scalar, Vector2 } from './Common';

/** Modifies the entity's Transform.position */
export const Velocity = defineComponent(Vector2);
/** Modifies the entity's Velocity if Transform.angle is also present */
export const Speed = defineComponent(Scalar);
/** Modifies the entity's Speed */
export const Accel = defineComponent(Scalar);
/** Modifies the entity's Transform.angle */
export const AngularSpeed = defineComponent(Scalar);
