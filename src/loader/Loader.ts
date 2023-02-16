import {Assets, Spritesheet, Texture} from 'pixi.js';
import {AnimationSpriteConfig, SpriteConfig, SpriteLoadConfig} from './SpriteConfig';

const sprites: SpriteLoadConfig[] = [
  {key: 'bullet01', url: '/sprites/bullets/01.png', offsetX: 67, offsetY: 60},
  {key: 'red01', url: '/sprites/bullets/test/red.png', offsetX: 25, offsetY: 16},
  {key: 'white01', url: '/sprites/bullets/test/white.png', offsetX: 25, offsetY: 16},
  {key: 'needle01', url: '/sprites/bullets/test/needle.png', offsetX: 27, offsetY: 16},
  {key: 'bullet02', url: '/sprites/bullets/02.png', offsetX: 67, offsetY: 60},
  {key: 'bullet03', url: '/sprites/bullets/03.png', offsetX: 67, offsetY: 60},
  {key: 'bullet26', url: '/sprites/bullets/26.png', offsetX: 162, offsetY: 43},
  {key: 'background1', url: '/sprites/backgrounds/1.png'},
  {key: 'player-test', url: '/sprites/characters/$silverstar.png', offsetX: 133, offsetY: 156},
  {key: 'enemy-test', url: '/sprites/characters/redgirl.png', offsetX: 82, offsetY: 200},
  {key: 'explosion', url: '/sprites/effects/explosion.json', offsetX: 64, offsetY: 64},
  {key: 'characters.bullets.cards', url: '/sprites/characters/bullets/cards.json', offsetX: 16, offsetY: 16},
];

class SpriteLoader {
  #sprites: Map<string, SpriteConfig> = new Map();
  #keyToIndex: Map<string, number> = new Map();
  #indexToKey: Map<number, string> = new Map();
  #currentIndex = 0;
  #spritesToLoad: SpriteLoadConfig[] = [];


  constructor() {
  }

  add(sprite: SpriteLoadConfig) {
    this.#spritesToLoad.push(sprite);
  }

  getAnimationConfig(index: number): AnimationSpriteConfig;
  getAnimationConfig(key: string): AnimationSpriteConfig;
  getAnimationConfig(v: string | number) {
    const key: string = typeof v === 'number' ? this.getKey(v) : v;
    const animationConfig = this.#sprites.get(key) as AnimationSpriteConfig;
    if (!animationConfig.frames) throw new Error(`Sprite with key ${key} has no animations`);

    return animationConfig;
  }

  getConfig(index: number): Required<SpriteConfig> {
    const key = this.getKey(index);
    const config = this.#sprites.get(key)!;
    if (!config.texture) throw new Error(`The sprite with key ${key} is probably an animation`);
    return config as any;
  }

  getKey(index: number) {
    if (!this.#indexToKey.has(index)) throw new Error(`The sprite with index ${index} does not exist`);
    return this.#indexToKey.get(index)!;
  }

  getIndex(key: string) {
    if (!this.#keyToIndex.has(key)) throw new Error(`The sprite with key ${key} does not exist`);
    return this.#keyToIndex.get(key)!;
  }

  #addSprite(sprite: SpriteConfig) {
    const index = this.#currentIndex++;
    this.#keyToIndex.set(sprite.key, index);
    this.#indexToKey.set(index, sprite.key);
    this.#sprites.set(sprite.key, sprite);
  }

  async load() {
    const resources: [SpriteLoadConfig, any][] = await Promise.all(this.#spritesToLoad.map(async (l) => ([l, await Assets.load(l.url)])));

    for (const [sprite, resource] of resources) {
      if (resource instanceof Spritesheet) {
        const sheet = resource!;
        // @ts-ignore
        const tags = sheet.data.meta.frameTags as { name: string, from: number, to: number, direction: string }[];
        this.#addSprite({
          frames: Object.entries(sheet.textures).map(([key, frame]) => {
            return {
              texture: frame,
              key,
              // @ts-ignore
              duration: sheet.data.frames[key].duration ?? 0
            };
          }),
          key: sprite.key + ".base",
          offsetX: sprite.offsetX ?? 0,
          offsetY: sprite.offsetY ?? 0,
        } as AnimationSpriteConfig);

        for (const [key, texture] of Object.entries<Texture>(sheet.textures)) {
          console.log(texture.width, texture.height)
          this.#addSprite({
            texture,
            key: `${sprite.key}.frame.${key}`,
            offsetX: sprite.offsetX ?? 0,
            offsetY: sprite.offsetY ?? 0,
          } as SpriteConfig);
        }

        for (const tag of tags) {
          this.#addSprite({
            frames: Object.entries(sheet.textures).slice(tag.from, tag.to + 1).map(([key, frame]) => {
                return {
                  texture: frame,
                  key,
                  // @ts-ignore
                  duration: sheet.data.frames[key].duration ?? 0
                };
              }
            ),
            key: sprite.key + "." + tag.name,
            offsetX: sprite.offsetX ?? 0,
            offsetY: sprite.offsetY ?? 0,
          } as AnimationSpriteConfig);
        }
      } else {
        this.#addSprite({
          texture: resource,
          key: sprite.key,
          offsetX: sprite.offsetX ?? 0,
          offsetY: sprite.offsetY ?? 0,
        });
      }
    }

    this.#spritesToLoad = [];
  }
}

export const spriteLoader = new SpriteLoader();
for (const sprite of sprites) {
  spriteLoader.add(sprite);
}
