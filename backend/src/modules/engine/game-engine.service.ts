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

    const events = this.eventProcessor.processor(newState, result);

    const executedEvents = [];

    const locationEvents = events.location;
    const actionEvents = events.action;
    const globalImmediateEvents = events.global.filter(
      (event) => event.timing === 'immediate',
    );

    const pending = [...newState.pendingEvents];
    newState.pendingEvents = [];

    pending.forEach((event) => {
      this.eventProcessor.applyEffects(event, newState);
      executedEvents.push(event);
    });

    newState.pendingEvents = [];

    locationEvents.forEach((event) => {
      this.eventProcessor.applyEffects(event, newState);
      executedEvents.push(event);
    });

    actionEvents.forEach((event) => {
      this.eventProcessor.applyEffects(event, newState);
      executedEvents.push(event);
    });

    if (globalImmediateEvents.length > 0) {
      globalImmediateEvents.forEach((event) => {
        this.eventProcessor.applyEffects(event, newState);
        executedEvents.push(event);
      });
    }

    const postEvents = this.eventProcessor.processor(newState, result);

    const nextTurnEvents = postEvents.global.filter(
      (event) => event.timing === 'next_turn',
    );

    nextTurnEvents.forEach((event) => {
      if (!newState.pendingEvents.find((e) => e.id === event.id)) {
        newState.pendingEvents.push(event);
      }
    });

    const story = this.narrative.generateNarrative(
      result,
      newState,
      executedEvents,
    );

    return {
      story,
      gameState: newState,
    };
  }
}
