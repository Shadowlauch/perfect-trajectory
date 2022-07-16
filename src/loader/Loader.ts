import {Loader} from 'pixi.js';
import {SpriteConfig} from './SpriteConfig';

export const SPRITES: SpriteConfig[] = [
  new SpriteConfig('bullet01','/sprites/bullets/01.png', 67, 60)
];

export const loadSpirtes = async () => {
  const loader = new Loader();
  for (const sprite of SPRITES) {
    loader.add(sprite.key, sprite.url)
  }

  return new Promise<Loader>(resolve => loader.load((loader) => resolve(loader)));
}
