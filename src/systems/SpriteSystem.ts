import {defineQuery, enterQuery, exitQuery, hasComponent} from 'bitecs';
import {Position} from '../components/Position';
import {World} from '../main';
import {Container, Loader, Sprite} from 'pixi.js';
import {SPRITES} from '../loader/Loader';
import {SpriteComponent} from '../components/Sprite';
import {Velocity} from '../components/Velocity';

export const createSpriteSystem = (container: Container, loader: Loader) => {
  const spriteQuery = defineQuery([Position, SpriteComponent]);
  const enterSpriteQuery = enterQuery(spriteQuery);
  const exitSpriteQuery = exitQuery(spriteQuery);
  const spriteMap: Record<number, Sprite> = {};

  return (world: World) => {
    for (const eid of enterSpriteQuery(world)) {
      const spriteConfig = SPRITES[SpriteComponent.spriteIndex[eid]];
      const sprite = new Sprite(loader.resources[spriteConfig.key].texture);
      const scale = SpriteComponent.scale[eid] ?? 1;
      sprite.scale = {x: scale, y: scale};
      sprite.anchor.x = 1 - sprite.width / spriteConfig.offsetX * scale;
      sprite.anchor.y = 1 - sprite.height / spriteConfig.offsetY * scale;
      container.addChild(sprite);
      spriteMap[eid] = sprite;
    }

    for (const eid of spriteQuery(world)) {
      const sprite = spriteMap[eid];
      sprite.x = Position.x[eid];
      sprite.y = Position.y[eid];
      if (hasComponent(world, Velocity, eid)) {
        //TODO: This needs to be its own thing I'm just lazy rn
        sprite.rotation = Math.atan2(Velocity.y[eid], Velocity.x[eid]);
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
