import {defineComponent, Types} from 'bitecs';

/** Give the entity a graphic */
export const SpriteComponent = defineComponent({
    /** Scale modifier */
    scale: Types.f32,
    zIndex: Types.ui8,
    spriteIndex: Types.ui16,
    darkG: Types.f32,
    darkB: Types.f32,
    darkR: Types.f32
});
