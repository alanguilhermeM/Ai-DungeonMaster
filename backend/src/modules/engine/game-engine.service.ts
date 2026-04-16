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

    const nextTurnEvents = events.global.filter(
      (event) => event.timing === 'next_turn',
    );
    const nextTurnEventsByPriority = this.filterEventsByPriority(nextTurnEvents)

    nextTurnEventsByPriority.forEach((event) => {
      if (!newState.pendingEvents.find((e) => e.id === event.id)) {
        newState.pendingEvents.push(event);
      }
    });

    const executedEvents = [];

    const locationEvents = events.location;
    const locationEventsByMaxPriority = this.filterEventsByPriority(locationEvents);

    const actionEvents = events.action;
    const actionEventsByMaxPriority = this.filterEventsByPriority(actionEvents);

    const globalImmediateEvents = events.global.filter(
      (event) => event.timing === 'immediate',
    );
    const globalImmediateEventsByMaxPriority = this.filterEventsByPriority(globalImmediateEvents);

    const pending = [...newState.pendingEvents];

    pending.forEach((event) => {
      this.eventProcessor.applyEffects(event, newState);
      executedEvents.push(event);
    });

    newState.pendingEvents = [];

    locationEventsByMaxPriority.forEach((event) => {
      this.eventProcessor.applyEffects(event, newState);
      executedEvents.push(event);
    });

    actionEventsByMaxPriority.forEach((event) => {
      this.eventProcessor.applyEffects(event, newState);
      executedEvents.push(event);
    });

    if (globalImmediateEventsByMaxPriority.length > 0) {
      globalImmediateEventsByMaxPriority.forEach((event) => {
        this.eventProcessor.applyEffects(event, newState);
        executedEvents.push(event);
      });
    }

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

  private filterEventsByPriority(events) {
    if (events.length === 0) return [];
    const priorities = events.map(event => event.priority);
    const maxPriority = Math.max(...priorities);
    const filterEvents = events.filter((event) => event.priority === maxPriority)
    return filterEvents;
  }
}
