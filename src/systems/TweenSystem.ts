import {World} from '../main';
import {addComponent, defineQuery, enterQuery, removeComponent} from 'bitecs';
import {TweenComponent} from '../components/TweenComponent';
import {configManager} from '../configs/ConfigManager';
import {lerp} from '../utils/math';

export interface TweenConfig {
  startValue: number;
  endValue: number;
  onUpdate: (currentValue: number, eid: number) => void;
  duration: number;
  yoyo?: boolean;
}

export const createTweenSystem = () => {
  const tweenQuery = defineQuery([TweenComponent]);
  const enterTweenQuery = enterQuery(tweenQuery);

  return (world: World) => {
    const {time: {elapsed}} = world;

    for (const tween of enterTweenQuery(world)) {
      TweenComponent.startTime[tween] = elapsed;
    }

    for (const tweenEntity of tweenQuery(world)) {
      const config = configManager.get<TweenConfig>(TweenComponent.tweenConfigIndex[tweenEntity]);
      const startTime = TweenComponent.startTime[tweenEntity];
      const aliveTime = elapsed - startTime;
      config.onUpdate(lerp(config.startValue, config.endValue, Math.min(aliveTime / config.duration, 1)), tweenEntity);

      if (aliveTime >= config.duration) {
        configManager.remove(TweenComponent.tweenConfigIndex[tweenEntity]);
        removeComponent(world, TweenComponent, tweenEntity, true);

        if (config.yoyo) {
          addComponent(world, TweenComponent, tweenEntity);
          TweenComponent.tweenConfigIndex[tweenEntity] = configManager.add<TweenConfig>({
            ...config,
            yoyo: false,
            startValue: config.endValue,
            endValue: config.startValue
          })
        }
      }

    }

    return world;
  }
}
