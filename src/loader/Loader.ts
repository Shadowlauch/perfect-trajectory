import {Loader, Resource, Texture} from 'pixi.js';
import {SpriteConfig} from './SpriteConfig';

const sprites: SpriteConfig[] = [
  new SpriteConfig('bullet01','/sprites/bullets/01.png', 67, 60),
  new SpriteConfig('red01','/sprites/bullets/test/red.png', 25, 16),
  new SpriteConfig('white01','/sprites/bullets/test/white.png', 25, 16),
  new SpriteConfig('needle01','/sprites/bullets/test/needle.png', 27, 16),
  new SpriteConfig('bullet02','/sprites/bullets/02.png', 67, 60),
  new SpriteConfig('bullet03','/sprites/bullets/03.png', 67, 60),
  new SpriteConfig('bullet26','/sprites/bullets/26.png', 162, 43),
  new SpriteConfig('background1','/sprites/backgrounds/1.png'),
  new SpriteConfig('player-test','/sprites/characters/$silverstar.png', 133, 156),
  new SpriteConfig('enemy-test','/sprites/characters/redgirl.png', 82, 200),
];

class SpriteLoader {
  #sprites: Map<string, SpriteConfig> = new Map();
  #keyToIndex: Map<string, number> = new Map();
  #indexToKey: Map<number, string> = new Map();
  #currentIndex = 0;

  loader: Loader;

  constructor() {
    this.loader = new Loader();
  }

  add(sprite: SpriteConfig) {
    const index = this.#currentIndex++;
    this.#keyToIndex.set(sprite.key, index);
    this.#indexToKey.set(index, sprite.key);
    this.#sprites.set(sprite.key, sprite);
  }

  getResource(index: number): Texture<Resource>;
  getResource(key: string): Texture<Resource>;
  getResource(v: string | number) {
    const key: string = typeof v === "number" ? this.getKey(v) : v;

    return this.loader.resources[key].texture;
  }

  getConfig(index: number): SpriteConfig {
    const key = this.getKey(index);
    return this.#sprites.get(key)!;
  }

  getKey(index: number) {
    if (!this.#indexToKey.has(index)) throw new Error(`The sprite with index ${index} does not exist`);
    return this.#indexToKey.get(index)!;
  }

  getIndex(key: string) {
    if (!this.#keyToIndex.has(key)) throw new Error(`The sprite with key ${key} does not exist`);
    return this.#keyToIndex.get(key)!;
  }

  async load() {
    for (const [key, {url}] of this.#sprites) {
      this.loader.add(key, url)
    }

    return new Promise<Loader>(resolve => this.loader.load((loader) => resolve(loader)));
  }
}

export const spriteLoader = new SpriteLoader();
for (const sprite of sprites) {
  spriteLoader.add(sprite);
}
