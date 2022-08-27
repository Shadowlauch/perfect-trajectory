import {defineQuery, enterQuery} from 'bitecs';
import {World} from '../main';
import {TimelineComponent, Timeline} from '../components/TimelineComponent';
import {configManager} from '../configs/ConfigManager';

export const createTimelineSystem = () => {
  const timelineQuery = defineQuery([TimelineComponent]);
  const timelineEnterQuery = enterQuery(timelineQuery);

  const initializeTimelines = (world: World) => {
    for (const timeline of timelineEnterQuery(world)) {
      TimelineComponent.calledTimelineIndex[timeline] = -1;
      TimelineComponent.referenceTime[timeline] = world.time.elapsed;
    }
  }

  return (world: World) => {
    const {time: {elapsed}} = world;

    initializeTimelines(world);

    for (const timeline of timelineQuery(world)) {
      const timelineConfig = configManager.get<Timeline>(TimelineComponent.configIndex[timeline]);
      const currentIndex = TimelineComponent.currentTimelineIndex[timeline];
      const calledIndex = TimelineComponent.calledTimelineIndex[timeline];

      for (let i = currentIndex; i < timelineConfig.length; i++){
        const timeSinceReference = elapsed - TimelineComponent.referenceTime[timeline];
        const timelineEntry = timelineConfig[i];
        if (timeSinceReference >= timelineEntry.delay) {
          if (i !== calledIndex) {
            timelineEntry.onTime(world);

            //Needs to run so if we add a timeline with a delay 0 first element it is immediately processed
            initializeTimelines(world);

            TimelineComponent.currentTimelineIndex[timeline] = i;
            TimelineComponent.calledTimelineIndex[timeline] = i;
            TimelineComponent.referenceTime[timeline] = elapsed;//timeSinceReference - timelineEntry.time
          }

          if (!(timelineEntry.canPass?.(world) ?? true)) break;
          else {
            TimelineComponent.referenceTime[timeline] = elapsed;
            TimelineComponent.currentTimelineIndex[timeline] = i + 1;
          }
        } else break;
      }
    }
    return world;
  }
}
