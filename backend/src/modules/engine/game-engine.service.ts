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
    console.log(result)
    const newState = this.stateManager.updateState(result);

    const events = this.eventProcessor.processor(newState, result);
    const executedEvents = [];

    this.prePhase(newState, executedEvents);
    this.mainPhase(newState, events, executedEvents);
    this.postPhase(newState, result);
  
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

  private prePhase(state, executedEvents) {
    const pending = [...state.pendingEvents];

    pending.forEach((event) => {
      this.eventProcessor.applyEffects(event, state);
      executedEvents.push(event);
    });

    state.pendingEvents = [];
  }

  private mainPhase(state, events, executedEvents) {
    const locationEvents = events.location;
    const locationEventsByMaxPriority = this.filterEventsByPriority(locationEvents);

    const globalImmediateEvents = events.global.filter(
      (event) => event.timing === 'immediate',
    );
    const globalImmediateEventsByMaxPriority = this.filterEventsByPriority(globalImmediateEvents);

    const actionEvents = events.action;
    const actionEventsByMaxPriority = this.filterEventsByPriority(actionEvents);

    locationEventsByMaxPriority.forEach((event) => {
      this.eventProcessor.applyEffects(event, state);
      executedEvents.push(event);
    });

    actionEventsByMaxPriority.forEach((event) => {
      this.eventProcessor.applyEffects(event, state);
      executedEvents.push(event);
    });

    if (globalImmediateEventsByMaxPriority.length > 0) {
      globalImmediateEventsByMaxPriority.forEach((event) => {
        this.eventProcessor.applyEffects(event, state);
        executedEvents.push(event);
      });
    }
  }

  private postPhase (state, result) {
    const events = this.eventProcessor.processor(state, result);
    const nextTurnEvents = events.global.filter(
      (event) => event.timing === 'next_turn',
    );
    const nextTurnEventsByPriority = this.filterEventsByPriority(nextTurnEvents)

    nextTurnEventsByPriority.forEach((event) => {
      if (!state.pendingEvents.find((e) => e.id === event.id)) {
        state.pendingEvents.push(event);
      }
    });
  }

  private filterEventsByPriority(events) {
    if (events.length === 0) return [];
    const priorities = events.map(event => event.priority);
    const maxPriority = Math.max(...priorities);
    const filterEvents = events.filter((event) => event.priority === maxPriority)
    return filterEvents;
  }
}
