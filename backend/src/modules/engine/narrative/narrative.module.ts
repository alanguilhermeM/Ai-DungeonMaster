import { Module } from '@nestjs/common';
import { NarrativeService } from './narrative.service';
import { GameDataService } from '../../gamedata/gamedata.service';
import { GameDataModule } from 'src/modules/gamedata/gamedata.module';

@Module({
  providers: [NarrativeService],
  exports: [NarrativeService],
  imports: [GameDataModule]
})
export class NarrativeModule {}