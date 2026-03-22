import { Controller, Post, Body } from '@nestjs/common';
import { GameService } from './game.service'

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('action')
  handleAction(@Body() body: { action: string }) {
    return this.gameService.handleAction(body.action);
  }
}
