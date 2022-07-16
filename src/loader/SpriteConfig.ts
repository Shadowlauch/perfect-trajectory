export class SpriteConfig {
  constructor(public key: string, public url: string, private _offsetX?: number, private _offsetY?: number) {
  }

  get offsetX() {
    return this._offsetX ?? 0;
  }

  set offsetX(value: number) {
    this._offsetX = value;
  }

  get offsetY() {
    return this._offsetY ?? 0;
  }

  set offsetY(value: number) {
    this._offsetX = value;
  }
}
