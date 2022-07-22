import {defineQuery} from 'bitecs';
import {World} from '../main';
import {TimelineComponent} from '../components/Timeline';
import {configManager} from '../configs/ConfigManager';
import {Timeline} from '../configs/stages/Stage0';

export const createTimelineSystem = () => {
  const timelineQuery = defineQuery([TimelineComponent]);

  return (world: World) => {
    const {time: {elapsed, delta}} = world;
    for (const timeline of timelineQuery(world)) {
      const timeSinceStart = elapsed - TimelineComponent.starTime[timeline];
      const timelineConfig = configManager.get<Timeline>(TimelineComponent.configIndex[timeline]);

      for (const timelineEntry of timelineConfig) {
        if (timeSinceStart >= timelineEntry.time && timeSinceStart - timelineEntry.time - delta < 0) {
          timelineEntry.onTime(world);
        }
      }


    }
    return world;
  }
}
