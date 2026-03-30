import { Injectable } from '@nestjs/common';
import { GameDataService } from 'src/modules/gamedata/gamedata.service';

@Injectable()
export class NarrativeService {
  constructor (
    private readonly gameData: GameDataService
  ) {}

  generateNarrative(result: any, _state) {
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
}
