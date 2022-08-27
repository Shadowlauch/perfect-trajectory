import {addEntity, defineQuery} from 'bitecs';
import {addTransformComponent, TransformComponent} from '../../../components/TransformComponent';
import {addAngularSpeedComponent, addVelocityComponent} from '../../../components/Physics';
import {addEnemyComponent, EnemyComponent} from '../../../components/EnemyComponent';
import {addCollisionComponent} from '../../../components/CollisionComponent';
import {addTimelineComponent, Timeline} from '../../../components/TimelineComponent';
import {entityPrefabWorld} from '../../../main';
import {addAnimatedSpriteComponent, addSpriteComponent} from '../../../components/SpriteComponent';
import {addPathComponent} from '../../../components/PathComponent';
import {addAttachmentComponent} from '../../../components/AttachmentComponent';
import {addBulletSpawnComponent} from '../../../components/BulletSpawnComponent';
import {createArcBurst} from '../../bullets/spawn/burst/Arc';
import {PlayerComponent} from '../../../components/PlayerComponent';
import {createPlayerTargetLoop} from '../../bullets/spawn/loop/PlayerTarget';
import {addBossComponent, BossComponent} from '../../../components/BossComponent';
import { TestAttack01 } from './patterns/TestAttack01';
import {addEventListenerEntity} from '../../../components/EventListenerComponent';

const enemyQuery = defineQuery([EnemyComponent]);

let bossEid = 0;
export const Stage0: Timeline = [
  {
    delay: 0,
    canPass: (world) => {
      return enemyQuery(world).length === 0;
    },
    onTime: (world) => {
      const eid = addEntity(world);
      const [x, y] = [100, 100]

      addTransformComponent(world, eid, x, y)
      addVelocityComponent(world, eid);
      addCollisionComponent(world, eid, 30, {filter: 0b000010});
      addEnemyComponent(world, eid, 30);
      addSpriteComponent(world, eid, 'enemy-test', {scale: 0.3, zIndex: 30});
      addPathComponent(world, eid, x, y, [{x: 0, y: 100, delay: 3000}, {x: 50, y: 100, delay: 3000}, {x: 50, y: 0, delay: 3000}]);

      bossEid = addEntity(world);
      addBossComponent(world, bossEid, eid);

      addTimelineComponent(world, eid, [
        {
          delay: 0,
          onTime: () => {
            TestAttack01(world, entityPrefabWorld, eid);
          }
        }
      ]);

      addEventListenerEntity(world, eid,'death',  {
        callback: () => {
          const explosion = addEntity(world);
          addTransformComponent(world, explosion, TransformComponent.position.x[eid], TransformComponent.position.y[eid])
          addAnimatedSpriteComponent(world, explosion, 'explosion', 'base', {
            zIndex: 30
          });

        }
      })
    }
  },
  {
    delay: 0,
    onTime: (world) => {
      const player = defineQuery([PlayerComponent])(world)[0];
      const eid = addEntity(world);
      const [x, y] = [300, 300]

      addTransformComponent(world, eid, x, y);
      addVelocityComponent(world, eid);
      addCollisionComponent(world, eid, 30, {filter: 0b000010});
      addEnemyComponent(world, eid, 30);
      addSpriteComponent(world, eid, 'enemy-test', {scale: 0.3, zIndex: 20});
      addPathComponent(world, eid, x, y, [{x: 0, y: 100, delay: 3000}, {x: 50, y: 100, delay: 3000}, {x: 50, y: 0, delay: 3000}]);

      BossComponent.stageEid[bossEid] = eid;

      addTimelineComponent(world, eid, [
        {
          delay: 0,
          onTime: () => {
            // Shoot purple bullets clockwise, opposite side of bulletSpawner
            const bulletSpawner2 = addEntity(world);
            addTransformComponent(world, bulletSpawner2, 50, 0, Math.PI);
            addVelocityComponent(world, bulletSpawner2);
            addAngularSpeedComponent(world, bulletSpawner2, Math.PI / 800);
            addAttachmentComponent(world, bulletSpawner2, eid);
            addBulletSpawnComponent(world, bulletSpawner2, {
              loop: true,
              burstCount: 6,
              burstDelay: 400,
              loopDelay: 1000,
              onLoop: createPlayerTargetLoop(player),
              onBurst: createArcBurst(4, 40)
            });
          }
        }
      ])
    }
  }
];
