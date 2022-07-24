import {defineQuery, removeComponent} from 'bitecs';
import {World} from '../main';
import { Unparent } from '../components/KillAfter';
import { AttachmentComponent } from '../components/Attachment';

export const removeComponentSystem = () => {
  const unparentQuery = defineQuery([Unparent]);

  return (world: World) => {
    for (const eid of unparentQuery(world)) {
      removeComponent(world, AttachmentComponent, eid);
    }

    return world;
  };
};
