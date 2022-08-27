import {World} from '../main';
import {defineQuery, enterQuery, exitQuery, removeComponent} from 'bitecs';
import {TweenComponent, TweenConfig} from '../components/TweenComponent';
import {configManager} from '../configs/ConfigManager';
import {lerp} from '../utils/math';


export const createTweenSystem = () => {
  const tweenQuery = defineQuery([TweenComponent]);
  const enterTweenQuery = enterQuery(tweenQuery);
  const exitTweenQuery = exitQuery(tweenQuery);

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
        config.onComplete?.(tweenEntity);
        removeComponent(world, TweenComponent, tweenEntity, false);
      }
    }

    for (const entity of exitTweenQuery(world)) {
      configManager.remove(TweenComponent.tweenConfigIndex[entity]);
    }

    return world;
  }
}
