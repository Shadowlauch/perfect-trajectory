import {addEntity, defineQuery} from 'bitecs';
import {addTransformComponent, TransformComponent} from '../../../components/TransformComponent';
import {addVelocityComponent} from '../../../components/Physics';
import {addEnemyComponent} from '../../../components/EnemyComponent';
import {addCollisionComponent} from '../../../components/CollisionComponent';
import {addTimelineComponent, Timeline} from '../../../components/TimelineComponent';
import {addAnimatedSpriteComponent, addSpriteComponent} from '../../../components/SpriteComponent';
import {addAttachmentComponent} from '../../../components/AttachmentComponent';
import {addBulletSpawnComponent} from '../../../components/BulletSpawnComponent';
import {createArcBurst} from '../../bullets/spawn/burst/Arc';
import {PlayerComponent} from '../../../components/PlayerComponent';
import {addBossComponent, BossComponent} from '../../../components/BossComponent';
import {World} from '../../../main';
import {createPlayerTargetLoop} from '../../bullets/spawn/loop/PlayerTarget';
import {addPathComponent} from '../../../components/PathComponent';
import {addEventListenerEntity} from '../../../components/EventListenerComponent';

const CONFIG = {
  SPINNER_LOOPS: 32 * 5,
  SPINNER_BURST_DELAY: 200,
}

const addTrident = (world: World, bossEid: number, player: number, x: number, y: number) => {
  const bulletSpawner = addEntity(world);
  addTransformComponent(world, bulletSpawner, x, y, Math.PI);
  addVelocityComponent(world, bulletSpawner);
  addAttachmentComponent(world, bulletSpawner, bossEid, false, false);
  addBulletSpawnComponent(world, bulletSpawner, {
    loop: 5,
    burstCount: 10,
    burstDelay: 200,
    loopDelay: 2000,
    onStart: createPlayerTargetLoop(player),
    onBurst: createArcBurst(7, 80)
  });
}

const addSpinner = (world: World, bossEid: number) => {
  let rot = Math.PI * -0.5;
  const bulletSpawner = addEntity(world);
  addTransformComponent(world, bulletSpawner);
  addVelocityComponent(world, bulletSpawner);
  addAttachmentComponent(world, bulletSpawner, bossEid);
  addBulletSpawnComponent(world, bulletSpawner, {
    loop: CONFIG.SPINNER_LOOPS,
    burstCount: 1,
    burstDelay: CONFIG.SPINNER_BURST_DELAY,
    loopDelay: 0,
    onLoop: (_world1, spawner) => {
      TransformComponent.rotation[spawner] = rot;
      TransformComponent.globalRotation[spawner] = rot;
      rot += (2 * Math.PI) / CONFIG.SPINNER_LOOPS;
    },
    onBurst: createArcBurst(37, 280)
  });
}


let bossEid = 0;
export const Stage0: Timeline = [
  {
    delay: 0,
    onTime: (world) => {
      const player = defineQuery([PlayerComponent])(world)[0];
      const eid = addEntity(world);
      const [x, y] = [300, 300]

      addTransformComponent(world, eid, x, y);
      addVelocityComponent(world, eid);
      addCollisionComponent(world, eid, 30, {filter: 0b000010});
      addEnemyComponent(world, eid, 300);
      addSpriteComponent(world, eid, 'enemy-test', {scale: 0.3, zIndex: 20});
      addPathComponent(world, eid, x, y, [{x: -100, y: 0, delay: 10000}, {x: 200, y: 0, delay: 10000}])

      bossEid = addEntity(world);
      addBossComponent(world, bossEid, eid);
      //addPathComponent(world, eid, x, y, [{x: 0, y: 100, delay: 3000}, {x: 50, y: 100, delay: 3000}, {x: 50, y: 0, delay: 3000}]);

      addEventListenerEntity(world, eid,'death',  {
        callback: () => {
          const explosion = addEntity(world);
          addTransformComponent(world, explosion, TransformComponent.position.x[eid], TransformComponent.position.y[eid])
          addAnimatedSpriteComponent(world, explosion, 'explosion', 'base', {
            zIndex: 30
          });

        }
      });

      BossComponent.stageEid[bossEid] = eid;

      addTimelineComponent(world, eid, [
        {
          delay: 0,
          onTime: () => {
            addSpinner(world, eid);
          }
        },
        {
          delay: CONFIG.SPINNER_BURST_DELAY * CONFIG.SPINNER_LOOPS + 2000,
          onTime: () => {
            addTrident(world, eid, player, x -150, y);
            addTrident(world, eid, player, x -250, y);
            addTrident(world, eid, player, x + 150, y);
            addTrident(world, eid, player, x + 250, y);
          }
        }
      ])
    }
  }
];
