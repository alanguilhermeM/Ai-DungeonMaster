import { Module } from '@nestjs/common';
import { GameEngineService } from './game-engine.service';
import { StateManagerService } from './state-manager.service';
import { GameDataService } from '../gamedata/gamedata.service';
import { GameDataModule } from '../gamedata/gamedata.module';
import { ActionParserModule } from './parser/action-parse.module';
import { NarrativeModule } from './narrative/narrative.module';
import { ResolverModule } from './resolvers/resolver.module';
import { EventProcessorService } from './event-processor.service';
import { GameController } from './game-engine.controller';

@Module({
  controllers: [GameController],
  providers: [GameEngineService, StateManagerService, EventProcessorService],
  exports: [GameEngineService, StateManagerService, EventProcessorService],
  imports: [
    GameDataModule,
    ActionParserModule,
    NarrativeModule,
    ResolverModule,
  ],
})
export class EngineModule {}
