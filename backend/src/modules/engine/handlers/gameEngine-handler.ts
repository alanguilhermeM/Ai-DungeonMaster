
export const handleMove = (parsedAction, state: any, resolveLocationTarget, gameData) => {
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
