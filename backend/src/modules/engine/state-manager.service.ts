import { Injectable } from '@nestjs/common';

@Injectable()
export class StateManagerService {
  private state = {
    currentLocation: 'hospital_quarto_203',
    currentScene: 'scene_despertar',
    inventory: [],
    flags: {},
  };

  getState() {
    return this.state;
  }

  updateState(actionResult: any) {
    // exemplo simples: não altera nada ainda
    return this.state;
  }
}