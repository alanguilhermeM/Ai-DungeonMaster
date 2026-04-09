import { Injectable } from '@nestjs/common';
import { StateManagerService } from './state-manager.service';
import { GameDataService } from '../gamedata/gamedata.service';
import { ActionParserService } from './parser/action-parser.service';
import { NarrativeService } from './narrative/narrative.service';
import { ActionResolve } from './resolvers/action.resolver';
import { EventProcessorService } from './event-processor.service';

@Injectable()
export class GameEngineService {
  constructor(
    private readonly stateManager: StateManagerService,
    private readonly gameData: GameDataService,
    private readonly parseAction: ActionParserService,
    private readonly narrative: NarrativeService,
    private readonly resolveAction: ActionResolve,
    private readonly eventProcessor: EventProcessorService,
  ) {}

  async processAction(action: string) {
    const currentState = this.stateManager.getState();
    const parsedAction = this.parseAction.parse(action);

    const result = this.resolveAction.resolve(parsedAction, currentState);
    const newState = this.stateManager.updateState(result);

    const events = this.eventProcessor
      .processor(newState, result)
      .filter((event) => !newState.completedEvents.includes(event.id));

    events.forEach((event) => {
      this.eventProcessor.applyEffects(event, newState);
    });
    // console.log(this.stateManager.getState());

    const story = this.narrative.generateNarrative(result, newState, events);

    return {
      story,
      gameState: newState,
    };
  }
}
