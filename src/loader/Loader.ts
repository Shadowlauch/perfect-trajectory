import {Loader} from 'pixi.js';

export interface SpriteConfig {
  key: string,
  url: string
}

export const SPRITES = [
  {
    key: 'bullet01',
    url: '/sprites/bullets/01.png'
  }
];



export const loadSpirtes = async () => {
  const loader = new Loader();
  for (const sprite of SPRITES) {
    loader.add(sprite.key, sprite.url)
  }

  return new Promise<Loader>(resolve => loader.load((loader) => resolve(loader)));
}
