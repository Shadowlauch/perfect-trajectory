import { addEntity, addComponent } from 'bitecs';
import { EntityPrefabWorld, World } from '../main';
import { Transform } from '../components/Transform';
import { AngularSpeed, Speed, Velocity} from '../components/Physics';
import { EntitySpawner } from '../components/EntitySpawner';
import { SpriteComponent } from '../components/Sprite';
import { CollisionComponent } from '../components/Collision';
import  {BulletComponent } from '../components/Bullet';
import { GraphicsCircle } from '../components/GraphicsCircle';

// How to use EntitySpawner:
// Add a pre-defined entity to an EntityPrefabWorld
// Create another entity with EntitySpawner component in the main world
// Give the entity spawner the pre-defined entity's eid

export const testSystem = (world: World, epworld: EntityPrefabWorld) => {
  let timer = 0;
  const iteration = 500;

  // Blue bullets
  const bulletBlue = addEntity(epworld);
  addComponent(epworld, Transform, bulletBlue);
  addComponent(epworld, Velocity, bulletBlue);
  addComponent(epworld, Speed, bulletBlue);
  Transform.position.x[bulletBlue] = 0; // initial displacement 0 means that
  Transform.position.y[bulletBlue] = 0; // spawned entity will be spawned at location of spawner
  Transform.rotation[bulletBlue] = Math.PI/4; // This however will spawn this entity at a 90 deg angle to spawner's angle
  Speed.val[bulletBlue] = 0.1;
  addComponent(epworld, SpriteComponent, bulletBlue);
  addComponent(epworld, CollisionComponent, bulletBlue);
  addComponent(epworld, BulletComponent, bulletBlue);
  SpriteComponent.spriteIndex[bulletBlue] = 0;
  SpriteComponent.scale[bulletBlue] = 0.5;
  CollisionComponent.group[bulletBlue] = 0b000001;
  CollisionComponent.radius[bulletBlue] = 2;

  // Purple bullet, spawns blue bullets
  const bulletPurple = addEntity(epworld);
  addComponent(epworld, Transform, bulletPurple);
  addComponent(epworld, Velocity, bulletPurple);
  addComponent(epworld, Speed, bulletPurple);
  addComponent(epworld, AngularSpeed, bulletPurple);
  Transform.position.x[bulletPurple] = 0;
  Transform.position.y[bulletPurple] = 0;
  Transform.rotation[bulletPurple] = 0;
  Speed.val[bulletPurple] = 0.1;
  AngularSpeed.val[bulletPurple] = -0.001;
  addComponent(epworld, SpriteComponent, bulletPurple);
  addComponent(epworld, CollisionComponent, bulletPurple);
  addComponent(epworld, BulletComponent, bulletPurple);
  SpriteComponent.spriteIndex[bulletPurple] = 2;
  SpriteComponent.scale[bulletPurple] = 0.5;
  CollisionComponent.group[bulletPurple] = 0b000001;
  CollisionComponent.radius[bulletPurple] = 5;
  // spawn blue bullets
  addComponent(epworld, EntitySpawner, bulletPurple);
  EntitySpawner.templateEntity[bulletPurple] = bulletBlue;
  EntitySpawner.delay[bulletPurple] = 500;
  EntitySpawner.loop[bulletPurple] = 1;
  EntitySpawner.loopInterval[bulletPurple] = 500;

  // Shoot purple bullets clockwise
  const bulletSpawner = addEntity(world);
  addComponent(world, Transform, bulletSpawner);
  addComponent(world, Velocity, bulletSpawner);
  addComponent(world, AngularSpeed, bulletSpawner);
  Transform.position.x[bulletSpawner] = 200;
  Transform.position.y[bulletSpawner] = 200;
  Transform.rotation[bulletSpawner] = 0;
  AngularSpeed.val[bulletSpawner] = Math.PI/800;
  addComponent(world, CollisionComponent, bulletSpawner);
  CollisionComponent.group[bulletSpawner] = 0b000001;
  CollisionComponent.radius[bulletSpawner] = 20;
  // spawn purple bullets
  addComponent(world, EntitySpawner, bulletSpawner);
  EntitySpawner.templateEntity[bulletSpawner] = bulletPurple;
  EntitySpawner.delay[bulletSpawner] = 1000;
  EntitySpawner.loop[bulletSpawner] = 1;
  EntitySpawner.loopInterval[bulletSpawner] = 1000;
  addComponent(world, GraphicsCircle, bulletSpawner);
  GraphicsCircle.color[bulletSpawner] = 0xa0a0ff;
  GraphicsCircle.radius[bulletSpawner] = 10;

  // Shoot purple bullets clockwise, opposite side of bulletSpawner
  const bulletSpawner2 = addEntity(world);
  addComponent(world, Transform, bulletSpawner2);
  addComponent(world, Velocity, bulletSpawner2);
  addComponent(world, AngularSpeed, bulletSpawner2);
  Transform.position.x[bulletSpawner2] = 200;
  Transform.position.y[bulletSpawner2] = 200;
  Transform.rotation[bulletSpawner2] = Math.PI;
  AngularSpeed.val[bulletSpawner2] = Math.PI/800;
  addComponent(world, CollisionComponent, bulletSpawner2);
  CollisionComponent.group[bulletSpawner2] = 0b000001;
  CollisionComponent.radius[bulletSpawner2] = 20;
  // spawn purple bullets
  addComponent(world, EntitySpawner, bulletSpawner2);
  EntitySpawner.templateEntity[bulletSpawner2] = bulletPurple;
  EntitySpawner.delay[bulletSpawner2] = 500;
  EntitySpawner.loop[bulletSpawner2] = 1;
  EntitySpawner.loopInterval[bulletSpawner2] = 500;

  // red bullet
    const bulletRed = addEntity(epworld);
  addComponent(epworld, Transform, bulletRed);
  addComponent(epworld, Velocity, bulletRed);
  addComponent(epworld, Speed, bulletRed);
  Transform.position.x[bulletRed] = 0;
  Transform.position.y[bulletRed] = 0;
  Transform.rotation[bulletRed] = Math.PI/4;
  Speed.val[bulletRed] = 0.1;
  addComponent(epworld, SpriteComponent, bulletRed);
  addComponent(epworld, CollisionComponent, bulletRed);
  addComponent(epworld, BulletComponent, bulletRed);
  SpriteComponent.spriteIndex[bulletRed] = 1;
  SpriteComponent.scale[bulletRed] = 0.5;
  CollisionComponent.group[bulletRed] = 0b000001;
  CollisionComponent.radius[bulletRed] = 2;

  // Shoot counterclockwise
  const bulletSpawner3 = addEntity(world);
  addComponent(world, Transform, bulletSpawner3);
  addComponent(world, Velocity, bulletSpawner3);
  Transform.position.x[bulletSpawner3] = 200;
  Transform.position.y[bulletSpawner3] = 200;
  Transform.rotation[bulletSpawner3] = Math.PI;
  addComponent(world, CollisionComponent, bulletSpawner3);
  CollisionComponent.group[bulletSpawner3] = 0b000001;
  CollisionComponent.radius[bulletSpawner3] = 20;
  // spawn red bullets
  addComponent(world, EntitySpawner, bulletSpawner3);
  EntitySpawner.templateEntity[bulletSpawner3] = bulletRed;
  EntitySpawner.delay[bulletSpawner3] = 0;
  EntitySpawner.loop[bulletSpawner3] = 1;
  EntitySpawner.loopInterval[bulletSpawner3] = iteration/3;


  return (world: World) => {
    const { time: { delta } } = world;

    timer += delta;
    if (timer >= iteration) {
      Transform.rotation[bulletSpawner3] -= Math.PI/8;
      timer -= iteration;
    }
    //const prefabSerializer = defineSerializer(epworld);
    //const prefabEnt = prefabSerializer([bulletBlue]);
    //console.log('!!!!!prefabEnt:', prefabEnt, bulletBlue, EntitySpawner.templateEntity[bulletPurple]);
    
    return world;
  }
}
