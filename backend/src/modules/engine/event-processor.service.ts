import { Injectable } from '@nestjs/common';
import { GameDataService } from '../gamedata/gamedata.service';
import { stat } from 'fs';

@Injectable()
export class EventProcessorService {
  constructor(private readonly gameData: GameDataService) {}
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

    console.log(validEvents);

    return validEvents[0] || null;
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
    // console.log(state)

    for (const condition in conditions)
      switch (condition) {
        case 'time':
          if (conditions[condition] !== state.worldState.time) return false;
          break;
        case 'notCompleted':
          if (state.completedEvents.includes(event.id)) return false;
          break;
      }
    // console.log(conditions);
    return true;
  }
}
