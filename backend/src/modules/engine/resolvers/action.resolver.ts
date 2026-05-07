import { Injectable } from '@nestjs/common';
import { handleLook } from '../handlers/look.handler';
import { handleMove } from '../handlers/move.handler';
import { handleTalk } from '../handlers/talk.handler';
import { LocationResolve } from './location.resolver';
import { NpcResolve } from './npc.resolver';
import { GameDataService } from 'src/modules/gamedata/gamedata.service';
import { UseResolve } from './use.resolver';
import { handleUse } from '../handlers/use.handler';
import { InteractionResult } from './interfaces/action-resolve.interface';

@Injectable()
export class ActionResolve {
  constructor(
    readonly gameData: GameDataService,
    readonly resolveLocation: LocationResolve,
    readonly resolveNpc: NpcResolve,
    readonly resolveUse: UseResolve,
  ) {}

  resolve = (parsedAction: any, state: any): InteractionResult => {
    let result;

    switch (parsedAction.type) {
      case 'LOOK':
        result = handleLook(state, this.gameData);
        break;

      case 'MOVE':
        result = handleMove(parsedAction, state, {
          gameData: this.gameData,
          resolve: this.resolveLocation.resolve,
        });
        break;

      case 'TALK':
        result = handleTalk(parsedAction, state, {
          gameData: this.gameData,
          resolve: this.resolveNpc.resolve,
        });
        break;

      case 'USE':
        result = handleUse(parsedAction, state, {
          gameData: this.gameData,
          resolve: this.resolveUse.resolve,
        });
        break;

      case 'INVALID_ACTION':
        result = {
          success: false,
          type: 'INVALID_ACTION',
          blockedReason: 'invalid_action',
          narrativeHint: 'The player attempted an invalid action.',
        };
        break;

      default:
        result = {
          success: false,
          type: 'UNKNOWN',
          blockedReason: 'unknown_action',
          narrativeHint:
            'The player attempted something the system could not understand.',
        };
    }

    return this.toInteractionResult(result, parsedAction);
  };

  private toInteractionResult(result: any, parsedAction: any): InteractionResult {
    return {
      ...result,

      success: result.success ?? true,
      type: result.type ?? parsedAction.type,

      action: result.action ?? parsedAction.action ?? parsedAction.type,
      input: result.input ?? parsedAction.input,

      item: result.item ?? parsedAction.item,
      target: result.target ?? parsedAction.target,

      hasEffect: result.hasEffect ?? Boolean(result.effects),
      effects: result.effects ?? {},

      blockedReason: result.blockedReason ?? null,
      missingRequirements: result.missingRequirements ?? [],

      narrativeHint:
        result.narrativeHint ??
        result.message ??
        `${parsedAction.type} action resolved.`,
    };
  }
}