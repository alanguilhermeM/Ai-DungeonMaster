import { Injectable } from '@nestjs/common';
import { GameEngineService } from '../engine/game-engine.service';

@Injectable()
export class GameService {
  constructor(private engine: GameEngineService) {}

  async handleAction(action: string) {
    return this.engine.processAction(action);
  }
}