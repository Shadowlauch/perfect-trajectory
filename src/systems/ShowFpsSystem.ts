import {World} from '../main';
import {Application, Text} from 'pixi.js';

export const createShowFpsSystem = (app: Application) => {
  const fpsText = new Text("test", {fill: 0xffffff});
  fpsText.x = 30;
  fpsText.y = 30;
  app.stage.addChild(fpsText);
  let i = 0;
  const fpsBuffer: number[] = [];

  return (world: World) => {
    fpsBuffer[i++ % 200] = app.ticker.FPS;
    const sum = fpsBuffer.reduce((c, v) => c + v, 0);
    fpsText.text = (sum / fpsBuffer.length).toFixed(0);

    return world;
  }
}
