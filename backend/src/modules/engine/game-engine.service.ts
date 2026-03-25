import { Injectable } from '@nestjs/common';
import { StateManagerService } from './state-manager.service';
import { GameDataService } from '../gamedata/gamedata.service';

@Injectable()
export class GameEngineService {
  constructor(private readonly stateManager: StateManagerService, readonly gameData: GameDataService) {}

  async processAction(action: string) {
    // 1. pegar estado atual
    const currentState = this.stateManager.getState();
    const parsedAction = this.parseAction(action);

    // 2. processar ação (simplificado por agora)
    const result = this.resolveAction(parsedAction, currentState);

    // 3. atualizar estado
    const newState = this.stateManager.updateState(result);

    // 4. gerar narrativa (placeholder por enquanto)
    const story = this.generateNarrative(result);

    return {
      story,
      gameState: newState,
    };
  }

  private resolveAction(parseAction: any, state: any) {

    return {
      type: 'OBSERVE',
      input: parseAction.input
    };
  }

  parseAction(action: string) {
    return {
      type: "GENERIC",
      input: action
    };
  }

  private generateNarrative(result: any) {
    return `Você decide: ${result.input}`;
  }
}
