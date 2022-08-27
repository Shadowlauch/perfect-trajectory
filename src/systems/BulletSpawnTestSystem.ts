import {addEntity, addComponent} from 'bitecs';
import {VelocityComponent} from '../components/Physics';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';
import {SpriteComponent} from '../components/SpriteComponent';
import {CollisionComponent} from '../components/CollisionComponent';
import {spriteLoader} from '../loader/Loader';

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

        addComponent(world, TransformComponent, bullet)
        addComponent(world, VelocityComponent, bullet)
        addComponent(world, SpriteComponent, bullet);
        addComponent(world, CollisionComponent, bullet);
        SpriteComponent.spriteIndex[bullet] = spriteLoader.getIndex('bullet01');
        CollisionComponent.group[bullet] = 0b000001;

        TransformComponent.position.x[bullet] = -20
        TransformComponent.position.y[bullet] = y
        VelocityComponent.x[bullet] = 0.1
        VelocityComponent.y[bullet] = 0


      }
      shootingTimer = 0
    }
    return world;
  }
}
