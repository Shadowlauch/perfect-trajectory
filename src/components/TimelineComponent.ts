import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';
import {configManager} from '../configs/ConfigManager';

export interface TimelineEntry {
    delay: number;
    onTime: (world: World) => void;
    canPass?: (world: World) => boolean;
}

export type Timeline = TimelineEntry[];

/** Controls timings of stages, enemies, etc. */
export const TimelineComponent = defineComponent({
    /** add comment */
    referenceTime: Types.f32,
    /** Index into ConfigManager */
    configIndex: Types.ui8,
    currentTimelineIndex: Types.i16,
    calledTimelineIndex: Types.i16,
});

export const addTimelineComponent = (world: World, entity: number, config: Timeline) => {
    addComponent(world, TimelineComponent, entity);
    TimelineComponent.currentTimelineIndex[entity] = 0;
    TimelineComponent.calledTimelineIndex[entity] = 0;
    TimelineComponent.referenceTime[entity] = world.time.elapsed;
    TimelineComponent.configIndex[entity] = configManager.add(config);
}
