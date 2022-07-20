import {defineQuery, removeEntity} from 'bitecs';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {BulletComponent} from '../components/Bullet';

export const createBulletCleanUpSystem = () => {
    const bulletQuery = defineQuery([Transform, BulletComponent]);

    return (world: World) => {
      const {size: {width, height}} = world;

      const offset = 100;
      const bullets = bulletQuery(world);
      for (const bulletId of bullets) {
        const x = Transform.position.x[bulletId];
        const y = Transform.position.y[bulletId];
        if (x < -offset || x > width + offset || y < -offset || y > height + offset) removeEntity(world, bulletId);

      }

      return world;
    }

}
