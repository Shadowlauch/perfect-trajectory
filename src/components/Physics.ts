import {addComponent, defineComponent} from 'bitecs';
import {Scalar, Vector2, Vector2Type} from './Common';
import {World} from '../main';

/** Modifies the entity's Transform.position */
export const VelocityComponent = defineComponent(Vector2);
/** Modifies the entity's Velocity if Transform.rotation is also present */
export const SpeedComponent = defineComponent(Scalar);
/** Modifies the entity's Speed */
export const AccelComponent = defineComponent(Scalar);
/** Modifies the entity's Transform.rotation */
export const AngularSpeedComponent = defineComponent(Scalar);

export const addAngularSpeedComponent = (world: World, entity: number, speed: number = 0) => {
  addComponent(world, AngularSpeedComponent, entity);
  AngularSpeedComponent.val[entity] = speed;
}

export const addAccelComponent = (world: World, entity: number, accel: number = 0) => {
  addComponent(world, AccelComponent, entity);
  AccelComponent.val[entity] = accel;
}

export const addSpeedComponent = (world: World, entity: number, speed: number = 0) => {
  addComponent(world, SpeedComponent, entity);
  SpeedComponent.val[entity] = speed;
}

export const addVelocityComponent = (world: World, entity: number, velocity?: Partial<Vector2Type>) => {
  addComponent(world, VelocityComponent, entity);
  VelocityComponent.x[entity] = velocity?.x ?? 0;
  VelocityComponent.y[entity] = velocity?.y ?? 0;
}
