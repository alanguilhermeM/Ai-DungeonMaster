export const handleMove = (parsedAction, state: any, services: any) => {
  const { gameData, resolveLocationTarget } = services;
  const currentLocation = gameData.getLocation(state.currentLocation);

  if (!currentLocation) {
    return { type: 'INVALID_MOVE' };
  }

  const possibleMoves = currentLocation.connections;
  const target = parsedAction.target;

  if (!target) {
    return {
      type: 'INVALID_MOVE',
    };
  }

  if (target === 'back') {
    const previous = state.previousLocation;

    if (!previous) {
      return { type: 'INVALID_MOVE' };
    }

    return {
      type: 'MOVE',
      target: previous,
    };
  }

  const resolved = resolveLocationTarget(target);
  if (!resolved || !possibleMoves.includes(resolved)) {
    return {
      type: 'INVALID_MOVE',
    };
  }

  return {
    type: 'MOVE',
    target: resolved,
  };
};
