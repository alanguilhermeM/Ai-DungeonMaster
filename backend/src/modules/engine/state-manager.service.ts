import { Injectable } from "@nestjs/common";

@Injectable()
export class StateManagerService {
  private gameState = {
    currentLocation: 'hospital_quarto_203',
  };

  update(action: any) {
    return this.gameState;
  }
}