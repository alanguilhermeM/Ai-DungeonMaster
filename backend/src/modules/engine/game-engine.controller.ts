import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameEngineService } from './game-engine.service';

@Controller('game')
export class GameController {
  constructor(private engine: GameEngineService) {}

  @Post('action')
  handleAction(@Body('action') action: string) {
    return this.engine.processAction(action);
  }
}