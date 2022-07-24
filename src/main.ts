import {Application, Container, Graphics, Sprite} from 'pixi.js';
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
import {createCollisionDebugSystem} from './systems/CollisionDebugSystem';
import {createBulletCleanUpSystem} from './systems/BulletCleanUpSystem';
import {createMediaRecorder} from './utils/recordVideo';
import {createBulletSpawnSystem} from './systems/BulletSpawnSystem';
import {createPlayerShootSystem} from './systems/PlayerShootSystem';
import {StageComponent} from './components/Stage';
import {createPathMovementSystem} from './systems/PathMovementSystem';
import {entitySpawnerSystem} from './systems/EntitySpawnerSystem';
import {createTimelineSystem} from './systems/TimelineSystem';
import {TimelineComponent} from './components/Timeline';
import {configManager} from './configs/ConfigManager';
import {Stage0, Timeline} from './configs/stages/Stage0';
import {createEnemyDeSpawnSystem} from './systems/EnemyDespawnSystem';
import {createBossHpUiSystem} from './systems/ui/BossHpUiSystem';
import {createInfoBoxSystem} from './systems/ui/InfoboxSystem';
import {createTimeScoreSystem} from './systems/TimeScoreSystem';
import {AdvancedBloomFilter} from 'pixi-filters';
import {referenceTransformSystem} from './systems/ReferenceTransformSystem';


export interface World extends IWorld {
  time: {
    delta: number;
    elapsed: number;
    then: number;
  };
  input: { down: (key: typeof KeyboardEvent.prototype['key']) => boolean };
  size: {
    width: number;
    height: number;
  };
}

// Used by entity spawner to fetch pre-defined entities to spawn
export interface EntityPrefabWorld extends IWorld {
}

const size = {width: 1280, height: 800};
const gameSize = {width: 640, height: 760, padding: 20};
const app = new Application({
  ...size,
  powerPreference: 'high-performance'
});
document.body.appendChild(app.view);
const mediaRecorder = createMediaRecorder(app);

const loader = await loadSpirtes();

let border = new Graphics();
border.lineStyle(2, 0xffffff);
border.drawRect(gameSize.padding, gameSize.padding, gameSize.width, gameSize.height);
app.stage.addChild(border);

const gameContainer = new Container();
gameContainer.filters = [new AdvancedBloomFilter()];
gameContainer.x = gameSize.padding;
gameContainer.y = gameSize.padding;
gameContainer.interactive = false;
gameContainer.interactiveChildren = false;
gameContainer.sortableChildren = true;
let mask = new Graphics();
mask.beginFill(0xffffff);
mask.drawRect(gameSize.padding, gameSize.padding, gameSize.width, gameSize.height);
mask.endFill();
gameContainer.mask = mask;
app.stage.addChild(gameContainer);
const background = new Sprite(loader.resources['background1'].texture);
gameContainer.addChild(background);

const gameUiContainer = new Container();
gameUiContainer.interactive = false;
gameUiContainer.interactiveChildren = false;
gameUiContainer.zIndex = 100;
gameContainer.addChild(gameUiContainer);

const infoBoxContainer = new Container();
infoBoxContainer.x = gameSize.padding * 2 + gameSize.width;
app.stage.addChild(infoBoxContainer);
const world = createWorld() as World;
world.time = {delta: 0, elapsed: 0, then: performance.now()};
world.input = {down: () => false};
world.size = gameSize;

//Todo: Exporting this for now as a workaround should probably be changed?!
export const entityPrefabWorld = createWorld() as EntityPrefabWorld;

const pipeline = pipe(
  createPlayerMovementSystem(),
  //createEnemySpawnSystem(),
  createEnemyDeSpawnSystem(),
  createKeyboardSystem(world),
  createTimelineSystem(),
  createPlayerMovementSystem(),
  createPlayerShootSystem(),
  createPathMovementSystem(),
  entitySpawnerSystem(entityPrefabWorld),

  // Movement and reference transform must happen in this order
  // Don't touch position/movement after this.
  // Do all positional modifying stuff before this.
  // ===========================
  createMovementSystem(),
  referenceTransformSystem(),
  // ===========================

  createBulletSpawnSystem(),
  createBulletCleanUpSystem(),
  createPlayerBoundarySystem(),
  createCollisionSystem(),
  createTimeScoreSystem(),
  createTimeScoreSystem(),
  createBossHpUiSystem(gameUiContainer),
  createGraphicsCircleSystem(gameContainer),
  createSpriteSystem(gameContainer, loader),
  //createCollisionDebugSystem(container),
  createShowFpsSystem(app),
  createTimeSystem(app.ticker),
  //testSystem(world, entityPrefabWorld),
  createInfoBoxSystem(infoBoxContainer, size.width - gameSize.width - gameSize.padding * 2)
);

createPlayerEntity(world);
const stage = addEntity(world);
addComponent(world, StageComponent, stage);
StageComponent.stageIndex[stage] = 0;
addComponent(world, TimelineComponent, stage);
TimelineComponent.configIndex[stage] = configManager.add<Timeline>(Stage0);

document.addEventListener('keydown', (e) => {
  if (e.key === 'p') {
    if (app.ticker.started) app.ticker.stop();
    else app.ticker.start();
  } else if (e.key === 'r') {
    if (mediaRecorder.state === 'recording') mediaRecorder.stop();
    else mediaRecorder.start();
  }
});

// some sample script to stick somewhere else eventually


// Add a ticker callback to move the sprite back and forth
app.ticker.add(() => {
  pipeline(world, entityPrefabWorld);
});




