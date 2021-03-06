import {World} from '../main';

export const createKeyboardSystem = (world: World) => {
  const pressedKeys: Set<typeof KeyboardEvent.prototype["key"]> = new Set();
  document.addEventListener("keydown", (e) => {
    pressedKeys.add(e.key.toLowerCase());
    if (!e.key.match(/F[0-9]+/)) e.preventDefault();
  });

  document.addEventListener("keyup", (e) => {
    pressedKeys.delete(e.key.toLowerCase());
    e.preventDefault();
  });

  document.addEventListener("contextmenu", () => {
    pressedKeys.clear();
  })

  world.input.down = (key: typeof KeyboardEvent.prototype["key"]) => pressedKeys.has(key);
  return (world: World) => {
    return world;
  }
}
