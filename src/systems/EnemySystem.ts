import {defineQuery, addEntity, addComponent} from 'bitecs';
import {Velocity} from '../components/Velocity';
import {Position} from '../components/Position';
import {EnemyData} from '../components/EnemyData';
import {GraphicsCircle} from '../components/GraphicsCircle';
import {World} from '../main';

export const createEnemySystem = () => {

  const enemyQuery = defineQuery([Position, Velocity, EnemyData]);

  const shootingCooldown = 1000
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
        addComponent(world, GraphicsCircle, bullet);
        GraphicsCircle.color[bullet] = 0xff0000;
        GraphicsCircle.radius[bullet] = 10;

        Position.x[bullet] = x
        Position.y[bullet] = y
        Velocity.x[bullet] = 0.05
        Velocity.y[bullet] = 0


      }
      shootingTimer = -10000000
    }
    return world;
  }
}
