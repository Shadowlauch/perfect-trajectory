import { defineComponent, Types } from 'bitecs';
import { Vector2 } from './Common';

export const Velocity = defineComponent(Vector2);
export const Speed = defineComponent(Types.f32);
export const Accel = defineComponent(Types.f32);
export const AngularSpeed = defineComponent(Types.f32);
