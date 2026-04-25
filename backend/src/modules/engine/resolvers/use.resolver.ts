import { Injectable } from "@nestjs/common";

@Injectable()
export class UseResolve {
  resolve = (gameData, state, item, target) => {
    const inventory = state.player.inventory;
    const itemId = inventory.find((i) => i.includes(item));
    const targetId = this.resolveUseTarget(gameData, state, target);

    return {
      item: itemId,
      target: targetId,
    }
  }

  resolveUseTarget = (gameData, state, target: string) => {
    const locations = gameData.data.locations
    const currentLocation = locations[state.currentLocation]
    
    if (!target) return;

    if (!currentLocation.interactables) return;

    const interactable = currentLocation.interactables.find((interactable) =>
      interactable.aliases.some((alias) => target.includes(alias))
    );
    
    return interactable ? interactable.id : null;
  };
};
