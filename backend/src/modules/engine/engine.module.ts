import { Module } from '@nestjs/common';
import { GameEngineService } from './game-engine.service';
import { StateManagerService } from './state-manager.service';
import { GameDataService } from '../gamedata/gamedata.service';
import { GameDataModule } from '../gamedata/gamedata.module';

@Module({
  providers: [GameEngineService, StateManagerService],
  exports: [GameEngineService, StateManagerService],
  imports: [GameDataModule]
})
export class EngineModule {}