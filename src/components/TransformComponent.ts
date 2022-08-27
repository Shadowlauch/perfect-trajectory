import {addComponent, defineComponent, Types} from 'bitecs';
import {Vector2, Vector2Type} from './Common';
import {World} from '../main';

/**
 * Displacement of entity in world frame.
 * If {@link AttachmentComponent} component is also on the entity, origin and frameRotation are
 * updated to reflect changes to the local reference frame.
 */
export const TransformComponent = defineComponent({
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

type Config = {
    position?: Partial<Vector2Type>,
    rotation?: number,
    origin?: Partial<Vector2Type>,
    frameRotation?: number
};

export function addTransformComponent(world: World, entity: number): void;
export function addTransformComponent(world: World, entity: number, x: number, y: number, rotation?: number): void;
export function addTransformComponent(world: World, entity: number, config: Config): void;
export function addTransformComponent(world: World, entity: number, p1?: number | Config, p2?: number, p3?: number)  {
    const config = typeof p1 !== "object" ? {} : p1;
    const x = typeof p1 === "number" ? p1 : config.position?.x;
    const y = p2 ?? config.position?.y;
    const rotation = p3 ?? config.rotation;

    addComponent(world, TransformComponent, entity);
    TransformComponent.position.x[entity] = x ?? 0;
    TransformComponent.position.y[entity] = y ?? 0;
    TransformComponent.rotation[entity] = rotation ?? 0;
    TransformComponent.origin.x[entity] = config.origin?.x ?? 0;
    TransformComponent.origin.y[entity] = config.origin?.y ?? 0;
    TransformComponent.frameRotation[entity] = config.frameRotation ?? 0;
    TransformComponent.globalPosition.x[entity] = 0;
    TransformComponent.globalPosition.y[entity] = 0;
    TransformComponent.globalRotation[entity] = 0;
}
