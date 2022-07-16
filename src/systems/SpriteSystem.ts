import {defineQuery, enterQuery, exitQuery} from 'bitecs';
import {Position} from '../components/Position';
import {World} from '../main';
import {Container, Loader, Sprite} from 'pixi.js';
import {SPRITES} from '../loader/Loader';
import {SpriteComponent} from '../components/Sprite';

export const createSpriteSystem = (container: Container, loader: Loader) => {
  const spriteQuery = defineQuery([Position, SpriteComponent]);
  const enterSpriteQuery = enterQuery(spriteQuery);
  const exitSpriteQuery = exitQuery(spriteQuery);
  const spriteMap: Record<number, Sprite> = {};

  return (world: World) => {
    for (const eid of enterSpriteQuery(world)) {
      const spriteConfig = SPRITES[SpriteComponent.spriteIndex[eid]];
      const sprite = new Sprite(loader.resources[spriteConfig.key].texture);
      sprite.scale = {x: 0.5, y: 0.5};
      container.addChild(sprite);
      spriteMap[eid] = sprite;
    }

    for (const eid of spriteQuery(world)) {
      const spriteConfig = SPRITES[SpriteComponent.spriteIndex[eid]];
      const graphics = spriteMap[eid];
      graphics.x = Position.x[eid] - spriteConfig.offsetX * 0.5;
      graphics.y = Position.y[eid] - spriteConfig.offsetY * 0.5;
    }

    for (const eid of exitSpriteQuery(world)) {
      const graphics = spriteMap[eid];
      graphics.destroy();
      delete spriteMap[eid];
    }

    return world;
  }
}
