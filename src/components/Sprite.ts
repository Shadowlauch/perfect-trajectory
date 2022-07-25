import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';
import {spriteLoader} from '../loader/Loader';

const sprite = {
    /** Scale modifier */
    scale: Types.f32,
    zIndex: Types.ui8,
    spriteIndex: Types.ui16,
    darkG: Types.f32,
    darkB: Types.f32,
    darkR: Types.f32
};

/** Give the entity a graphic */
export const SpriteComponent = defineComponent(sprite);
export const AnimatedSpriteComponent = defineComponent({
    ...sprite,
    currentFrame: Types.i16,
    referenceTime: Types.f32
});



type test = Omit<typeof AnimatedSpriteComponent, 'spriteIndex' | 'referenceTime' | 'currentFrame'>;
export const addAnimatedSpriteComponent = (world: World, entity: number, key: string, tag: string,
                                           options: Partial<Record<keyof test, number>>) => {
    addComponent(world, AnimatedSpriteComponent, entity);
    AnimatedSpriteComponent.scale[entity] = 1;

    for (const [arg, value] of Object.entries(options)) {
        // @ts-ignore
        AnimatedSpriteComponent[arg][entity] = value
    }
    AnimatedSpriteComponent.spriteIndex[entity] = spriteLoader.getIndex(`${key}.${tag}`);
    AnimatedSpriteComponent.currentFrame[entity] = -1;
    AnimatedSpriteComponent.referenceTime[entity] = world.time.elapsed;
}
