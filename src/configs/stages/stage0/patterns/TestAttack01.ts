import { addEntity, addComponent } from 'bitecs';
import { EntityPrefabWorld, World } from '../../../../main';
import { Transform } from '../../../../components/Transform';
import { AngularSpeed, Speed, Velocity} from '../../../../components/Physics';
import { EntitySpawner } from '../../../../components/EntitySpawner';
import { SpriteComponent } from '../../../../components/Sprite';
import { CollisionComponent } from '../../../../components/Collision';
import  {BulletComponent } from '../../../../components/Bullet';
import { AttachmentComponent } from '../../../../components/Attachment';
import {spriteLoader} from '../../../../loader/Loader';

/** Generic spread-style shooter */
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
  // The actual bullet fired
  const bulletBlue = addEntity(epworld);
  addComponent(epworld, Transform, bulletBlue);
  addComponent(epworld, Velocity, bulletBlue);
  addComponent(epworld, Speed, bulletBlue);
  Transform.position.x[bulletBlue] = 0; // Initial displacement 0 means that
  Transform.position.y[bulletBlue] = 0; // spawned entity will be spawned at location of spawner.
  Transform.rotation[bulletBlue] = 0;   // Will be fired in direction of spawner.
  Speed.val[bulletBlue] = 0.1;
  addComponent(epworld, SpriteComponent, bulletBlue);
  addComponent(epworld, CollisionComponent, bulletBlue);
  addComponent(epworld, BulletComponent, bulletBlue);
  SpriteComponent.spriteIndex[bulletBlue] = spriteLoader.getIndex('white01');
  SpriteComponent.scale[bulletBlue] = 0.8;
  CollisionComponent.group[bulletBlue] = 0b000001;
  CollisionComponent.radius[bulletBlue] = 2;

  // Shoot short rapid-fire bursts
  const burst = addEntity(epworld);
  addComponent(epworld, Transform, burst);
  addComponent(epworld, Velocity, burst);
  Transform.position.x[burst] = 0;
  Transform.position.y[burst] = 0;
  Transform.rotation[burst] = 0;
  // Spawn blue bullets
  addComponent(epworld, EntitySpawner, burst);
  EntitySpawner.templateEntity[burst] = bulletBlue;
  EntitySpawner.delay[burst] = 0;
  EntitySpawner.loop[burst] = burstCount-1;
  EntitySpawner.loopInterval[burst] = burstDelay;
  EntitySpawner.killAfterLastLoop[burst] = 1;   // Kill this spawner after it's finished shooting
  EntitySpawner.parentOfSpawned[burst] = 0;     // The bullets won't be parented to the spawner

  let newArcSpawners = [];
  // Fan out centered at shooting direction
  const halfRotation = (angleSpread * burstBulletCount)/2;
  const actualLoopDelay = loopDelay + (burstDelay * burstCount);
  for (let i = 0; i < burstBulletCount; i++) {
    // Loop through shooting of rapid fire bursts
    const bulletSpawner = addEntity(world);
    addComponent(world, Transform, bulletSpawner);
    addComponent(world, Velocity, bulletSpawner);
    Transform.position.x[bulletSpawner] = 0;
    Transform.position.y[bulletSpawner] = 0;
    Transform.rotation[bulletSpawner] = -halfRotation + angleSpread*i;
    // spawn bursts
    addComponent(world, EntitySpawner, bulletSpawner);
    EntitySpawner.templateEntity[bulletSpawner] = burst;
    EntitySpawner.delay[bulletSpawner] = 0;
    EntitySpawner.loop[bulletSpawner] = loop-1;
    EntitySpawner.loopInterval[bulletSpawner] = actualLoopDelay;
    EntitySpawner.killAfterLastLoop[burst] = 1;
    EntitySpawner.parentOfSpawned[bulletSpawner] = 1; // Bursts track parent

    newArcSpawners.push(bulletSpawner);
  }
  // Return eids for further manipulation
  return newArcSpawners;
}

/** Creates a new entity that is a child for the given entity */
const entityTracker = (world: World, entityToTrack: number): number => {
  const eid = addEntity(world);
  addComponent(world, Transform, eid);
  addComponent(world, AttachmentComponent, eid);
  Transform.position.x[eid] = 0;
  Transform.position.y[eid] = 0;
  Transform.rotation[eid] = 0;
  AttachmentComponent.applyParentRotation[eid] = 1;
  AttachmentComponent.attachedTo[eid] = entityToTrack;

  return eid;
}

export const TestAttack01 = (world: World, epworld: EntityPrefabWorld, eid: number) => {
  // Track boss location
  const bossPos = entityTracker(world, eid);
  // Slowly rotate
  addComponent(world, AngularSpeed, bossPos);
  AngularSpeed.val[bossPos] = 0.01;

  // Red orb orbits around boss's position
  const orbitingPet = addEntity(world);
  addComponent(world, Transform, orbitingPet);
  addComponent(world, Velocity, orbitingPet);
  Transform.position.x[orbitingPet] = 50;
  Transform.position.y[orbitingPet] = 0;
  Transform.rotation[orbitingPet] = 0;
  addComponent(world, AttachmentComponent, orbitingPet);
  AttachmentComponent.attachedTo[orbitingPet] = bossPos;
  AttachmentComponent.applyParentRotation[orbitingPet] = 1;

  /*addComponent(world, GraphicsCircle, orbitingPet);
  GraphicsCircle.color[orbitingPet] = 0xff0000;
  GraphicsCircle.radius[orbitingPet] = 10;*/
  addComponent(world, CollisionComponent, orbitingPet);
  CollisionComponent.filter[orbitingPet] = 0b000010;
  CollisionComponent.radius[orbitingPet] = 30;

  // Create a new arc shooter in the world with the given parameters
  const arc = arcShooter(
    world,
    epworld,
    400,      // delay between bursts
    127,        // number of times to shoot bursts
    8,        // number of bullets in a burst
    120,      // delay between bullets in a burst
    4,        // number of 'streams' in a burst
    Math.PI/8 // rotation between each 'stream'
  );

  // Now add some extra components to it if desired, e.g., parenting, tracking, etc.
  // We'll have the orbitingPet thing shoot these out
  for (const shot of arc) {
    addComponent(world, AttachmentComponent, shot);
    AttachmentComponent.applyParentRotation[shot] = 1;
    AttachmentComponent.attachedTo[shot] = orbitingPet;
  }
}
