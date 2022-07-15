import {defineQuery, addEntity, addComponent} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {EnemyData} from '../components/EnemyData';
import {World} from '../main';

export const createEnemySystem = () => {

  const enemyQuery = defineQuery([Position, Velocity, EnemyData]);

  const shootingCooldown = 2000
  let shootingTimer = 0

  return (world: World) => {
    const {time: {delta}} = world;
    shootingTimer += delta
    if (shootingTimer > shootingCooldown) {


      for (const entity of enemyQuery(world)) {
        const x = Position.x[entity]
        const y = Position.y[entity]
      
            // create the player tank
        const bullet = addEntity(world)

        addComponent(world, Position, bullet)
        addComponent(world, Velocity, bullet)

        Position.x[bullet] = x
        Position.y[bullet] = y
        Velocity.x[bullet] = 0
        Velocity.y[bullet] = -0.05


      }
      shootingTimer = 0
    }
    return world;
  }
}
