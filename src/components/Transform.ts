import {defineComponent, Types} from 'bitecs';
import { Vector2 } from './Common';


export const Transform = defineComponent({position: Vector2, rotation: Types.f32});
