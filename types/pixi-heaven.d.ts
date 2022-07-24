/// <reference path="./global.d.ts" />

import { BitmapText } from '@pixi/text-bitmap';
import { Buffer as Buffer_2 } from '@pixi/core';
import { Container } from '@pixi/display';
import { DisplayObject } from '@pixi/display';
import { Geometry } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { Mesh } from '@pixi/mesh';
import { Program } from '@pixi/core';
import { Renderer } from '@pixi/core';
import { Shader } from '@pixi/core';
import { SimpleMesh } from '@pixi/mesh-extras';
import { Sprite } from '@pixi/sprite';
import { Sprite as Sprite_2 } from '@pixi/sprite';
import { State } from '@pixi/core';
import { Texture } from '@pixi/core';
import { TextureMatrix } from '@pixi/core';
import { UniformGroup } from '@pixi/core';

export declare class AnimationState {
  texture: Texture;
  _textures: Array<Texture>;
  _durations: Array<number>;
  _autoUpdate: boolean;
  animationSpeed: number;
  _target: ITextureAnimationTarget;
  loop: boolean;
  onComplete?: () => void;
  onFrameChange?: (currentFrame: number) => void;
  onLoop?: () => void;
  _currentTime: number;
  playing: boolean;
  constructor(textures: Array<Texture> | Array<IFrameObject>, autoUpdate?: boolean);
  stop(): void;
  play(): void;
  gotoAndStop(frameNumber: number): void;
  gotoAndPlay(frameNumber: number): void;
  update(deltaTime: number): void;
  updateTexture(): void;
  bind(target: ITextureAnimationTarget): void;
  static fromFrames(frames: Array<string>): AnimationState;
  static fromImages(images: Array<string>): AnimationState;
  get totalFrames(): number;
  get textures(): Texture[] | IFrameObject[];
  set textures(value: Texture[] | IFrameObject[]);
  get currentFrame(): number;
}

export declare function applyConvertMixins(): void;

export declare function applySpineMixin(spineClassPrototype: ISpineClass): void;

export declare function applySpritesheetMixin(): void;

export declare class BitmapTextH extends BitmapText {
  constructor(text: string, style?: any);
  color: ColorTransform;
  get tint(): number;
  set tint(value: number);
  addChild(...additionalChildren: DisplayObject[]): any;
  _render(renderer: Renderer): void;
}

export declare enum CLAMP_OPTIONS {
  NEVER = 0,
  AUTO = 1,
  ALWAYS = 2
}

export declare class ColorTransform {
  dark: Float32Array;
  light: Float32Array;
  _updateID: number;
  _currentUpdateID: number;
  darkRgba: number;
  lightRgba: number;
  hasNoTint: boolean;
  get darkR(): number;
  set darkR(value: number);
  get darkG(): number;
  set darkG(value: number);
  get darkB(): number;
  set darkB(value: number);
  get lightR(): number;
  set lightR(value: number);
  get lightG(): number;
  set lightG(value: number);
  get lightB(): number;
  set lightB(value: number);
  get alpha(): number;
  set alpha(value: number);
  get pma(): boolean;
  set pma(value: boolean);
  get tintBGR(): number;
  set tintBGR(value: number);
  setLight(R: number, G: number, B: number): void;
  setDark(R: number, G: number, B: number): void;
  clear(): void;
  invalidate(): void;
  updateTransformLocal(): void;
  updateTransform(): void;
}

export declare class DarkLightGeometry extends Geometry {
  _buffer: Buffer_2;
  _indexBuffer: Buffer_2;
  constructor(_static?: boolean);
}

export declare class DarkLightPluginFactory {
  static create(options: any): any;
}

export declare class DoubleTintMeshMaterial extends Shader {
  uvMatrix: TextureMatrix;
  batchable: boolean;
  readonly allowTrim: boolean;
  pluginName: string;
  color: ColorTransform;
  _colorId: number;
  constructor(uSampler: Texture, options?: any);
  get texture(): any;
  set texture(value: any);
  set alpha(value: number);
  get alpha(): number;
  set tint(value: number);
  get tint(): number;
  update(): void;
}

export declare interface IFrameObject {
  texture: Texture;
  time: number;
}

export declare interface ILoopDescriptor {
  loopLabel: string;
  inTex: string;
  inCoord: string;
  outColor: string;
}

export declare interface ISettings {
  MESH_CLAMP: CLAMP_OPTIONS;
  BLEND_ADD_UNITY: boolean;
}

export declare interface ISpineClass {
  newContainer(): Container;
  newSprite(tex: Texture): Sprite_2;
  newGraphics(): Graphics;
  newMesh(texture: Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number): SimpleMesh;
  transformHack(): number;
}

export declare interface ITextureAnimationTarget {
  texture: Texture;
  animState: AnimationState;
}

export declare class LoopShaderGenerator {
  vertexSrc: string;
  fragTemplate: string;
  loops: Array<ILoopDescriptor>;
  programCache: {
    [key: number]: Program;
  };
  defaultGroupCache: {
    [key: number]: UniformGroup;
  };
  constructor(vertexSrc: string, fragTemplate: string, loops: Array<ILoopDescriptor>);
  generateShader(maxTextures: number): Shader;
  generateSampleSrc(maxTextures: number, loop: ILoopDescriptor): string;
}

export declare class MaskedGeometry extends Geometry {
  _buffer: Buffer_2;
  _indexBuffer: Buffer_2;
  constructor(_static?: boolean);
}

export declare class MaskedPluginFactory {
  static MAX_TEXTURES: number;
  static create(options: any): any;
}

export declare class MeshH extends Mesh {
  color: ColorTransform;
  maskSprite: SpriteH;
  useSpriteMask: boolean;
  constructor(geometry: Geometry, shader: DoubleTintMeshMaterial, state: State, drawMode?: number);
  _renderDefault(renderer: Renderer): void;
  _render(renderer: Renderer): void;
  _renderToBatch(renderer: Renderer): void;
}

export declare const settings: ISettings;

export declare class SimpleMeshH extends MeshH {
  constructor(texture: Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number);
  autoUpdate: boolean;
  get vertices(): Float32Array;
  set vertices(value: Float32Array);
  _render(renderer: Renderer): void;
}

export declare class SpineMesh extends SimpleMeshH {
  spine: Container;
  constructor(texture: Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number, spine?: Container);
  _render(renderer: Renderer): void;
}

export declare class SpineSprite extends SpriteH {
  spine: Container;
  constructor(tex: Texture, spine: Container);
  _render(renderer: Renderer): void;
}

export declare class SpriteH extends Sprite implements ITextureAnimationTarget {
  color: ColorTransform;
  maskSprite: SpriteH;
  maskVertexData: Float32Array;
  uvs: Float32Array;
  indices: Uint16Array;
  animState: AnimationState;
  blendAddUnity: boolean;
  constructor(texture: Texture);
  get _tintRGB(): number;
  set _tintRGB(value: number);
  get tint(): number;
  set tint(value: number);
  _onTextureUpdate(): void;
  _render(renderer: Renderer): void;
  _calculateBounds(): void;
  calculateVertices(): void;
  calculateMaskVertices(): void;
  destroy(options?: any): void;
}

export declare class TexturePolygon {
  vertices: ArrayLike<number>;
  uvs: ArrayLike<number>;
  indices: ArrayLike<number>;
  constructor(vertices: ArrayLike<number>, uvs: ArrayLike<number>, indices: ArrayLike<number>);
}

export { }
