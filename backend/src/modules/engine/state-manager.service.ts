import { Injectable } from '@nestjs/common';
import { GameDataService } from '../gamedata/gamedata.service';

@Injectable()
export class StateManagerService {
  constructor(private gameData: GameDataService) {}
  private state: any;

  async onModuleInit() {
    await new Promise((resolve) => setTimeout(resolve, 50)); // workaround simples

    this.state = structuredClone(this.gameData.getGameStateTemplate());
  }

  getState() {
    return this.state;
  }

  updateState(result: any) {
    switch (result.type) {
      case 'MOVE': {
        this.state.previousLocation = this.state.currentLocation;
        this.state.currentLocation = result.target;
        return this.state;
      }

      default:
        return this.state
    } 
  }
}
