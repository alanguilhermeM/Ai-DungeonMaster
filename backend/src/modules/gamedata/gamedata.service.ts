import { Injectable } from "@nestjs/common";

@Injectable()
export class GameDataService {
  private data = {
    npcs: {},
    locations: {},
    events: {},
  };

  load() {
    // aqui você lê os JSONs da pasta /gamedata
  }

  getNPC(id: string) {
    return this.data.npcs[id];
  }
}
