import {defineQuery, enterQuery, exitQuery} from 'bitecs';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';
import {Container} from 'pixi.js';
import {spriteLoader} from '../loader/Loader';
import {SpriteComponent} from '../components/SpriteComponent';
import {SpriteH} from 'pixi-heaven';

export const createSpriteSystem = (container: Container) => {
  const spriteQuery = defineQuery([TransformComponent, SpriteComponent]);
  const enterSpriteQuery = enterQuery(spriteQuery);
  const exitSpriteQuery = exitQuery(spriteQuery);
  const spriteMap: Record<number, SpriteH> = {};

  return (world: World) => {
    for (const eid of enterSpriteQuery(world)) {
      const spriteConfig = spriteLoader.getConfig(SpriteComponent.spriteIndex[eid]);
      const sprite = new SpriteH(spriteConfig.texture);
      const scale = SpriteComponent.scale[eid] ?? 1;
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
      sprite.zIndex = SpriteComponent.zIndex[eid];
      sprite.color.darkR = SpriteComponent.darkR[eid];
      sprite.color.darkG = SpriteComponent.darkG[eid];
      sprite.color.darkB = SpriteComponent.darkB[eid];
      sprite.alpha = SpriteComponent.alpha[eid];
    }

    for (const eid of exitSpriteQuery(world)) {
      const graphics = spriteMap[eid];
      graphics.destroy();
      delete spriteMap[eid];
    }

    return world;
  }
}
