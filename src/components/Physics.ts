import { defineComponent } from 'bitecs';
import { Scalar, Vector2 } from './Common';

export const Velocity = defineComponent(Vector2);
export const Speed = defineComponent(Scalar);
export const Accel = defineComponent(Scalar);
export const AngularSpeed = defineComponent(Scalar);
