import {defineQuery, hasComponent, Not} from 'bitecs';
import {TransformComponent} from '../components/TransformComponent';
import {World} from '../main';
import {AttachmentComponent} from '../components/AttachmentComponent';

export const referenceTransformSystem = () => {
  const attachmentQuery = defineQuery([TransformComponent, AttachmentComponent]);
  const nonAttachedQuery = defineQuery([TransformComponent, Not(AttachmentComponent)]);
  let done: number[] = [];

  const computeFinalPos = (eid: number) => {
    // Rotate local point about origin by theta, gets the displacement in parent's frame (if any)
    let c = 1;
    let s = 0;
    let rotatedX = TransformComponent.position.x[eid];
    let rotatedY = TransformComponent.position.y[eid];
    if (TransformComponent.frameRotation[eid] !== 0) {
      s = Math.sin(TransformComponent.frameRotation[eid]);
      c = Math.cos(TransformComponent.frameRotation[eid]);
      [rotatedX, rotatedY] = [rotatedX * c - rotatedY * s, rotatedX * s + rotatedY * c];
    }
    // Offset own displacement by parent's displacement, gets the final global position
    TransformComponent.globalPosition.x[eid] = rotatedX + TransformComponent.origin.x[eid];
    TransformComponent.globalPosition.y[eid] = rotatedY + TransformComponent.origin.y[eid];
    // Resultant global rotation
    TransformComponent.globalRotation[eid] = TransformComponent.rotation[eid] + TransformComponent.frameRotation[eid];
  };

  const updatePosition = (world: World, eid: number) => {
    // Has no parents or is already computed
    if (!hasComponent(world, AttachmentComponent, eid) || done.includes(eid)) {
      return;
    } else {
      const pid = AttachmentComponent.attachedTo[eid];
      updatePosition(world, pid);

      // Entity's local reference frame is parent's final transforms
      TransformComponent.origin.x[eid] = TransformComponent.globalPosition.x[pid];
      TransformComponent.origin.y[eid] = TransformComponent.globalPosition.y[pid];
      if (AttachmentComponent.applyParentRotation[eid]) {
        TransformComponent.frameRotation[eid] = TransformComponent.globalRotation[pid];
      }

      // Compute final positions of this entity after all reference frame manipulations.
      // Don't do any movement-modifying stuff after this in systems following this one.
      computeFinalPos(eid);

      done.push(eid);
      return;
    }
  };

  return (world: World) => {
    done = [];

    // MovementSystem has already updated all local transforms.
    // First compute root entities' final positions (i.e., has no parents).
    for (const eid of nonAttachedQuery(world)) {
      computeFinalPos(eid);
    }

    // Now that all root entities' final positions have been computed,
    // update all attached entities' final positionns.
    for (const eid of attachmentQuery(world)) {
      updatePosition(world, eid);
    }

    return world;
  };
};
