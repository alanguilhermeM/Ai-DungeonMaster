export const handleLook = (state, gameData) => {
  const location = gameData.getLocation(state.currentLocation);

  if (!location) {
    return {
      success: false,
      type: 'INVALID_LOOK',
      hasEffect: false,
      blockedReason: 'invalid_location',
      narrativeHint: {
        summary:
          'Player tries to observe the surroundings, but something feels wrong.',
        failure: 'There is nothing to see here.',
      },
    };
  }

  return {
    success: true,
    type: 'LOOK',
    location,
    hasEffect: false,
    effects: {},
    narrativeHint: {
      summary: `Player observes the ${location.name}`,
      tone: 'descriptive',
    },
  };
};
