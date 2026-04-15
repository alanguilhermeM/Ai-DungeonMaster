import { Injectable } from '@nestjs/common';
import { GameDataService } from 'src/modules/gamedata/gamedata.service';

@Injectable()
export class NarrativeService {
  constructor(private readonly gameData: GameDataService) {}

  generateNarrative(result: any, state, events: any) {
    const base = this.buildBaseNarrative(result, state);
    const eventText = this.buildEventsNarrative(events);
    const worldNarrative = state.pendingNarratives

    if(worldNarrative.length > 0) {
      const narrative = [base, eventText, worldNarrative.join('\n\n')].filter(Boolean).join('\n\n');
      state.pendingNarratives = []
      return narrative
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
        const variations = [
          `Você se move para ${location.name}`,
          `Você caminha até ${location.name}`,
          `Você segue em direção a ${location.name}`,
        ];
        const random =
          variations[Math.floor(Math.random() * variations.length)];

        baseNarrative = location
          ? random
          : 'Você se move, mas algo parece estranho...';
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
      "default"
    ]

    for (const key of keys) {
      if(npcTarget.dialogues[key]) {
        const dialogue = npcTarget.dialogues[key][(Math.floor(Math.random() * npcTarget.dialogues[key].length))];
        console.log(dialogue)
        return dialogue
      }
    }
  }
}
