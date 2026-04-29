export const handleUse = (parsedAction, state, service) => {
  const { gameData, resolve } = service;

  const item = parsedAction.item;
  const target = parsedAction.target;

  if (!item) {
    return {
      success: false,
      type: 'INVALID_USE',
      hasEffect: false,
      blockedReason: 'missing_item',
      narrativeHint:
        "Player tries to use something but doesn't specify an item",
    };
  }

  if (!target) {
    return {
      success: false,
      type: 'INVALID_USE',
      hasEffect: false,
      blockedReason: 'missing_target',
      narrativeHint: "Player tries to use an item but doesn't specify a target",
    };
  }

  const resolvedUse = resolve(gameData, state, item, target);
  console.log(resolvedUse)

  if (!resolvedUse.item) {
    return {
      success: false,
      type: 'INVALID_USE',
      hasEffect: false,
      blockedReason: 'item_not_found',
      narrativeHint: `Player tries to use ${item}, but doesn't have it`,
    };
  }

  if (!resolvedUse.target) {
    return {
      success: false,
      type: 'INVALID_USE',
      hasEffect: false,
      blockedReason: 'invalid_target',
      narrativeHint: `Player tries to use ${item} on ${target}, but the target isn't available`,
    };
  }

  if (!resolvedUse.hasEffect) {
    return {
      success: true,
      type: 'USE',
      item: resolvedUse.item,
      target: resolvedUse.target,
      event: resolvedUse.event,
      hasEffect: false,
      blockedReason: resolvedUse.blockedReason,
      narrativeHint: `Player uses ${resolvedUse.item} on ${resolvedUse.target}, but nothing obvious happens`,
    };
  }

  return {
    success: true,
    type: 'USE',
    item: resolvedUse.item,
    target: resolvedUse.target,
    event: resolvedUse.event,
    hasEffect: true,
    effects: resolvedUse.effects,
    narrativeHint: `Player uses ${resolvedUse.item} on ${resolvedUse.target}`,
  };
};
