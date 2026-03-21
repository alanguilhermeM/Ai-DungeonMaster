import { Controller, Post, Body } from '@nestjs/common';
// import { gameService } from './game.service'

@Controller('Game')
export class GameController {
  @Post('action')
  handleAction(@Body() body: { action: string }) {
    return this.gameService.handleAction(body.action);
  }
}
