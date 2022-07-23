import {defineComponent, Types} from 'bitecs';

/** Give the entity a graphic */
export const SpriteComponent = defineComponent({
    /** Index into SPRITE inside Loader */
    spriteIndex: Types.ui8,
    /** Scale modifier */
    scale: Types.f32
});
