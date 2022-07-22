import {Application, Container} from 'pixi.js';
import './style.css';
import {addComponent, addEntity, createWorld, IWorld, pipe} from 'bitecs';
import {createMovementSystem} from './systems/MovementSystem';
import {createTimeSystem} from './systems/TimeSystem';
import {createGraphicsCircleSystem} from './systems/GraphicsCircleSystem';
import {createPlayerEntity} from './entities/Player';
import {createPlayerMovementSystem} from './systems/PlayerMovementSystem';
import {createPlayerBoundarySystem} from './systems/PlayerBoundarySystem';
import {createShowFpsSystem} from './systems/ShowFpsSystem';
import {loadSpirtes} from './loader/Loader';
import {createSpriteSystem} from './systems/SpriteSystem';
import {createKeyboardSystem} from './systems/KeyboardSystem';
import {createCollisionSystem} from './systems/CollisionSystem';
import {createBulletCleanUpSystem} from './systems/BulletCleanUpSystem';
import {createMediaRecorder} from './utils/recordVideo';
import {createBulletSpawnSystem} from './systems/BulletSpawnSystem';
import {createPlayerShootSystem} from './systems/PlayerShootSystem';
import {StageComponent} from './components/Stage';
import {createPathMovementSystem} from './systems/PathMovementSystem';
import { EntitySpawnerSystem } from './systems/EntitySpawnerSystem';
import {createTimelineSystem} from './systems/TimelineSystem';
import {TimelineComponent} from './components/Timeline';
import {configManager} from './configs/ConfigManager';
import {Stage0, Timeline} from './configs/stages/Stage0';
import {createAttachmentSystem} from './systems/AttachmentSystem';


export interface World extends IWorld {
  time: {
    delta: number;
    elapsed: number;
    then: number;
  };
  input: { down: (key: typeof KeyboardEvent.prototype["key"]) => boolean};
  size: {
    width: number;
    height: number;
  };
}

// Used by entity spawner to fetch pre-defined entities to spawn
export interface EntityPrefabWorld extends IWorld {}

const size = {width: 640, height: 800};
const app = new Application({
  ...size,
  antialias: false,
  powerPreference: 'high-performance'
});
document.body.appendChild(app.view);
const mediaRecorder = createMediaRecorder(app);

const container = new Container();
container.interactive = false;
container.interactiveChildren = false;
//container.filters = [new AdvancedBloomFilter()];
app.stage.addChild(container);

const loader = await loadSpirtes();

const world = createWorld() as World;
world.time = {delta: 0, elapsed: 0, then: performance.now()};
world.input = {down: () => false};
world.size = size;

export const entityPrefabWorld = createWorld() as EntityPrefabWorld;

const pipeline = pipe(
  createPlayerMovementSystem(),
  //createEnemySpawnSystem(),
  //createEnemyDeSpawnSystem(),
  createTimelineSystem(),
  createBulletSpawnSystem(),
  createMovementSystem(),
  createPathMovementSystem(),
  createPlayerBoundarySystem(),
  createAttachmentSystem(),
  createPlayerShootSystem(),
  createBulletCleanUpSystem(),
  createCollisionSystem(),
  createGraphicsCircleSystem(app),
  createSpriteSystem(container, loader),
  //createCollisionDebugSystem(container),
  createShowFpsSystem(app),
  createTimeSystem(app.ticker),
  createKeyboardSystem(world),
  //testSystem(world, entityPrefabWorld),
  EntitySpawnerSystem(entityPrefabWorld),
);

createPlayerEntity(world);
const stage = addEntity(world);
addComponent(world, StageComponent, stage);
StageComponent.stageIndex[stage] = 0;
addComponent(world, TimelineComponent, stage);
TimelineComponent.starTime[stage] = 0;
TimelineComponent.configIndex[stage] = configManager.add<Timeline>(Stage0);

document.addEventListener('keydown', (e) => {
  if (e.key === "p") {
    if (app.ticker.started) app.ticker.stop();
    else app.ticker.start();
  } else if (e.key === "r") {
    if (mediaRecorder.state === "recording") mediaRecorder.stop();
    else mediaRecorder.start();
  }
})

// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world, entityPrefabWorld);
});




