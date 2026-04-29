import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationResolve {
  private locationsAliases = {
    hospital_corredor_segundo_andar: {
      aliases: ['corredor', 'corredor do hospital', 'segundo andar'],
    },
    hospital_enfermaria: {
      aliases: ['enfermaria', 'enfermagem'],
    },
    hospital_quarto_203: {
      aliases: ['quarto', 'quarto 203'],
    },
    hospital_banheiro_quarto_203: {
      aliases: ['banheiro', 'mictorio'],
    },
  };

  resolve = (gameData, state, target) => {
    const locationId = this.resolveLocationTarget(target);
    const locations = gameData.data.locations;
    const currentLocation = locations[state.currentLocation];
    const locationExist = locations[locationId];
    
    if (!locationExist) {
      return {
        type: 'MOVE',
        blockedReason: 'INVALID_MOVE',
      };
    }

    const effects = locationExist.effects;

    if (!currentLocation.connections.includes(locationId)) {
      return {
        type: 'MOVE',
        blockedReason: 'INVALID_MOVE',
        narrativeHint: 'Player tries to move to a location tha is not connected to the current location'
      };
    }

    return {
      location: locationExist,
      locationId,
      hasEffect: true,
      effects: {
        moveTo: locationId,
        ...(effects ?? {}),
      },
    };
  };

  resolveLocationTarget = (target: string) => {
    const normalized = target.toLowerCase();

    for (const [locationId, data] of Object.entries(this.locationsAliases)) {
      if (data.aliases.some((alias) => normalized.includes(alias))) {
        return locationId;
      }
    }

    return null;
  };
}
