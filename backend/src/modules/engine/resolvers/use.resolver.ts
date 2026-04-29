import { Injectable } from '@nestjs/common';

@Injectable()
export class UseResolve {
  resolve = (gameData, state, item, target) => {
    const itemId = this.resolveInventoryItem(state, item);
    const interactableTarget = this.resolveUseTarget(gameData, state, target);

    if (!itemId) {
      return this.buildResult({
        item: null,
        target: interactableTarget?.id ?? null,
        hasEffect: false,
        blockedReason: 'item_not_found',
      });
    }

    if (!interactableTarget) {
      return this.buildResult({
        item: itemId,
        target: null,
        hasEffect: false,
        blockedReason: 'invalid_target',
      });
    }

    const useInteraction = this.resolveUseInteraction(
      interactableTarget,
      itemId,
    );

    if (!useInteraction) {
      return this.buildResult({
        item: itemId,
        target: interactableTarget.id,
        hasEffect: false,
        blockedReason: 'no_effect',
      });
    }

    const event = this.resolveEvent(gameData, useInteraction.event);

    if (!event) {
      return this.buildResult({
        item: itemId,
        target: interactableTarget.id,
        hasEffect: false,
        blockedReason: 'event_not_found',
      });
    }

    if (!event.effects) {
      return this.buildResult({
        item: itemId,
        target: interactableTarget.id,
        event,
        hasEffect: false,
        blockedReason: 'event_without_effects',
      });
    }

    return this.buildResult({
      item: itemId,
      target: interactableTarget.id,
      event,
      hasEffect: true,
      effects: event.effects,
    });
  };

  private resolveInventoryItem(state, item: string) {
    const inventory = state.player.inventory;

    return inventory.find((i) => i.includes(item)) ?? null;
  }

  private resolveUseTarget(gameData, state, target: string) {
    const locations = gameData.data.locations;
    const currentLocation = locations[state.currentLocation];

    if (!currentLocation.interactables) return null;

    const interactable = currentLocation.interactables.find((interactable) =>
      interactable.aliases.some((alias) => target.includes(alias)),
    );

    return interactable ?? null;
  }

  private resolveUseInteraction(interactableTarget, itemId: string) {
    if (!interactableTarget.useInteractions) return null;

    return interactableTarget.useInteractions[itemId] ?? null;
  }

  private resolveEvent(gameData, eventId: string) {
    return gameData.data.events[eventId] ?? null;
  }

  private buildResult(result) {
    return result;
  }
}