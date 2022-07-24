import {addComponent, addEntity, defineQuery} from 'bitecs';
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
import {BossComponent} from '../../components/BossComponent';
import {spriteLoader} from '../../loader/Loader';

export interface TimelineEntry {
  delay: number;
  onTime: (world: World) => void;
  canPass?: (world: World) => boolean;
}

export type Timeline = TimelineEntry[];

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

      addComponent(world, Transform, eid);
      addComponent(world, Velocity, eid);
      addComponent(world, EnemyComponent, eid);
      addComponent(world, CollisionComponent, eid);
      CollisionComponent.filter[eid] = 0b000010;
      Transform.position.x[eid] = x;
      Transform.position.y[eid] = y;

      EnemyComponent.spawnTime[eid] = world.time.elapsed;
      EnemyComponent.hp[eid] = 100;
      EnemyComponent.maxHp[eid] = 100;

      addComponent(world, SpriteComponent, eid);
      SpriteComponent.spriteIndex[eid] = spriteLoader.getIndex('enemy-test');
      SpriteComponent.scale[eid] = 0.3;
      SpriteComponent.zIndex[eid] = 20;
      CollisionComponent.radius[eid] = 30;

      addComponent(world, PathComponent, eid);
      PathComponent.starTime[eid] = world.time.elapsed;
      PathComponent.startX[eid] = x;
      PathComponent.startY[eid] = y;
      PathComponent.configIndex[eid] = configManager.add<PathPoint[]>([
        {
          x: 0,
          y: 100,
          delay: 3000
        },
        {
          x: 50,
          y: 100,
          delay: 3000
        },
        {
          x: 50,
          y: 0,
          delay: 3000
        }
      ]);

      bossEid = addEntity(world);
      addComponent(world, BossComponent, bossEid);
      BossComponent.stageEid[bossEid] = eid;

      addComponent(world, TimelineComponent, eid);
      TimelineComponent.configIndex[eid] = configManager.add<Timeline>([
        {
          delay: 0,
          onTime: () => {
            const bulletPurple = addEntity(entityPrefabWorld);
            addComponent(entityPrefabWorld, Transform, bulletPurple);
            addComponent(entityPrefabWorld, Velocity, bulletPurple);
            addComponent(entityPrefabWorld, Speed, bulletPurple);
            addComponent(entityPrefabWorld, AngularSpeed, bulletPurple);
            Transform.position.x[bulletPurple] = 0;
            Transform.position.y[bulletPurple] = 0;
            Transform.rotation[bulletPurple] = 0;
            Speed.val[bulletPurple] = 0.1;
            AngularSpeed.val[bulletPurple] = -0.001;
            addComponent(entityPrefabWorld, SpriteComponent, bulletPurple);
            addComponent(entityPrefabWorld, CollisionComponent, bulletPurple);
            addComponent(entityPrefabWorld, BulletComponent, bulletPurple);
            SpriteComponent.spriteIndex[bulletPurple] = spriteLoader.getIndex('bullet03');
            SpriteComponent.scale[bulletPurple] = 0.5;
            CollisionComponent.group[bulletPurple] = 0b000001;
            CollisionComponent.radius[bulletPurple] = 5;


            // Shoot purple bullets clockwise, opposite side of bulletSpawner
            const bulletSpawner2 = addEntity(world);
            addComponent(world, Transform, bulletSpawner2);
            addComponent(world, Velocity, bulletSpawner2);
            addComponent(world, AngularSpeed, bulletSpawner2);
            Transform.position.x[bulletSpawner2] = 50;
            Transform.position.y[bulletSpawner2] = 0;
            Transform.rotation[bulletSpawner2] = Math.PI;
            AngularSpeed.val[bulletSpawner2] = Math.PI / 800;
            addComponent(world, AttachmentComponent, bulletSpawner2);
            AttachmentComponent.attachedTo[bulletSpawner2] = eid;
            AttachmentComponent.applyParentRotation[bulletSpawner2] = 1;

            addComponent(world, GraphicsCircle, bulletSpawner2);
            GraphicsCircle.color[bulletSpawner2] = 0xff0000;
            GraphicsCircle.radius[bulletSpawner2] = 10;

            // spawn purple bullets
            addComponent(world, EntitySpawner, bulletSpawner2);
            EntitySpawner.templateEntity[bulletSpawner2] = bulletPurple;
            EntitySpawner.delay[bulletSpawner2] = 500;
            EntitySpawner.loop[bulletSpawner2] = 127;
            EntitySpawner.loopInterval[bulletSpawner2] = 500;
          }
        }
      ]);
    }
  },
  {
    delay: 5000,
    onTime: (world) => {
      const player = defineQuery([PlayerComponent])(world)[0];
      const eid = addEntity(world);
      const [x, y] = [300, 300]

      addComponent(world, Transform, eid);
      addComponent(world, Velocity, eid);
      addComponent(world, EnemyComponent, eid);
      addComponent(world, CollisionComponent, eid);
      CollisionComponent.filter[eid] = 0b000010;
      Transform.position.x[eid] = x;
      Transform.position.y[eid] = y;

      EnemyComponent.spawnTime[eid] = world.time.elapsed;
      EnemyComponent.hp[eid] = 100;
      EnemyComponent.maxHp[eid] = 100;

      addComponent(world, SpriteComponent, eid);
      SpriteComponent.spriteIndex[eid] = spriteLoader.getIndex('enemy-test');
      SpriteComponent.scale[eid] = 0.3;
      SpriteComponent.zIndex[eid] = 20;
      CollisionComponent.radius[eid] = 30;

      addComponent(world, PathComponent, eid);
      PathComponent.starTime[eid] = world.time.elapsed;
      PathComponent.startX[eid] = x;
      PathComponent.startY[eid] = y;
      PathComponent.configIndex[eid] = configManager.add<PathPoint[]>([
        {
          x: 0,
          y: 100,
          delay: 3000
        },
        {
          x: 50,
          y: 100,
          delay: 3000
        },
        {
          x: 50,
          y: 0,
          delay: 3000
        }
      ]);

      BossComponent.stageEid[bossEid] = eid;

      addComponent(world, TimelineComponent, eid);
      TimelineComponent.configIndex[eid] = configManager.add<Timeline>([
        {
          delay: 0,
          onTime: () => {
            // Shoot purple bullets clockwise, opposite side of bulletSpawner
            const bulletSpawner2 = addEntity(world);
            addComponent(world, Transform, bulletSpawner2);
            addComponent(world, Velocity, bulletSpawner2);
            addComponent(world, AngularSpeed, bulletSpawner2);
            Transform.position.x[bulletSpawner2] = 50;
            Transform.position.y[bulletSpawner2] = 0;
            Transform.rotation[bulletSpawner2] = Math.PI;
            AngularSpeed.val[bulletSpawner2] = Math.PI / 800;
            addComponent(world, AttachmentComponent, bulletSpawner2);
            AttachmentComponent.attachedTo[bulletSpawner2] = eid;
            AttachmentComponent.applyParentRotation[bulletSpawner2] = 0;

            addComponent(world, GraphicsCircle, bulletSpawner2);
            GraphicsCircle.color[bulletSpawner2] = 0xff0000;
            GraphicsCircle.radius[bulletSpawner2] = 10;

            addComponent(world, BulletSpawnComponent, bulletSpawner2);
            BulletSpawnComponent.startTime[bulletSpawner2] = world.time.elapsed;
            BulletSpawnComponent.configIndex[bulletSpawner2] = configManager.add<BulletSpawnConfig>({
              loop: true,
              burstCount: 6,
              burstDelay: 400,
              loopDelay: 1000,
              onLoop: createPlayerTargetLoop(player),
              onBurst: createArcBurst(4, 40)
            })
          }
        }
      ]);
    }
  }
];
