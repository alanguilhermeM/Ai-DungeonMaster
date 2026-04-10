import { Injectable } from '@nestjs/common';
import { GameDataService } from '../gamedata/gamedata.service';
import { NarrativeService } from './narrative/narrative.service';

@Injectable()
export class EventProcessorService {
  constructor(private readonly gameData: GameDataService, private readonly narrative: NarrativeService) {}
  processor(state: any, actionResult) {
    const currentLocation = state.currentLocation;
    const location = this.gameData.getLocation(currentLocation);

    const locationEvents = location?.events || [];

    const events = this.gameData.getEvents();
    const eventKeys = Object.keys(events);

    const eventsArray = locationEvents.filter((eventId) =>
      eventKeys.includes(eventId),
    );

    const newEventsArray = eventsArray.map((eventId) =>
      this.gameData.getEvent(eventId),
    );

    const validEvents = newEventsArray.filter(
      (event) =>
        this.checkTrigger(event, actionResult) &&
        this.checkConditions(event, state),
    );

    return validEvents || null;
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
      Object.entries(effects.updateWorld).forEach(([key, value]: [string, string]) => {
        let prev = state.worldState[key]
        if (prev !== value) {
          state.worldState[key] = value;
          const worldNarrative = this.narrative.buildWorldNarrative(key, value);
          worldNarrative ? state.pendingNarratives.push(worldNarrative) : null;
          console.log(state);
        }
      });
    }

    if (!state.completedEvents.includes(event.id)) {
      state.completedEvents.push(event.id);
    }
  }
}
