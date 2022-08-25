import {World} from '../main';
import {defineQuery, enterQuery, removeComponent} from 'bitecs';
import {TweenComponent} from '../components/TweenComponent';
import {configManager} from '../configs/ConfigManager';
import {lerp} from '../utils/math';

export interface TweenConfig {
  delay?: number;
  completeDelay?: number;
  startValue: number;
  endValue: number;
  onInit?: (entity: number) => void;
  onUpdate: (entity: number, currentValue: number) => void;
  onLoop?: (entity: number) => void;
  onComplete?: (entity: number) =>void;
  loop?: number | boolean;
  loopDelay?: number;
  duration: number;
  yoyo?: boolean;
  yoyoEase?: (t: number) => number
  ease?: (t: number) => number
}

export const createTweenSystem = () => {
  const tweenQuery = defineQuery([TweenComponent]);
  const enterTweenQuery = enterQuery(tweenQuery);

  return (world: World) => {
    const {time: {elapsed, delta}} = world;

    for (const tween of enterTweenQuery(world)) {
      const config = configManager.get<TweenConfig>(TweenComponent.tweenConfigIndex[tween]);
      TweenComponent.startTime[tween] = elapsed;
      config.onInit?.(tween);
    }

    for (const tweenEntity of tweenQuery(world)) {
      const config = configManager.get<TweenConfig>(TweenComponent.tweenConfigIndex[tweenEntity]);
      const delay = config?.delay ?? 0;
      const completeDelay = config?.completeDelay ?? 0;
      const startTime = TweenComponent.startTime[tweenEntity] + delay;
      const aliveTime = elapsed - startTime;

      if (aliveTime < 0) continue;

      const loopDelay = config.loopDelay ?? 0;
      const loopDuration = config.duration + loopDelay;

      const intraLoopTime = aliveTime % loopDuration;
      const loopedTimes = Math.floor(aliveTime / loopDuration);
      const loop = config.loop ?? 0;
      const infiniteLoop = typeof loop === "boolean" && loop;
      const loopTimes = loop === false ? 0 : loop;

      if (infiniteLoop || loopTimes >= loopedTimes) {
        const easingFunction = config.ease ?? ((t: number) => t);
        const yoyoEasingFunction = config.yoyoEase ?? ((t: number) => 1 - easingFunction(t));
        const yoyo = config.yoyo ?? false;
        const oneWayDuration = yoyo ? config.duration / 2 : config.duration;

        const isYoyo = intraLoopTime > oneWayDuration;
        const currentWayAliveTime = isYoyo ? intraLoopTime - oneWayDuration : intraLoopTime;
        const startValue = config.startValue;
        const endValue = config.endValue;
        const currentEasingFunction = isYoyo ? yoyoEasingFunction : easingFunction;

        const easedT = currentEasingFunction(Math.min(currentWayAliveTime / oneWayDuration, 1))
        config.onUpdate(tweenEntity, lerp(startValue, endValue, easedT));
      }

      if (intraLoopTime - delta < 0 && loop !== 0) {
        config.onLoop?.(tweenEntity);
      }


      if (aliveTime >= config.duration + completeDelay) {
        configManager.remove(TweenComponent.tweenConfigIndex[tweenEntity]);
        config.onComplete?.(tweenEntity);
        removeComponent(world, TweenComponent, tweenEntity, true);
      }
    }

    return world;
  }
}
