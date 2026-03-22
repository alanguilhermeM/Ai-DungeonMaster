import { Injectable } from '@nestjs/common';
import { StateManagerService } from './state-manager.service';

@Injectable()
export class GameEngineService {
  constructor(private readonly stateManager: StateManagerService) {}

  async processAction(action: string) {
    // 1. pegar estado atual
    const currentState = this.stateManager.getState();

    // 2. processar ação (simplificado por agora)
    const result = this.resolveAction(action, currentState);

    // 3. atualizar estado
    const newState = this.stateManager.updateState(result);

    // 4. gerar narrativa (placeholder por enquanto)
    const story = this.generateNarrative(result);

    return {
      story,
      gameState: newState,
    };
  }

  private resolveAction(action: string, state: any) {
    // versão inicial: só ecoa ação
    return {
      type: 'generic',
      input: action,
    };
  }

  private generateNarrative(result: any) {
    return `Você decide: ${result.input}`;
  }
}
