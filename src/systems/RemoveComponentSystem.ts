import {defineQuery, removeComponent} from 'bitecs';
import {World} from '../main';
import { RemoveAttachment } from '../components/KillAfter';
import { AttachmentComponent } from '../components/Attachment';

/** Remove components from an entity that has been marked with removal tags at the end of the frame. */
export const removeComponentSystem = () => {
  const unparentQuery = defineQuery([RemoveAttachment]);

  return (world: World) => {
    for (const eid of unparentQuery(world)) {
      removeComponent(world, AttachmentComponent, eid);
    }

    return world;
  };
};
