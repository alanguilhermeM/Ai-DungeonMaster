import { Module } from '@nestjs/common';
import { GameDataController } from './gamedata.controller';
import { GameDataService } from './gamedata.service';

@Module({
  controllers: [GameDataController],
  providers: [GameDataService],
  exports: [GameDataService]
})
export class GameDataModule {}
