import { Injectable } from '@nestjs/common';
import { GameDataService } from 'src/modules/gamedata/gamedata.service';
import { NarrativeEngineService } from '../narrative-engine.service';

@Injectable()
export class NarrativeService {
  constructor(private readonly gameData: GameDataService, readonly narrativeIa: NarrativeEngineService) {}

  async generateNarrative(result: any, state, events: any) {
    const base = this.buildBaseNarrative(result, state);
    const eventText = this.buildEventsNarrative(events);
    const worldNarrative = state.pendingNarratives;

    const context = this.buildNarrativeContext(result, state, events, worldNarrative)
    console.log(context)
    const iaNarrative = await this.narrativeIa.generateNarrativeIA(context);
    console.log(iaNarrative)

    if (worldNarrative.length > 0) {
      const narrative = [base, eventText, worldNarrative.join('\n\n')]
        .filter(Boolean)
        .join('\n\n');
      state.pendingNarratives = [];
      return narrative;
    }

    return [base, eventText].filter(Boolean).join('\n\n');
  }

  private buildBaseNarrative(result, state) {
    let baseNarrative = '';

    switch (result.type) {
      case 'LOOK':
        baseNarrative = result.location.description;
        break;

      case 'MOVE':
        const location = this.gameData.getLocation(result.target);
        const variationsMove = [
          `Você se move para ${location.name}`,
          `Você caminha até ${location.name}`,
          `Você segue em direção a ${location.name}`,
        ];
        const randomMove =
          variationsMove[Math.floor(Math.random() * variationsMove.length)];

        baseNarrative = location
          ? randomMove
          : 'Você se move, mas algo parece estranho...';
        break;
      case 'USE':
        break;
      case 'TALK':
        baseNarrative = this.buildTalkNarrative(result, state);
        break;

      case 'INVALID_MOVE':
        baseNarrative = 'Você não pode ir para esse lugar.';
        break;

      case 'NPC_NOT_FOUND':
        baseNarrative = 'Não há ninguém assim aqui.';
        break;

      case 'INVALID_ACTION':
        baseNarrative = 'Você não sabe como fazer isso.';
        break;

      case 'INVALID_USE':
        baseNarrative = 'Você não pode usar isso aqui';
        break;

      default:
        baseNarrative = 'Nada acontece.';
    }

    return baseNarrative;
  }

  private buildEventsNarrative(events) {
    let eventsNarrative = '';

    if (events && events.length > 0) {
      eventsNarrative = events
        .map((event) => {
          const random =
            event.description[
              Math.floor(Math.random() * event.description.length)
            ];
          return random;
        })
        .join('\n');
    }

    return eventsNarrative;
  }

  buildWorldNarrative(key: string, value: string) {
    if (key === 'hospital') {
      if (value === 'suspeita') {
        let worldNarrative =
          'O clima no hospital está estranho, como se algo estivesse errado.';

        return worldNarrative;
      }
    }

    return undefined;
  }

  buildTalkNarrative(result, state) {
    const npcTarget = result.npc;
    const hospitalState = state.worldState.hospital;
    const time = state.worldState.time;
    const keys = [
      `hospital_${hospitalState}_time_${time}`,
      `hospital_${hospitalState}`,
      `time_${time}`,
      'default',
    ];

    for (const key of keys) {
      if (npcTarget.dialogues[key]) {
        const dialogue =
          npcTarget.dialogues[key][
            Math.floor(Math.random() * npcTarget.dialogues[key].length)
          ];
        return dialogue;
      }
    }
  }

  buildNarrativeContext(result, state, events, pendingNarratives) {
    const currentLocation =
      result.location ?? this.gameData.getLocation(state.currentLocation);

    return {
      action: {
        type: result.type,
        input: result.input ?? result.raw?.input,
        target: result.target,
        item: result.item,
      },

      result: {
        success: result.success,
        hasEffect: result.hasEffect,
        blockedReason: result.blockedReason,
        narrativeHint: result.narrativeHint,
      },

      location: currentLocation
        ? {
            id: currentLocation.id,
            name: currentLocation.name,
            description: currentLocation.description,
          }
        : null,

      player: {
        inventory: state.player.inventory,
        discoveredClues: state.discoveredClues,
      },

      worldState: state.worldState,

      events: {
        executedEvents: Array.isArray(events)
          ? events.map((event) => ({
              id: event.id,
              name: event.name,
              description: event.description,
            }))
          : [],
        pendingNarratives,
      },
    };
  }
}
