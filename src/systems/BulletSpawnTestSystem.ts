import {addEntity, addComponent} from 'bitecs';
import {Velocity} from '../components/Physics';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {SpriteComponent} from '../components/Sprite';
import {CollisionComponent} from '../components/Collision';

export const createBulletSpawnTestSystem = () => {
  const shootingCooldown = 200
  let shootingTimer = 0

  return (world: World) => {
    const {time: {delta}, size: {height}} = world;
    shootingTimer += delta
    if (shootingTimer > shootingCooldown) {

      for (let y = 5; y < height; y += 20) {
      
            // create the player tank
        const bullet = addEntity(world)

        addComponent(world, Transform, bullet)
        addComponent(world, Velocity, bullet)
        addComponent(world, SpriteComponent, bullet);
        addComponent(world, CollisionComponent, bullet);
        SpriteComponent.spriteIndex[bullet] = 0;
        CollisionComponent.group[bullet] = 0b000001;

        Transform.position.x[bullet] = -20
        Transform.position.y[bullet] = y
        Velocity.x[bullet] = 0.1
        Velocity.y[bullet] = 0


      }
      shootingTimer = 0
    }
    return world;
  }
}
