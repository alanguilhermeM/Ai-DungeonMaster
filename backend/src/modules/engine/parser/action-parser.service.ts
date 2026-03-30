import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionParserService {
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

  parse(action: string) {
    const normalized = action.toLowerCase();
    const resolved = this.resolveActionAliases(action);

    switch (resolved) {
      case 'MOVE': {
        if (normalized.includes('voltar')) {
          return {
            type: 'MOVE',
            target: 'back',
            input: action,
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

  resolveActionAliases(action) {
    const words = action.toLowerCase().split(' ');

    for (const [actionId, data] of Object.entries(this.actionsAliases)) {
      if (data.aliases.some((alias) => words.includes(alias))) {
        return actionId;
      }
    }

    return null;
  }
}
