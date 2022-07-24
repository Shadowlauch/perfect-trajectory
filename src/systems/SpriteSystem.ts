import {defineQuery, enterQuery, exitQuery} from 'bitecs';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {Container, Loader, Sprite} from 'pixi.js';
import {SPRITES} from '../loader/Loader';
import {SpriteComponent} from '../components/Sprite';

export const createSpriteSystem = (container: Container, loader: Loader) => {
  const spriteQuery = defineQuery([Transform, SpriteComponent]);
  const enterSpriteQuery = enterQuery(spriteQuery);
  const exitSpriteQuery = exitQuery(spriteQuery);
  const spriteMap: Record<number, Sprite> = {};

  return (world: World) => {
    for (const eid of enterSpriteQuery(world)) {
      const spriteConfig = SPRITES[SpriteComponent.spriteIndex[eid]];
      const sprite = new Sprite(loader.resources[spriteConfig.key].texture);
      const scale = SpriteComponent.scale[eid] ?? 1;
      sprite.scale = {x: scale, y: scale};
      sprite.anchor.x = spriteConfig.offsetX / sprite.width * scale;
      sprite.anchor.y = spriteConfig.offsetY / sprite.height * scale;
      container.addChild(sprite);
      spriteMap[eid] = sprite;
    }

    for (const eid of spriteQuery(world)) {
      const sprite = spriteMap[eid];
      sprite.x = Transform.finalPosition.x[eid];
      sprite.y = Transform.finalPosition.y[eid];
      sprite.rotation = Transform.finalRotation[eid];
      // if (hasComponent(world, Velocity, eid)) {
      //   //TODO: This needs to be its own thing I'm just lazy rn
      //   sprite.rotation = Math.atan2(Velocity.y[eid], Velocity.x[eid]);
      // }
    }

    for (const eid of exitSpriteQuery(world)) {
      const graphics = spriteMap[eid];
      graphics.destroy();
      delete spriteMap[eid];
    }

    return world;
  }
}
