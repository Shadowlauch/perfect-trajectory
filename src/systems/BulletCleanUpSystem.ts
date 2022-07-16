import {defineQuery, removeEntity} from 'bitecs';
import {Position} from '../components/Position';
import {World} from '../main';
import {BulletComponent} from '../components/Bullet';

export const createBulletCleanUpSystem = () => {
    const bulletQuery = defineQuery([Position, BulletComponent]);

    return (world: World) => {
      const {size: {width, height}} = world;

      const offset = 100;
      const bullets = bulletQuery(world);
      for (const bulletId of bullets) {
        const x = Position.x[bulletId];
        const y = Position.y[bulletId];
        if (x < -offset || x > width + offset || y < -offset || y > height + offset) removeEntity(world, bulletId);

      }

      return world;
    }

}
