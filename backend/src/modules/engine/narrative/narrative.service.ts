import { Injectable } from '@nestjs/common';
import { GameDataService } from 'src/modules/gamedata/gamedata.service';

@Injectable()
export class NarrativeService {
  constructor(private readonly gameData: GameDataService) {}

  generateNarrative(result: any, state, events: any) {
    const base = this.buildBaseNarrative(result)
    const eventText = this.buildEventsNarrative(events);
    const worldText = this.buildWorldNarrative(state);

    return [base, eventText, worldText]
      .filter(Boolean)
      .join('\n\n')
  }

  private buildBaseNarrative(result) {
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
          `Você segue em direção a ${location.name}`
        ];
        const random = variations[Math.floor(Math.random() * variations.length)];

        baseNarrative = location
          ? random
          : 'Você se move, mas algo parece estranho...';
        break;

      case 'TALK':
        baseNarrative = `Você começa a conversar com ${result.npc.name}`;
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
      eventsNarrative = events.map((event) => {
        const random = event.description[Math.floor(Math.random() * event.description.length)];
        return random;
      }).join('\n');
    }

    return eventsNarrative;
  }

  private buildWorldNarrative(state) {
    let worldNarrative = '';

    if (state.worldState.hospital = "suspeita") {
      worldNarrative = "O clima no hospital está estranho, como se algo estivesse errado."
    }

    return worldNarrative
  }
}
