import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(private engine: GameEngineService) {}

  async handleAction(action: string) {
    return this.engine.processAction(action);
  }
}