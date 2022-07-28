import {addEntity, defineQuery, removeEntity} from 'bitecs';
import {addTransformComponent, TransformComponent} from '../../components/TransformComponent';
import {addVelocityComponent} from '../../components/Physics';
import {addEnemyComponent} from '../../components/EnemyComponent';
import {addCollisionComponent} from '../../components/CollisionComponent';
import {addGraphicsCircleComponent} from '../../components/GraphicsCircleComponent';
import {configManager} from '../ConfigManager';
import {addTimelineComponent, Timeline} from '../../components/TimelineComponent';
import {World} from '../../main';
import {PathComponent} from '../../components/PathComponent';
import {PathPoint} from '../enemies/EnemyConfig';
import {createArcBurst} from '../bullets/spawn/burst/Arc';
import {PlayerComponent} from '../../components/PlayerComponent';
import {createPlayerTargetLoop} from '../bullets/spawn/loop/PlayerTarget';
import {createSprayBurst} from '../bullets/spawn/burst/Spray';
import {addExplosionTimer} from '../bullets/spawn/spawn/ExplosionTimer';
import {createSingleBurst} from '../bullets/spawn/burst/Single';
import {congaPathPoints} from '../paths/CongaPath';
import {addBulletSpawnComponent} from '../../components/BulletSpawnComponent';
import {addPathComponent} from '../../components/PathComponent';

const playerQuery = defineQuery([PlayerComponent]);

