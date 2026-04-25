import { Module } from '@nestjs/common';
import { ActionResolve } from './action.resolver';
import { GameDataModule } from 'src/modules/gamedata/gamedata.module';
import { LocationResolve } from './location.resolver';
import { NpcResolve } from './npc.resolver';
import { UseResolve } from './use.resolver';

@Module({
  providers: [ActionResolve, LocationResolve, NpcResolve, UseResolve],
  exports: [ActionResolve, LocationResolve, NpcResolve, UseResolve],
  imports: [GameDataModule],
})
export class ResolverModule {}
