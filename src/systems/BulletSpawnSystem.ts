import {addEntity, addComponent, defineQuery} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {World} from '../main';
import {SpriteComponent} from '../components/Sprite';
import { Player } from '../components/Player';
import { EnemyData } from '../components/EnemyData';
import {CollisionComponent} from '../components/Collision';

const spawnBullet = (world: World, x: number, y: number, angle: number) => {
  const speed = 0.1;

  const vx = speed * Math.cos(angle);
  const vy = speed * Math.sin(angle);

  const bullet = addEntity(world);

  addComponent(world, Position, bullet);
  addComponent(world, Velocity, bullet);
  addComponent(world, SpriteComponent, bullet);
  addComponent(world, CollisionComponent, bullet);
  SpriteComponent.spriteIndex[bullet] = 0;

  Position.x[bullet] = x;
  Position.y[bullet] = y;
  Velocity.x[bullet] = vx;
  Velocity.y[bullet] = vy;
  CollisionComponent.group[bullet] = 0b000001;
  CollisionComponent.radius[bullet] = 6;
}


export const createBulletSpawnSystem = () => {
  // const intraWaveCooldown = 100;
  // const interWaveCooldown = 2000;

  let shootingTimer = 0;

  const timeIntervals = [2000, 100, 100, 100];
  let currentInterval = 0;

  const burstCount = 9;
  const burstAngleSpread = 20 / 180 * Math.PI;

  const playerQuery = defineQuery([Position, Velocity, Player]);
  const enemyQuery = defineQuery([Position, Velocity, EnemyData]);

  let velocityAngle = 0;

  return (world: World) => {
    const {time: {delta}} = world;
    shootingTimer += delta;

    for (const enemy of enemyQuery(world)) {

      // inside the loop because it won't be static later
      if (shootingTimer > timeIntervals[currentInterval]) {
        shootingTimer -= timeIntervals[currentInterval];
        currentInterval += 1;
        if (currentInterval >= timeIntervals.length) {
          currentInterval = 0;
        }

        const startX = Position.x[enemy];
        const startY = Position.y[enemy];
        if (currentInterval === 1) {
          // get player position if now is the start of a burst
          const player = playerQuery(world)[0];
          const targetX = Position.x[player];
          const targetY = Position.y[player];


          const distanceX = targetX - startX;
          const distanceY = targetY - startY;

          velocityAngle = Math.atan2(distanceY, distanceX);
        }

        // initial target and direction ready

        // now use it to generate tweaks of angle
        // and aim the whole wave of bullets roughly at the targer

        // // if there is only one bullet, shoot it directly at the target
        // // to prevent division by 0
        // if (burstCount === 1) {
        //   spawnBullet(world, startX, startY, velocityAngle);
        //   continue;
        // }

        const angleStep = burstAngleSpread * 2 / (burstCount - 1)
        const initialVelAngle = velocityAngle - burstAngleSpread
        for (let i = 0; i < burstCount; ++i) {
          const velAngel = initialVelAngle + i*angleStep;
          spawnBullet(world, startX, startY, velAngel);
        }
      }
    }
    return world;
  }
}
