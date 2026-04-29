export const handleTalk = (parsedAction, state, service) => {
  const { gameData, resolve } = service;
  const location = gameData.getLocation(state.currentLocation);

  if (!location) {
    return { type: 'INVALID_ACTION' };
  }

  const npcs = location.npcs || [];

  const target = parsedAction.target;

  if (!target) {
    return {
      success: false,
      type: 'INVALID_TALK',
      hasEffect: false,
      blockedReason: 'missing_target',
      narrativeHint: "Player tries to talk but doesn't specify who",
    };
  }

  const resolvedNpc = resolve(gameData, target, npcs);

  if (resolvedNpc.blockedReason) {
    return {
      success: false,
      type: resolvedNpc.type,
      hasEffect: resolvedNpc.hasEffect,
      blockedReason: resolvedNpc.blockedReason,
      narrativeHint: resolvedNpc.narrativeHint,
    };
  }

  return {
    success: true,
    type: "TALK",
    target: resolvedNpc.target,
    npc: resolvedNpc.npc,
    hasEffect: resolvedNpc.hasEffect,
    effects: resolvedNpc.effects,
    narrativeHint: `Player talks to ${resolvedNpc.npc.name}`
  };
};
