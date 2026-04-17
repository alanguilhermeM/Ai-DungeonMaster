import { Injectable } from '@nestjs/common';
import { handleLook } from '../handlers/look.handler';
import { handleMove } from '../handlers/move.handler';
import { handleTalk } from '../handlers/talk.handler';
import { LocationResolve } from './location.resolver';
import { NpcResolve } from './npc.resolver';
import { GameDataService } from 'src/modules/gamedata/gamedata.service';

@Injectable()
export class ActionResolve {
  constructor(
    readonly gameData: GameDataService,
    readonly resolveLocation: LocationResolve,
    readonly resolveNpc: NpcResolve,
  ) {}
  resolve = (parsedAction: any, state: any) => {
    switch (parsedAction.type) {
      case 'LOOK':
        return handleLook(state, this.gameData);

      case 'MOVE':
        return handleMove(parsedAction, state, {
          gameData: this.gameData,
          resolveLocationTarget: this.resolveLocation.resolveLocationTarget,
        });

      case 'TALK':
        return handleTalk(parsedAction, state, {
          gameData: this.gameData,
          resolveNpcTarget: this.resolveNpc.resolveNpcTarget,
        });
      case 'USE':

        // console.log(this.resolveLocation.)
      case 'INVALID_ACTION':
        return { type: 'INVALID_ACTION' };

      default:
        return { type: 'UNKNOWN' };
    }
  };
}
