import { Injectable } from '@nestjs/common';
import { GameDataService } from '../gamedata/gamedata.service';
import { NarrativeService } from './narrative/narrative.service';

@Injectable()
export class EventProcessorService {
  constructor(
    private readonly gameData: GameDataService,
    private readonly narrative: NarrativeService,
  ) {}
  processor(state: any, actionResult) {
    const snapshot = structuredClone(state);
    const currentLocation = snapshot.currentLocation;
    const events = this.gameData.getEvents();

    const locationEvents = this.getLocationEvents(currentLocation, events);
    const globalEvents = this.getGlobalEvents(events);
    const allEvents = [...locationEvents, ...globalEvents];

    const validEvents = allEvents.filter(
      (event) =>
        this.checkTrigger(event, actionResult) &&
        this.checkConditions(event, snapshot),
    );

    const validEventsByScope = validEvents.reduce((acc, event) => {
      if (event.scope.includes('location')) {
        acc.location.push(event)
      }
    
      if (event.scope.includes('global')) {
        acc.global.push(event)
      }

      if (event.scope.includes('action')) {
        acc.global.push(event)
      }
    
      return acc
    }, {
      location: [],
      global: [],
      action: []
    });

    return validEventsByScope || [];
  }

  getLocationEvents(currentLocation, events) {
    const location = this.gameData.getLocation(currentLocation);
    const eventsLocation = (location?.events || [])
      .map((eventId) => events[eventId])
      .filter(Boolean);

    return eventsLocation;
  }

  getGlobalEvents(events) {
    const eventsValue = Object.values(events);
    const globalEvents = eventsValue.filter((event: any) =>
      event.scope.includes('global'),
    );

    return globalEvents;
  }

  checkTrigger(event, actionResult): boolean {
    const trigger = event.trigger;

    if (actionResult.type !== trigger.type) {
      return false;
    }

    if (!trigger.target) {
      return true;
    }

    if (actionResult.target === trigger.target) {
      return true;
    }

    return false;
  }

  checkConditions(event, state) {
    const conditions = event.conditions;
    if (!conditions) return true;

    for (const condition in conditions)
      switch (condition) {
        case 'time':
          if (conditions[condition] !== state.worldState.time) return false;
          break;
        case 'notCompleted':
          if (state.completedEvents.includes(event.id)) return false;
          break;
      }
    return true;
  }

  applyEffects(event, state) {
    if (!event || !event.effects) return state;
    const effects = event.effects;
    if (effects.addClues) {
      effects.addClues.forEach((clue) => {
        if (!state.discoveredClues.includes(clue)) {
          state.discoveredClues.push(clue);
        }
      });
    }

    if (effects.updateWorld) {
      Object.entries(effects.updateWorld).forEach(
        ([key, value]: [string, string]) => {
          let prev = state.worldState[key];
          if (prev !== value) {
            state.worldState[key] = value;
            const worldNarrative = this.narrative.buildWorldNarrative(
              key,
              value,
            );
            worldNarrative
              ? state.pendingNarratives.push(worldNarrative)
              : null;
            // console.log(state);
          }
        },
      );
    }

    if (!state.completedEvents.includes(event.id)) {
      state.completedEvents.push(event.id);
    }
  }
}
