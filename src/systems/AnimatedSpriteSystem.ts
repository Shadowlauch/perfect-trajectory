import {defineQuery, enterQuery, exitQuery, removeComponent} from 'bitecs';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';
import {Container} from 'pixi.js';
import {spriteLoader} from '../loader/Loader';
import {AnimatedSpriteComponent} from '../components/SpriteComponent';
import {SpriteH} from 'pixi-heaven';

export const createAnimatedSpriteSystem = (container: Container) => {
  const spriteQuery = defineQuery([TransformComponent, AnimatedSpriteComponent]);
  const enterSpriteQuery = enterQuery(spriteQuery);
  const exitSpriteQuery = exitQuery(spriteQuery);
  const spriteMap: Record<number, SpriteH> = {};

  return (world: World) => {
    for (const eid of enterSpriteQuery(world)) {
      const spriteConfig = spriteLoader.getAnimationConfig(AnimatedSpriteComponent.spriteIndex[eid]);
      const sprite = new SpriteH(spriteConfig.frames[0].texture);
      const scale = AnimatedSpriteComponent.scale[eid] ?? 1;
      sprite.scale = {x: scale, y: scale};
      sprite.anchor.x = spriteConfig.offsetX / sprite.width * scale;
      sprite.anchor.y = spriteConfig.offsetY / sprite.height * scale;
      sprite.x = TransformComponent.globalPosition.x[eid];
      sprite.y = TransformComponent.globalPosition.y[eid];
      sprite.rotation = TransformComponent.globalRotation[eid];
      container.addChild(sprite);
      spriteMap[eid] = sprite;
    }

    for (const eid of spriteQuery(world)) {
      const sprite = spriteMap[eid];
      sprite.x = TransformComponent.globalPosition.x[eid];
      sprite.y = TransformComponent.globalPosition.y[eid];
      sprite.rotation = TransformComponent.globalRotation[eid];
      sprite.zIndex = AnimatedSpriteComponent.zIndex[eid];
      sprite.color.darkR = AnimatedSpriteComponent.darkR[eid];
      sprite.color.darkG = AnimatedSpriteComponent.darkG[eid];
      sprite.color.darkB = AnimatedSpriteComponent.darkB[eid];

      const timeSinceReference = world.time.elapsed - AnimatedSpriteComponent.referenceTime[eid];
      const config = spriteLoader.getAnimationConfig(AnimatedSpriteComponent.spriteIndex[eid]);
      const frame = config.frames[AnimatedSpriteComponent.currentFrame[eid]];
      const currentFrameDuration = frame?.duration ?? 0;

      if (timeSinceReference >= currentFrameDuration) {
        if (config.frames.length > AnimatedSpriteComponent.currentFrame[eid] + 1) {
          AnimatedSpriteComponent.currentFrame[eid]++;
          AnimatedSpriteComponent.referenceTime[eid] = world.time.elapsed;
          sprite.texture = config.frames[AnimatedSpriteComponent.currentFrame[eid]].texture;
        }
        else {
          removeComponent(world, AnimatedSpriteComponent, eid);
        }
      }
    }

    for (const eid of exitSpriteQuery(world)) {
      const graphics = spriteMap[eid];
      graphics.destroy();
      delete spriteMap[eid];
    }

    return world;
  }
}