const shootTrident = (world: World, eid: number) => {
  const player = playerQuery(world)[0]

  const targetX = TransformComponent.globalPosition.x[player];
  const targetY = TransformComponent.globalPosition.y[player];

  const distanceX = targetX - TransformComponent.globalPosition.x[eid];
  const distanceY = targetY - TransformComponent.globalPosition.y[eid];

  TransformComponent.rotation[eid] = Math.atan2(distanceY, distanceX);

  addBulletSpawnComponent(world, eid, {
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

  addBulletSpawnComponent(world, eid, {
    loop: 3,
    burstCount: 3 * 6 + 1,
    burstDelay: 50,
    loopDelay: 1000,
    onLoop: createPlayerTargetLoop(player),
    onBurst: createSprayBurst(6, 30)
  })
}


const shootPyro = (world: World, eid: number) => {

  const player = playerQuery(world)[0]

  const targetX = TransformComponent.globalPosition.x[player];
  const targetY = TransformComponent.globalPosition.y[player];

  const distanceX = targetX - TransformComponent.globalPosition.x[eid];
  const distanceY = targetY - TransformComponent.globalPosition.y[eid];

  TransformComponent.rotation[eid] = Math.atan2(distanceY, distanceX);

  addBulletSpawnComponent(world, eid, {
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
  PathComponent.startX[eid] = TransformComponent.position.x[eid];
  PathComponent.startY[eid] = TransformComponent.position.y[eid];
  PathComponent.speed[eid] = 1;

  // const path = configManager.get<PathPoint[]>(PathComponent.configIndex[eid]);
  // path.push({
  //     x: x,
  //     y: y,
  //     delay: delay
  //   }
  // )
  PathComponent.configIndex[eid] = configManager.add<PathPoint[]>([{
    x: x,
    y: y,
    delay: delay
  }])



  const path = configManager.get<PathPoint[]>(PathComponent.configIndex[eid]);

  console.log("path", path, eid)


  console.log("start ", PathComponent.starTime[eid])
  console.log("speed ", PathComponent.speed[eid])
  console.log("delay ", delay)

}


const addTrident = (world: World, initX: number, initY: number, moveRight: boolean = true) => {
  const eid = addEntity(world);
  const [x, y] = [initX, initY];

  const sideMovementSign = moveRight ? 1 : -1;

  addTransformComponent(world, eid, x, y);
  addVelocityComponent(world, eid);
  addEnemyComponent(world, eid, 10);
  addCollisionComponent(world, eid, 12, {filter: 0b000010})
  addGraphicsCircleComponent(world, eid, 10, 0x00ff00, 0) // 0 is zIndex, picked at random

  addPathComponent(world, eid, x, y, [], 1)

  const timeline = [
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
        updatePathLine(world, eid, 100 * sideMovementSign, 0, 1000)
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
      onTime: () => {
        removeEntity(world, eid)
      }
    }
  ] as Timeline

  addTimelineComponent(world, eid, timeline);
}


const addSprayer = (world: World, initX: number, initY: number, moveRight: boolean = true) => {
  const eid = addEntity(world);
  const [x, y] = [initX, initY];

  const sideMovementSign = moveRight ? 1 : -1;

  addTransformComponent(world, eid, x, y);
  addVelocityComponent(world, eid);
  addEnemyComponent(world, eid, 10);
  addCollisionComponent(world, eid, 15, {filter: 0b000010});
  addGraphicsCircleComponent(world, eid, 12, 0x5500aa, 0);

  addPathComponent(world, eid, x, y, [])

  const timeline = [
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
        updatePathLine(world, eid, 100 * sideMovementSign, 0, 1000)
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
      onTime: () => {
        removeEntity(world, eid)
      }
    }
  ] as Timeline;
  addTimelineComponent(world, eid, timeline);

}


const addPyro = (world: World, initX: number, initY: number, moveRight: boolean = true) => {
  const eid = addEntity(world);
  const [x, y] = [initX, initY];

  const sideMovementSign = moveRight ? 1 : -1;

  addTransformComponent(world, eid, x, y);
  addVelocityComponent(world, eid);
  addEnemyComponent(world, eid, 10);
  addCollisionComponent(world, eid, 25, {filter: 0b000010});
  addGraphicsCircleComponent(world, eid, 20, 0xaaaa22, 0);

  addPathComponent(world, eid, x, y, [])

  const timeline = [
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
        updatePathLine(world, eid, 100 * sideMovementSign, 0, 1000)
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
      onTime: () => {
        removeEntity(world, eid)
      }
    }
  ] as Timeline;

  addTimelineComponent(world, eid, timeline);
}


const addConga = (world: World, initX: number, initY: number) => {
  const eid = addEntity(world);
  const [x, y] = [initX, initY];

  addTransformComponent(world, eid, x, y);
  addVelocityComponent(world, eid);
  addEnemyComponent(world, eid, 5);
  addCollisionComponent(world, eid, 15, {filter: 0b000010});
  addGraphicsCircleComponent(world, eid, 15, 0xcc55cc, 0);

  addPathComponent(world, eid, x, y, congaPathPoints, 1.5)

  const timeline = [
    {
      delay: 1000,
      onTime: () => {
        shootPyro(world, eid)
      }
    },
    {
      delay: 5000,
      onTime: () => {
        removeEntity(world, eid)
      }
    }
  ] as Timeline

  addTimelineComponent(world, eid, timeline);
}


export const Stage1: Timeline = [
  {
    delay: 1000,
    onTime: (world) => {
      addTrident(world, 100, 100);
      addTrident(world, 440, 50, false);
      addTrident(world, 240, 0);
      addConga(world, 10, 10);
    }
  },
  {
    delay: 6000,
    onTime: (world) => {
      addTrident(world, 140, 0);
      addTrident(world, 400, 0);
      addTrident(world, 200, 0, false);

    }
  },
  {
    delay: 6000,
    onTime: (world) => {
      addTrident(world, 140, 0);
      addTrident(world, 400, 0);
      addTrident(world, 200, 0);

    }
  },
  {
    delay: 2000,
    onTime: (world) => {
      addSprayer(world, 100, 0);
      addSprayer(world, 250, 0);
      addSprayer(world, 400, 0);

    }
  },
  {
    delay: 6000,
    onTime: (world) => {
      addPyro(world, 100, 0);
    }
  }
];
