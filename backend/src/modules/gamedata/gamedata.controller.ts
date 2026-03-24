import { Controller, Get } from '@nestjs/common';
import { GameDataService } from './gamedata.service';
import * as path from 'path';

@Controller('gamedata')
export class GameDataController {
  constructor(private readonly gameDataService: GameDataService) {}

  @Get('loadAll')
  async loadAll() {
    await this.gameDataService.loadAll();
    return { message: 'Game data carregado com sucesso' };
  }

  @Get('npcs')
  getNPCs() {
    return this.gameDataService.getNPC('a');
  }
}
