import { Module } from '@nestjs/common';
import { NarrativeService } from './narrative.service';
import { GameDataModule } from 'src/modules/gamedata/gamedata.module';
import { NarrativeEngineService } from '../narrative-engine.service';
import { AiModule } from 'src/modules/ai/ai.module';

@Module({
  providers: [NarrativeService, NarrativeEngineService],
  exports: [NarrativeService],
  imports: [GameDataModule, AiModule]
})
export class NarrativeModule {}