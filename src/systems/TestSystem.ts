import { addEntity, addComponent } from 'bitecs';
import { EntityPrefabWorld, World } from '../main';
import { Transform } from '../components/Transform';
import { AngularSpeed, Speed, Velocity} from '../components/Physics';
import { EntitySpawner } from '../components/EntitySpawner';
import { SpriteComponent } from '../components/Sprite';
import { CollisionComponent } from '../components/Collision';
import  {BulletComponent } from '../components/Bullet';

// How to use EntitySpawner:
// Add a pre-defined entity to an EntityPrefabWorld
// Create another entity with EntitySpawner component in the main world
// Give the entity spawner the pre-defined entity's eid

const arcShooter = (
    world: World,
    epworld: EntityPrefabWorld,
    loopDelay: number,        // delay between bursts
    loop: number,             // number of times to shoot bursts
    burstCount: number,       // number of bullets in a burst
    burstDelay: number,       // delay between bullets in a burst
    burstBulletCount: number, // number of 'streams' in a burst
    angleSpread: number       // rotation between each 'stream'
  ): number[] => {
  const bulletBlue = addEntity(epworld);
  addComponent(epworld, Transform, bulletBlue);
  addComponent(epworld, Velocity, bulletBlue);
  addComponent(epworld, Speed, bulletBlue);
  Transform.position.x[bulletBlue] = 0; // initial displacement 0 means that
  Transform.position.y[bulletBlue] = 0; // spawned entity will be spawned at location of spawner
  Transform.rotation[bulletBlue] = 0; // This however will spawn this entity at a 90 deg rotation to spawner's rotation
  Speed.val[bulletBlue] = 0.1;
  addComponent(epworld, SpriteComponent, bulletBlue);
  addComponent(epworld, CollisionComponent, bulletBlue);
  addComponent(epworld, BulletComponent, bulletBlue);
  SpriteComponent.spriteIndex[bulletBlue] = 0;
  SpriteComponent.scale[bulletBlue] = 0.5;
  CollisionComponent.group[bulletBlue] = 0b000001;
  CollisionComponent.radius[bulletBlue] = 2;

  // Shoot purple bullets clockwise
  const burst = addEntity(epworld);
  addComponent(epworld, Transform, burst);
  addComponent(epworld, Velocity, burst);
  addComponent(epworld, AngularSpeed, burst);
  Transform.position.x[burst] = 0;
  Transform.position.y[burst] = 0;
  Transform.rotation[burst] = 0;
  AngularSpeed.val[burst] = 0;
  // spawn purple bullets
  addComponent(epworld, EntitySpawner, burst);
  EntitySpawner.templateEntity[burst] = bulletBlue;
  EntitySpawner.delay[burst] = 0;
  EntitySpawner.loop[burst] = burstCount-1;
  EntitySpawner.loopInterval[burst] = burstDelay;
  EntitySpawner.killAfterLastLoop[burst] = 1;
  addComponent(epworld, CollisionComponent, burst);
  CollisionComponent.group[burst] = 0b000001;
  CollisionComponent.radius[burst] = 15;

  let newArcSpawners = [];
  const halfRotation = (angleSpread * burstBulletCount)/2;
  const actualLoopDelay = loopDelay + (burstDelay * burstCount);
  for (let i = 0; i < burstBulletCount; i++) {
    // Shoot purple bullets clockwise, opposite side of bulletSpawner
    const bulletSpawner = addEntity(world);
    addComponent(world, Transform, bulletSpawner);
    addComponent(world, Velocity, bulletSpawner);
    addComponent(world, AngularSpeed, bulletSpawner);
    Transform.position.x[bulletSpawner] = 0;
    Transform.position.y[bulletSpawner] = 0;
    Transform.rotation[bulletSpawner] = -halfRotation + angleSpread*i;
    AngularSpeed.val[bulletSpawner] = Math.PI/200;
    addComponent(world, CollisionComponent, bulletSpawner);
    CollisionComponent.group[bulletSpawner] = 0b000001;
    CollisionComponent.radius[bulletSpawner] = 20;
    // spawn purple bullets
    addComponent(world, EntitySpawner, bulletSpawner);
    EntitySpawner.templateEntity[bulletSpawner] = burst;
    EntitySpawner.delay[bulletSpawner] = 0;
    EntitySpawner.loop[bulletSpawner] = loop-1;
    EntitySpawner.loopInterval[bulletSpawner] = actualLoopDelay;
    newArcSpawners.push(bulletSpawner);
  }

  return newArcSpawners;
  
}

export const testSystem = (world: World, epworld: EntityPrefabWorld) => {

  // Create a new arc shooter in the world with the given parameters
  const arc = arcShooter(
    world,
    epworld,
    400,      // delay between bursts
    3,        // number of times to shoot bursts
    4,        // number of bullets in a burst
    200,      // delay between bullets in a burst
    3,        // number of 'streams' in a burst
    Math.PI/3 // rotation between each 'stream'
  );

  // Now add some extra components to it if desired, e.g., parenting, tracking, etc.
  for (const eid of arc) {
    Transform.position.x[eid] = 200;
    Transform.position.y[eid] = 200;
    Velocity.x[eid] = 0.03;
    Velocity.y[eid] = 0.03;
  }


  return (world: World) => {
    
    return world;
  }
}
