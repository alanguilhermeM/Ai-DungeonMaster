export const handleMove = (parsedAction, state: any, services: any) => {
  const { gameData, resolve } = services;
  const currentLocation = gameData.getLocation(state.currentLocation);
  const target = parsedAction.target;

  if (!target) {
    return {
      success: false,
      type: 'INVALID_MOVE',
      hasEffect: false,
      blockedReason: 'missing_target',
      narrativeHint: 'Player tries to move to an inexistent location',
    };
  }

  if (target === 'back') {
    const previous = state.previousLocation;

    if (!previous) {
      return {
        success: false,
        type: 'INVALID_MOVE',
        hasEffect: false,
        blockedReason: 'no_previous_location',
        narrativeHint: 'Player cant go back to this location',
      };
    }

    return {
      success: true,
      type: 'MOVE',
      target: previous,
      hasEffect: true,
      effects: {
        moveTo: previous,
      },
      narrativeHint: `Player moves of ${currentLocation.name} to ${previous}`,
    };
  }

  const resolved = resolve(gameData, state, target);
  if (resolved.blockedReason) {
    return {
      success: false,
      type: 'INVALID_MOVE',
      hasEffect: false,
      blockedReason: resolved.blockedReason,
      narrativeHint: resolved.narrativeHint ?? 'Player tries to move to an inexistent location',
    };
  }

  if (resolved.location && resolved.locationId) {
    return {
      success: true,
      type: 'MOVE',
      target: resolved.locationId,
      location: resolved.location,
      hasEffect: resolved.hasEffect,
      effects: resolved.effects,
      narrativeHint: `Player moves from ${currentLocation.name} to ${resolved.location.name}`,
    };
  }
};
