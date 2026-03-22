import { Module } from '@nestjs/common';
import { GameEngineService } from './game-engine.service';
import { StateManagerService } from './state-manager.service';

@Module({
  providers: [GameEngineService, StateManagerService],
  exports: [GameEngineService],
})
export class EngineModule {}