import {addComponent, addEntity, defineQuery, removeComponent, removeEntity} from 'bitecs';
import {Transform} from '../../components/Transform';
import {AngularSpeed, Speed, Velocity} from '../../components/Physics';
import {EnemyComponent} from '../../components/EnemyComponent';
import {CollisionComponent} from '../../components/Collision';
import {GraphicsCircle} from '../../components/GraphicsCircle';
import {configManager} from '../ConfigManager';
import {TimelineComponent} from '../../components/Timeline';
import {entityPrefabWorld, World} from '../../main';
import {EntitySpawner} from '../../components/EntitySpawner';
import {SpriteComponent} from '../../components/Sprite';
import {BulletComponent} from '../../components/Bullet';
import {PathComponent} from '../../components/Path';
import {PathPoint} from '../enemies/EnemyConfig';
import {AttachmentComponent} from '../../components/Attachment';
import {BulletSpawnComponent} from '../../components/BulletSpawn';
import {BulletSpawnConfig} from '../bullets/spawn/BulletSpawnConfig';
import {createArcBurst} from '../bullets/spawn/burst/Arc';
import {PlayerComponent} from '../../components/PlayerComponent';
import {createPlayerTargetLoop} from '../bullets/spawn/loop/PlayerTarget';
import { Timeline } from './Stage0';
import { createSprayBurst } from '../bullets/spawn/burst/Spray';
import { addExplosionTimer } from '../bullets/spawn/spawn/ExplosionTimer';
import { createSingleBurst } from '../bullets/spawn/burst/Single';


const enemyQuery = defineQuery([EnemyComponent]);
const playerQuery = defineQuery([PlayerComponent]);


const shootTrident = (world: World, eid: number) => {
  const player = playerQuery(world)[0]

  addComponent(world, BulletSpawnComponent, eid);
  const targetX = Transform.globalPosition.x[player];
  const targetY = Transform.globalPosition.y[player];

  const distanceX = targetX - Transform.globalPosition.x[eid];
  const distanceY = targetY - Transform.globalPosition.y[eid];

  Transform.rotation[eid] = Math.atan2(distanceY, distanceX);
  BulletSpawnComponent.startTime[eid] = world.time.elapsed;
  BulletSpawnComponent.configIndex[eid] = configManager.add<BulletSpawnConfig>({
    loop: 3,
    burstCount: 3,
    burstDelay: 200,
    loopDelay: 800,
    onLoop: createPlayerTargetLoop(player),
    onBurst: createArcBurst(3, 40)
  })  
}


const shootSpray = (world: World, eid: number) => {

  const player = playerQuery(world)[0]

  addComponent(world, BulletSpawnComponent, eid);
  BulletSpawnComponent.startTime[eid] = world.time.elapsed;
  BulletSpawnComponent.configIndex[eid] = configManager.add<BulletSpawnConfig>({
    loop: 3,
    burstCount: 3*6+1,
    burstDelay: 50,
    loopDelay: 1000,
    onLoop: createPlayerTargetLoop(player),
    onBurst: createSprayBurst(6, 30)
  })
}


const shootPyro = (world: World, eid: number) => {

  const player = playerQuery(world)[0]

  addComponent(world, BulletSpawnComponent, eid);
  const targetX = Transform.globalPosition.x[player];
  const targetY = Transform.globalPosition.y[player];

  const distanceX = targetX - Transform.globalPosition.x[eid];
  const distanceY = targetY - Transform.globalPosition.y[eid];

  Transform.rotation[eid] = Math.atan2(distanceY, distanceX);


  BulletSpawnComponent.startTime[eid] = world.time.elapsed;
  BulletSpawnComponent.configIndex[eid] = configManager.add<BulletSpawnConfig>({
    loop: 2,
    burstCount: 1,
    burstDelay: 50,
    loopDelay: 1000,
    onLoop: createPlayerTargetLoop(player),
    onBurst: createSingleBurst(),
    onSpawn: addExplosionTimer(3000, 20)
  })
}





const updatePathLine = (world: World, eid: number, x: number, y: number, delay: number) => {
  PathComponent.starTime[eid] = world.time.elapsed;
  PathComponent.startX[eid] = Transform.position.x[eid];
  PathComponent.startY[eid] = Transform.position.y[eid];
  PathComponent.configIndex[eid] = configManager.add<PathPoint[]>([{
    x: x,
    y: y,
    delay: delay
  }])
}


