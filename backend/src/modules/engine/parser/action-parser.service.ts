import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionParserService {
  private actionsAliases = {
    LOOK: {
      aliases: ['olhar', 'observar', 'ver', 'examinar', 'analisar'],
    },
    MOVE: {
      aliases: ['andar', 'caminhar', 'vou', 'mover', 'voltar'],
    },
    TALK: {
      aliases: ['falar', 'dizer', 'conversar', 'dialogar', 'comunicar'],
    },
    USE: {
      aliases: ['usar', 'utilizar', 'manusear', 'manejar'],
    }
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
      case 'LOOK': {
        return { type: 'LOOK', input: action };
      }
      case 'USE': {
        const phrase = normalized
          .replace(/usar|manusear|utilizar|manejar/g, '')
          .trim();
      
        const parts = phrase.split(/\b(?:na|no|em|nos|nas)\b/);
      
        if (parts.length < 2) {
          return { type: 'INVALID_ACTION', input: action };
        }
      
        const item = parts[0].trim();
        const target = parts[1].trim();
      
        return {
          type: 'USE',
          item,
          target,
          input: action,
        };
      }
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
