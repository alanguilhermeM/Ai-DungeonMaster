import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './modules/ai/ai.module';
import { GameModule } from './modules/game/game.module';
import { GameDataModule } from './modules/gamedata/gamedata.module';
import { EngineModule } from './modules/engine/engine.module';

@Module({
  imports: [
    GameModule,
    GameDataModule,
    EngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
