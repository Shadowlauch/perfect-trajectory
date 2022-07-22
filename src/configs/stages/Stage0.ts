import {addComponent, addEntity, defineQuery} from 'bitecs';
import {Transform} from '../../components/Transform';
import {AngularSpeed, Speed, Velocity} from '../../components/Physics';
import {Enemy} from '../../components/Enemy';
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
import {Player} from '../../components/Player';
import {createPlayerTargetLoop} from '../bullets/spawn/loop/PlayerTarget';

export interface TimelineEntry {
  time: number;
  onTime: (world: World) => void;
}

export type Timeline = TimelineEntry[];

export const Stage0: Timeline = [
  {
    time: 1000,
    onTime: (world) => {
      const eid = addEntity(world);
      const [x, y] = [100, 100]

      addComponent(world, Transform, eid);
      addComponent(world, Velocity, eid);
      addComponent(world, Enemy, eid);
      addComponent(world, CollisionComponent, eid);
      CollisionComponent.filter[eid] = 0b000010;
      Transform.position.x[eid] = x;
      Transform.position.y[eid] = y;
      addComponent(world, AngularSpeed, eid);
      AngularSpeed.val[eid] = 0.01;


      Enemy.spawnTime[eid] = world.time.elapsed;
      Enemy.hp[eid] = 10;

      addComponent(world, GraphicsCircle, eid);
      GraphicsCircle.color[eid] = 0x00ff00;
      GraphicsCircle.radius[eid] = 10;
      CollisionComponent.radius[eid] = 8;

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

      addComponent(world, TimelineComponent, eid);
      TimelineComponent.starTime[eid] = world.time.elapsed;
      TimelineComponent.configIndex[eid] = configManager.add<Timeline>([
        {
          time: 0,
          onTime: () => {
            // Purple bullet, spawns blue bullets
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
            SpriteComponent.spriteIndex[bulletPurple] = 2;
            SpriteComponent.scale[bulletPurple] = 0.5;
            CollisionComponent.group[bulletPurple] = 0b000001;
            CollisionComponent.radius[bulletPurple] = 5;


            // Shoot purple bullets clockwise, opposite side of bulletSpawner
            const bulletSpawner2 = addEntity(world);
            addComponent(world, Transform, bulletSpawner2);
            addComponent(world, Velocity, bulletSpawner2);
            addComponent(world, AngularSpeed, bulletSpawner2);
            Transform.position.x[bulletSpawner2] = x;
            Transform.position.y[bulletSpawner2] = y;
            Transform.rotation[bulletSpawner2] = Math.PI;
            AngularSpeed.val[bulletSpawner2] = Math.PI / 800;
            addComponent(world, AttachmentComponent, bulletSpawner2);
            AttachmentComponent.attachedTo[bulletSpawner2] = eid;
            AttachmentComponent.offsetX[bulletSpawner2] = 50;

            addComponent(world, GraphicsCircle, bulletSpawner2);
            GraphicsCircle.color[bulletSpawner2] = 0xff0000;
            GraphicsCircle.radius[bulletSpawner2] = 10;

            // spawn purple bullets
            addComponent(world, EntitySpawner, bulletSpawner2);
            EntitySpawner.templateEntity[bulletSpawner2] = bulletPurple;
            EntitySpawner.delay[bulletSpawner2] = 500;
            EntitySpawner.loop[bulletSpawner2] = 1;
            EntitySpawner.loopInterval[bulletSpawner2] = 500;
          }
        }
      ]);
    }
  },
  {
    time: 1000,
    onTime: (world) => {
      const player = defineQuery([Player])(world)[0];
      const eid = addEntity(world);
      const [x, y] = [300, 300]

      addComponent(world, Transform, eid);
      addComponent(world, Velocity, eid);
      addComponent(world, Enemy, eid);
      addComponent(world, CollisionComponent, eid);
      CollisionComponent.filter[eid] = 0b000010;
      Transform.position.x[eid] = x;
      Transform.position.y[eid] = y;
      addComponent(world, AngularSpeed, eid);
      AngularSpeed.val[eid] = 0.01;


      Enemy.spawnTime[eid] = world.time.elapsed;
      Enemy.hp[eid] = 10;

      addComponent(world, GraphicsCircle, eid);
      GraphicsCircle.color[eid] = 0x00ff00;
      GraphicsCircle.radius[eid] = 10;
      CollisionComponent.radius[eid] = 8;

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

      addComponent(world, TimelineComponent, eid);
      TimelineComponent.starTime[eid] = world.time.elapsed;
      TimelineComponent.configIndex[eid] = configManager.add<Timeline>([
        {
          time: 0,
          onTime: () => {
            // Shoot purple bullets clockwise, opposite side of bulletSpawner
            const bulletSpawner2 = addEntity(world);
            addComponent(world, Transform, bulletSpawner2);
            addComponent(world, Velocity, bulletSpawner2);
            addComponent(world, AngularSpeed, bulletSpawner2);
            Transform.position.x[bulletSpawner2] = x;
            Transform.position.y[bulletSpawner2] = y;
            Transform.rotation[bulletSpawner2] = Math.PI;
            AngularSpeed.val[bulletSpawner2] = Math.PI / 800;
            addComponent(world, AttachmentComponent, bulletSpawner2);
            AttachmentComponent.attachedTo[bulletSpawner2] = eid;
            AttachmentComponent.offsetX[bulletSpawner2] = 50;

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
