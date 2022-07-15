import {World} from '../main';
import {Application, Text} from 'pixi.js';

export const createShowFpsSystem = (app: Application) => {
  const fpsText = new Text("test", {fill: 0xffffff});
  app.stage.addChild(fpsText);


  return (world: World) => {
    fpsText.text = app.ticker.FPS.toFixed(0);

    return world;
  }
}
