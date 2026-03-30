import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameEngineService } from './game-engine.service';
import { StateManagerService } from './state-manager.service';
import { EventProcessorService } from './event-processor.service';

@Controller('game')
export class GameController {
  constructor(
    private engine: GameEngineService,
    private event: EventProcessorService,
    private readonly stateManager: StateManagerService,
  ) {}

  @Post('action')
  handleAction(@Body('action') action: string) {
    return this.engine.processAction(action);
  }

  @Get('event')
  handleEvent() {
    const state = this.stateManager.getState();
    // console.log('state: ', state)
    return this.event.processor(state, {
      type: 'MOVE',
      target: state.currentLocation,
    });
  }
}
