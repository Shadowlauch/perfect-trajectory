import {defineQuery, removeEntity} from 'bitecs';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';
import {BulletComponent} from '../components/BulletComponent';

export const createBulletCleanUpSystem = () => {
    const bulletQuery = defineQuery([TransformComponent, BulletComponent]);

    return (world: World) => {
      const {size: {width, height}} = world;

      const offset = 100;
      const bullets = bulletQuery(world);
      for (const bulletId of bullets) {
        const x = TransformComponent.globalPosition.x[bulletId];
        const y = TransformComponent.globalPosition.y[bulletId];
        if (x < -offset || x > width + offset || y < -offset || y > height + offset) removeEntity(world, bulletId);

      }

      return world;
    }

}
