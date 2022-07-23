import {defineQuery, hasComponent} from 'bitecs';
import {Transform} from '../components/Transform';
import {World} from '../main';
import {AttachmentComponent} from '../components/Attachment';

export const createAttachmentSystem = () => {
  const attachmentQuery = defineQuery([Transform, AttachmentComponent]);

  let done: number[] = [];
  const updatePosition = (world: World, eid: number) => {
    if (!hasComponent(world, AttachmentComponent, eid) || done.includes(eid)) {
      return;
    } else {
      const pid = AttachmentComponent.attachedTo[eid];
      updatePosition(world, pid);

      let offsetX = AttachmentComponent.offsetX[eid];
      let offsetY = AttachmentComponent.offsetY[eid];

      if (AttachmentComponent.offsetX[eid] !== 0 || AttachmentComponent.offsetY[eid]) {
        const s = Math.sin(Transform.rotation[pid]);
        const c = Math.cos(Transform.rotation[pid]);
        [offsetX, offsetY] = [offsetX * c - offsetY * s, offsetX * s + offsetY * c];
      }

      Transform.position.x[eid] = Transform.position.x[pid] + offsetX;
      Transform.position.y[eid] = Transform.position.y[pid] + offsetY;
      Transform.rotation[eid] = Transform.rotation[pid];

      done.push(eid);
      return;
    }
  };

  return (world: World) => {
    done = [];

    for (const eid of attachmentQuery(world)) {
      updatePosition(world, eid);
    }

    return world;
  };
};