const addTrident = (world: World, initX: number, initY: number, moveRight:boolean=true) => {
  const eid = addEntity(world);
  const [x, y] = [initX, initY];

  const sideMovementSign = moveRight?1:-1;

  addComponent(world, Transform, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, EnemyComponent, eid);
  addComponent(world, CollisionComponent, eid);
  CollisionComponent.filter[eid] = 0b000010;
  Transform.position.x[eid] = x;
  Transform.position.y[eid] = y;

  EnemyComponent.spawnTime[eid] = world.time.elapsed;
  EnemyComponent.hp[eid] = 10;
  CollisionComponent.radius[eid] = 8;

  addComponent(world, GraphicsCircle, eid);
  GraphicsCircle.color[eid] = 0x00ff00;
  GraphicsCircle.radius[eid] = 10;

  addComponent(world, PathComponent, eid);
  PathComponent.starTime[eid] = world.time.elapsed;
  PathComponent.startX[eid] = x;
  PathComponent.startY[eid] = y;

  addComponent(world, TimelineComponent, eid);
  
  TimelineComponent.configIndex[eid] = configManager.add<Timeline>([
    {
      delay: 0,
      onTime: () => {
        updatePathLine(world, eid, 0, 200, 1000)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        shootTrident(world, eid)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        updatePathLine(world, eid, 100*sideMovementSign, 0, 1000)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        shootTrident(world, eid)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        updatePathLine(world, eid, 0, -300, 5000)
      }
    },
    {
      delay: 5000,
      onTime: ()=> {
        removeEntity(world, eid)
      }
    }
  ])
}



const addSprayer = (world: World, initX: number, initY: number, moveRight:boolean=true) => {
  const eid = addEntity(world);
  const [x, y] = [initX, initY];

  const sideMovementSign = moveRight?1:-1;

  addComponent(world, Transform, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, EnemyComponent, eid);
  addComponent(world, CollisionComponent, eid);
  CollisionComponent.filter[eid] = 0b000010;
  Transform.position.x[eid] = x;
  Transform.position.y[eid] = y;

  EnemyComponent.spawnTime[eid] = world.time.elapsed;
  EnemyComponent.hp[eid] = 10;
  CollisionComponent.radius[eid] = 8;

  addComponent(world, GraphicsCircle, eid);
  GraphicsCircle.color[eid] = 0x5500aa;
  GraphicsCircle.radius[eid] = 12;

  addComponent(world, PathComponent, eid);
  PathComponent.starTime[eid] = world.time.elapsed;
  PathComponent.startX[eid] = x;
  PathComponent.startY[eid] = y;

  addComponent(world, TimelineComponent, eid);
  TimelineComponent.configIndex[eid] = configManager.add<Timeline>([
    {
      delay: 0,
      onTime: () => {
        updatePathLine(world, eid, 0, 200, 1000)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        shootSpray(world, eid)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        updatePathLine(world, eid, 100*sideMovementSign, 0, 1000)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        shootSpray(world, eid)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        updatePathLine(world, eid, 0, -300, 5000)
      }
    },
    {
      delay: 5000,
      onTime: ()=> {
        removeEntity(world, eid)
      }
    }
  ])

}


const addPyro = (world: World, initX: number, initY: number, moveRight:boolean=true) => {
  const eid = addEntity(world);
  const [x, y] = [initX, initY];

  const sideMovementSign = moveRight?1:-1;

  addComponent(world, Transform, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, EnemyComponent, eid);
  addComponent(world, CollisionComponent, eid);
  CollisionComponent.filter[eid] = 0b000010;
  Transform.position.x[eid] = x;
  Transform.position.y[eid] = y;

  EnemyComponent.spawnTime[eid] = world.time.elapsed;
  EnemyComponent.hp[eid] = 10;
  CollisionComponent.radius[eid] = 8;

  addComponent(world, GraphicsCircle, eid);
  GraphicsCircle.color[eid] = 0xaaaa22;
  GraphicsCircle.radius[eid] = 20;

  addComponent(world, PathComponent, eid);
  PathComponent.starTime[eid] = world.time.elapsed;
  PathComponent.startX[eid] = x;
  PathComponent.startY[eid] = y;

  addComponent(world, TimelineComponent, eid);
  TimelineComponent.configIndex[eid] = configManager.add<Timeline>([
    {
      delay: 0,
      onTime: () => {
        updatePathLine(world, eid, 0, 200, 1000)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        shootPyro(world, eid)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        updatePathLine(world, eid, 100*sideMovementSign, 0, 1000)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        shootPyro(world, eid)
      }
    },
    {
      delay: 1000,
      onTime: () => {
        updatePathLine(world, eid, 0, -300, 5000)
      }
    },
    {
      delay: 5000,
      onTime: ()=> {
        removeEntity(world, eid)
      }
    }
  ])
}



export const Stage1: Timeline = [
  {
    delay: 1000,
    onTime: (world) => {
      addPyro(world, 100, 100);
      // addTrident(world, 440, 50, false);
      // addTrident(world, 240, 0);

    }
  },
  {
    delay: 6000,
    onTime: (world) => {
      // addTrident(world, 140, 0);
      // addTrident(world, 400, 0);
      // addTrident(world, 200, 0, false);

    }
  },
  {
    delay: 6000,
    onTime: (world) => {
      // addTrident(world, 140, 0);
      // addTrident(world, 400, 0);
      // addTrident(world, 200, 0);

    }
  },
  {
    delay: 2000,
    onTime: (world) => {
      // addSprayer(world, 100, 0);
      // addSprayer(world, 250, 0);
      // addSprayer(world, 400, 0);

    }
  },
  {
    delay: 6000,
    onTime: (world) => {
      // addPyro(world, 100, 0);

    }
  }
];
