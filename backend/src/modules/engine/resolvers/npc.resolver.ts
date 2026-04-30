import { Injectable } from '@nestjs/common';

@Injectable()
export class NpcResolve {
  resolve = (gameData, target, npcs) => {
    const npcId = this.resolveNpcTarget(target, npcs);
    const npc = gameData.data.npcs[npcId];
    if (!npc) {
      return {
        success: false,
        type: 'INVALID_TALK',
        hasEffect: false,
        blockedReason: 'invalid_npc',
        narrativeHint: 'Player tries to talk to someone who is not there',
      };
    }

    return {
      success: true,
      target: npcId,
      npc,
      hasEffect: false,
    };
  };

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
