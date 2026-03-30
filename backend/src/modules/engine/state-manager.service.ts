import { Injectable } from '@nestjs/common';
import { GameDataService } from '../gamedata/gamedata.service';

@Injectable()
export class StateManagerService {
  constructor(private gameData: GameDataService) {}
  private state: any;

  getState() {
    if (!this.state) {
      const template = this.gameData.getGameStateTemplate();
  
      if (!template || Object.keys(template).length === 0) {
        throw new Error('GameStateTemplate ainda não carregado');
      }
  
      this.state = structuredClone(template);
    }
  
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
