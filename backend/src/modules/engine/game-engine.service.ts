import { Injectable } from "@nestjs/common";
import { ActionProcessorService } from "./action-processor.service";
import { StateManagerService } from "./state-manager.service";
import { NarrativeEngineService } from "./narrative-engine.service";

@Injectable()
export class GameEngineService {
  constructor(
    private actionProcessor: ActionProcessorService,
    private stateManager: StateManagerService,
    private narrative: NarrativeEngineService,
  ) {}

  async processAction(action: string) {
    const parsedAction = this.actionProcessor.parse(action);

    const newState = this.stateManager.update(parsedAction);

    const story = await this.narrative.generate(newState, parsedAction);

    return {
      story,
      gameState: newState,
    };
  }
}