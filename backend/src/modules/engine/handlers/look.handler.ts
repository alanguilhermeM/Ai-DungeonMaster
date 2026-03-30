export const handleLook = (state, gameData) => {
  const location = gameData.getLocation(state.currentLocation);

  if (!location) {
    return { type: 'INVALID_ACTION' };
  }
  return {
    type: 'LOOK',
    location,
  };
};
