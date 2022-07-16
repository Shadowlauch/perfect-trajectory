import {defineQuery, enterQuery, exitQuery} from 'bitecs';
import {Position} from '../components/Position';
import {World} from '../main';
import {CollisionComponent} from '../components/Collision';
import {Circle, System, Body} from 'detect-collisions';
import {Player} from '../components/Player';

export const createCollisionSystem = () => {
  const collisionQuery = defineQuery([Position, CollisionComponent]);
  const enterCollisionQuery = enterQuery(collisionQuery);
  const exitCollisionQuery = exitQuery(collisionQuery);
  const playerQuery = defineQuery([Player]);
  const circleMap: Map<number, Body> = new Map();
  const eidMap: Map<Body, number> = new Map();
  const system = new System();

  return (world: World) => {
    for (const eid of enterCollisionQuery(world)) {
      const circle = new Circle({x: Position.x[eid], y: Position.y[eid]}, CollisionComponent.radius[eid]);
      system.insert(circle);
      circleMap.set(eid, circle);
      eidMap.set(circle, eid);
    }

    for (const eid of collisionQuery(world)) {
      circleMap.get(eid)?.setPosition(Position.x[eid], Position.y[eid]);
    }

    for (const eid of exitCollisionQuery(world)) {
      const circle = circleMap.get(eid)!;
      system.remove(circle);
      circleMap.delete(eid);
      eidMap.delete(circle);
    }

    system.update();

    const playerEid = playerQuery(world)[0];
    const playerCircle = circleMap.get(playerEid)!;
    const filter = CollisionComponent.filter[playerEid];
    const potentials = system.getPotentials(playerCircle);
    for (const potential of potentials) {
      const potEid = eidMap.get(potential)!;
      const group = CollisionComponent.group[potEid];
      if ((filter & group) > 0 && system.checkCollision(playerCircle, potential)) {
        console.log(system.response)
      }
    }
    return world;
  }
}
