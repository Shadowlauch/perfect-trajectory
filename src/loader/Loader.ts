import {Loader} from 'pixi.js';
import {SpriteConfig} from './SpriteConfig';

export const SPRITES: SpriteConfig[] = [
  new SpriteConfig('bullet01','/sprites/bullets/01.png', 67, 60),
  new SpriteConfig('bullet02','/sprites/bullets/02.png', 67, 60),
  new SpriteConfig('bullet03','/sprites/bullets/03.png', 67, 60),
  new SpriteConfig('bullet26','/sprites/bullets/26.png', 162, 43),
  new SpriteConfig('background1','/sprites/backgrounds/1.png'),
];

export const loadSpirtes = async () => {
  const loader = new Loader();
  for (const sprite of SPRITES) {
    loader.add(sprite.key, sprite.url)
  }

  return new Promise<Loader>(resolve => loader.load((loader) => resolve(loader)));
}
