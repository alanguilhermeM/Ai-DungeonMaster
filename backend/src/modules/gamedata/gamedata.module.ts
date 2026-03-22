import { Module } from '@nestjs/common';
// import { GameDataController } from './gamedata.controller';
import { GameDataService } from './gamedata.service';

@Module({
//   controllers: [GameController],
  providers: [GameDataService],
})
export class GameDataModule {}
