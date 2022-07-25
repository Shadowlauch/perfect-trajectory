import {Resource, Texture} from 'pixi.js';

export interface SpriteLoadConfig {
  key: string;
  url: string;
  offsetX?: number;
  offsetY?: number;
}

export interface SpriteConfig extends Omit<Required<SpriteLoadConfig>, 'url'> {
  texture?: Texture<Resource>;
}

export interface AnimationFrameConfig {
  key: string;
  texture: Texture<Resource>;
  duration: number;
}

export interface AnimationSpriteConfig extends SpriteConfig {
  frames: AnimationFrameConfig[];
}
