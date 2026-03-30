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
