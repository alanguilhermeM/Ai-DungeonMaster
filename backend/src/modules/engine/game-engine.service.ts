import { Injectable } from '@nestjs/common';
import { StateManagerService } from './state-manager.service';
import { GameDataService } from '../gamedata/gamedata.service';
import { handleMove } from './handlers/gameEngine-handler';

@Injectable()
export class GameEngineService {
  constructor(
    private readonly stateManager: StateManagerService,
    private readonly gameData: GameDataService,
  ) {}

  private locationsAliases = {
    hospital_corredor_segundo_andar: {
      aliases: ['corredor', 'corredor do hospital', 'segundo andar'],
    },
    hospital_enfermaria: {
      aliases: ['enfermaria', 'enfermagem'],
    },
    hospital_quarto_203: {
      aliases: ['quarto', 'quarto 203'],
    }
  };

  private actionsAliases = {
    LOOK: {
      aliases: ['olhar', 'observar', 'ver', 'examinar', 'analisar'],
    },
    MOVE: {
      aliases: ['ir', 'andar', 'caminhar', 'vou', 'mover', 'voltar'],
    },
    TALK: {
      aliases: ['falar', 'dizer', 'conversar', 'dialogar', 'comunicar'],
    },
  };

  async processAction(action: string) {
    const currentState = this.stateManager.getState();
    const parsedAction = this.parseAction(action);

    console.log('state atual', currentState)
    const result = this.resolveAction(parsedAction, currentState);

    const newState = this.stateManager.updateState(result);

    const story = this.generateNarrative(result, newState);

    // console.log({
    //   parsedAction,
    //   result,
    // });
    return {
      story,
      gameState: newState,
    };
  }

  private resolveAction(parsedAction: any, state: any) {
    switch (parsedAction.type) {
      case 'LOOK':
        return this.handleLook(state);

      case 'MOVE':
        return this.handleMove(
          parsedAction,
          state
        );

      case 'TALK':
        return this.handleTalk(parsedAction, state);

      case 'INVALID_ACTION':
        return { type: 'INVALID_ACTION' };

      default:
        return { type: 'UNKNOWN' };
    }
  }

  resolveLocationTarget(target: string) {
    const normalized = target.toLowerCase();

    for (const [locationId, data] of Object.entries(this.locationsAliases)) {
      if (data.aliases.some((alias) => normalized.includes(alias))) {
        return locationId;
      }
    }

    return null;
  }

  resolveActionAliases(action) {
    const words = action.toLowerCase().split(' ');

    for (const [actionId, data] of Object.entries(this.actionsAliases)) {
      if (data.aliases.some((alias) => words.includes(alias))) {
        return actionId;
      }
    }

    return null;
  }

  resolveNpcTarget(target: string, npcs: string[]) {
    const normalized = target.toLowerCase();

    for (const npcId of npcs) {
      if (npcId.includes(normalized)) {
        return npcId;
      }
    }

    return null;
  }

  parseAction(action: string) {
    const normalized = action.toLowerCase();
    const resolved = this.resolveActionAliases(action);

    switch (resolved) {
      case 'MOVE': {

        if (normalized.includes('voltar')) {
          return {
            type: 'MOVE',
            target: 'back',
            input: action
          };
        }

        const target = normalized
          .replace(/ir|andar|caminhar|vou/g, '')
          .replace('para', '')
          .trim();

        return {
          type: 'MOVE',
          target,
          input: action,
        };
      }

      case 'TALK': {
        const target = normalized
          .replace(/falar com|conversar com|dizer a|dialogar com/g, '')
          .trim();

        return {
          type: 'TALK',
          target,
          input: action,
        };
      }
      case 'LOOK':
        return { type: 'LOOK', input: action };

      default:
        return { type: 'INVALID_ACTION', input: action };
    }
  }

  private generateNarrative(result: any, _state) {
    switch (result.type) {
      case 'LOOK':
        return result.location.description;

      case 'MOVE':
        const location = this.gameData.getLocation(result.target);

        if (!location) {
          return 'Você se move, mas algo parece estranho...';
        }
        return `Você se move para ${location.name}`;

      case 'TALK':
        return `Você começa a conversar com ${result.npc.name}`;

      case 'INVALID_MOVE':
        // console.log(this.gameData.getGameStateTemplate())
        return 'Você não pode ir para esse lugar.';

      case 'NPC_NOT_FOUND':
        return 'Não há ninguém assim aqui.';
      case 'INVALID_ACTION':
        return 'Você não sabe como fazer isso.';

      default:
        return 'Nada acontece.';
    }
  }

  handleLook(state) {
    const location = this.gameData.getLocation(state.currentLocation);

    if (!location) {
      return { type: 'INVALID_ACTION' };
    }
    return {
      type: 'LOOK',
      location,
    };
  }

  handleTalk(parsedAction, state) {
    const location = this.gameData.getLocation(state.currentLocation);

    if (!location) {
      return { type: 'INVALID_ACTION' };
    }

    const npcs = location.npcs || [];

    const target = parsedAction.target;
    if (!target) {
      return {
        type: 'INVALID_ACTION',
      };
    }

    const resolvedNpc = this.resolveNpcTarget(target, npcs);

    if (!resolvedNpc) {
      return { type: 'NPC_NOT_FOUND' };
    }

    const npc = this.gameData.getNPC(resolvedNpc);

    return {
      type: 'TALK',
      npcId: resolvedNpc,
      npc,
    };
  }

  handleMove(parsedAction, state: any) {
    const currentLocation = this.gameData.getLocation(state.currentLocation);

    if (!currentLocation) {
      return { type: 'INVALID_MOVE' };
    }

    const possibleMoves = currentLocation.connections;
    console.log('currentLocation: ', currentLocation)
    // console.log(possibleMoves)
    const target = parsedAction.target;
    // console.log(target)
    if (!target) {
      return {
        type: 'INVALID_MOVE',
      };
    }

    if (target === 'back') {
      const previous = state.previousLocation;
    
      if (!previous) {
        return { type: 'INVALID_MOVE' };
      }
    
      return {
        type: 'MOVE',
        target: previous
      };
    }

    const resolved = this.resolveLocationTarget(target);
    console.log(resolved)
    if (!resolved || !possibleMoves.includes(resolved)) {
      return {
        type: 'INVALID_MOVE',
      };
    }


    return {
      type: 'MOVE',
      target: resolved,
    };
  }
}
