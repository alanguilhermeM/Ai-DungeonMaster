import { Module } from '@nestjs/common';
import { ActionResolve } from './action.resolver';
import { GameDataModule } from 'src/modules/gamedata/gamedata.module';
import { LocationResolve } from './location.resolver';
import { NpcResolve } from './npc.resolver';

@Module({
  providers: [ActionResolve, LocationResolve, NpcResolve],
  exports: [ActionResolve, LocationResolve, NpcResolve],
  imports: [GameDataModule],
})
export class ResolverModule {}
