import {addComponent, defineComponent, Types} from 'bitecs';
import {World} from '../main';
import {configManager} from '../configs/ConfigManager';

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

export const TweenComponent = defineComponent({startTime: Types.ui32, tweenConfigIndex: Types.ui32});

export const addTweenComponent = (world: World, entity: number, config: TweenConfig) => {
  addComponent(world, TweenComponent, entity);
  TweenComponent.tweenConfigIndex[entity] = configManager.add(config);
  TweenComponent.startTime[entity] = world.time.elapsed;
}
