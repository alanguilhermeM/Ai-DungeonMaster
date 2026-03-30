import { Injectable } from '@nestjs/common';

@Injectable()
export class NpcResolve {
  resolveNpcTarget = (target: string, npcs: string[]) => {
    const normalized = target.toLowerCase();

    for (const npcId of npcs) {
      if (npcId.includes(normalized)) {
        return npcId;
      }
    }

    return null;
  };
}
