import {defineQuery, hasComponent, Not} from 'bitecs';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {AttachmentComponent} from '../components/Attachment';

export const referenceTransformSystem = () => {
  const attachmentQuery = defineQuery([Transform, AttachmentComponent]);
  const nonAttachedQuery = defineQuery([Transform, Not(AttachmentComponent)]);
  let done: number[] = [];

  const computeFinalPos = (eid: number) => {
    // Rotate local point about origin by theta, gets the displacement in parent's frame (if any)
    let c = 1;
    let s = 0;
    let rotatedX = Transform.position.x[eid];
    let rotatedY = Transform.position.y[eid];
    if (Transform.frameRotation[eid] !== 0) {
      s = Math.sin(Transform.frameRotation[eid]);
      c = Math.cos(Transform.frameRotation[eid]);
      [rotatedX, rotatedY] = [rotatedX * c - rotatedY * s, rotatedX * s + rotatedY * c];
    }
    // Offset own displacement by parent's displacement, gets the final global position
    Transform.finalPosition.x[eid] = rotatedX + Transform.origin.x[eid];
    Transform.finalPosition.y[eid] = rotatedY + Transform.origin.y[eid];
    // Resultant global rotation
    Transform.finalRotation[eid] = Transform.rotation[eid] + Transform.frameRotation[eid];
  };

  const updatePosition = (world: World, eid: number) => {
    // Has no parents or is already computed
    if (!hasComponent(world, AttachmentComponent, eid) || done.includes(eid)) {
      return;
    } else {
      const pid = AttachmentComponent.attachedTo[eid];
      updatePosition(world, pid);

      // Entity's local reference frame is parent's final transforms
      Transform.origin.x[eid] = Transform.finalPosition.x[pid];
      Transform.origin.y[eid] = Transform.finalPosition.y[pid];
      if (AttachmentComponent.applyParentRotation[eid]) {
        Transform.frameRotation[eid] = Transform.finalRotation[pid];
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
