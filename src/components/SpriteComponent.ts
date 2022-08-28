import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';
import {spriteLoader} from '../loader/Loader';

const spriteComponent = {
    /** Scale modifier */
    scale: Types.f32,
    zIndex: Types.ui8,
    spriteIndex: Types.ui16,
    darkG: Types.f32,
    darkB: Types.f32,
    darkR: Types.f32,
    alpha: Types.f32
};

/** Give the entity a graphic */
export const SpriteComponent = defineComponent(spriteComponent);

type SpriteOptions = Omit<typeof SpriteComponent, 'spriteIndex'>;
export const addSpriteComponent = (world: World, entity: number, key: string,
                                           options: Partial<Record<keyof SpriteOptions, number>> = {}) => {
    addComponent(world, SpriteComponent, entity);
    SpriteComponent.scale[entity] = 1;
    SpriteComponent.alpha[entity] = 1;

    for (const [arg, value] of Object.entries(options)) {
        // @ts-ignore
        SpriteComponent[arg][entity] = value
    }
    SpriteComponent.spriteIndex[entity] = spriteLoader.getIndex(key);
}

export const AnimatedSpriteComponent = defineComponent({
    ...spriteComponent,
    currentFrame: Types.i16,
    referenceTime: Types.f32
});



type AnimatedSpriteOptions = Omit<typeof AnimatedSpriteComponent, 'spriteIndex' | 'referenceTime' | 'currentFrame'>;
export const addAnimatedSpriteComponent = (world: World, entity: number, key: string, tag: string,
                                           options: Partial<Record<keyof AnimatedSpriteOptions, number>>) => {
    addComponent(world, AnimatedSpriteComponent, entity);
    AnimatedSpriteComponent.scale[entity] = 1;
    AnimatedSpriteComponent.alpha[entity] = 1;

    for (const [arg, value] of Object.entries(options)) {
        // @ts-ignore
        AnimatedSpriteComponent[arg][entity] = value
    }
    AnimatedSpriteComponent.spriteIndex[entity] = spriteLoader.getIndex(`${key}.${tag}`);
    AnimatedSpriteComponent.currentFrame[entity] = -1;
    AnimatedSpriteComponent.referenceTime[entity] = world.time.elapsed;
}
