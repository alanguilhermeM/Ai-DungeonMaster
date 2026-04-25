import { Injectable } from '@nestjs/common';
import { handleLook } from '../handlers/look.handler';
import { handleMove } from '../handlers/move.handler';
import { handleTalk } from '../handlers/talk.handler';
import { LocationResolve } from './location.resolver';
import { NpcResolve } from './npc.resolver';
import { GameDataService } from 'src/modules/gamedata/gamedata.service';
import { UseResolve } from './use.resolver';
import { handleUse } from '../handlers/use.handler';

@Injectable()
export class ActionResolve {
  constructor(
    readonly gameData: GameDataService,
    readonly resolveLocation: LocationResolve,
    readonly resolveNpc: NpcResolve,
    readonly resolveUse: UseResolve
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
        return handleUse(parsedAction, state, {
          gameData: this.gameData,
          resolve: this.resolveUse.resolve,
        })
      case 'INVALID_ACTION':
        return { type: 'INVALID_ACTION' };

      default:
        return { type: 'UNKNOWN' };
    }
  };
}
