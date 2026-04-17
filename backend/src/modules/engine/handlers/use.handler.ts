export const handleUse = (parsedAction, state, service) => {
    const { gameData, resolveNpcTarget } = service;
    const location = gameData.getLocation(state.currentLocation);
  
    if (!location) {
      return { type: 'INVALID_ACTION' };
    }
  
    const npcs = location.npcs || [];
  
    const target = parsedAction.target;
    if (!target) {
      return {
        type: 'INVALID_ACTION',
      };
    }
  
    const resolvedNpc = resolveNpcTarget(target, npcs);
  
    if (!resolvedNpc) {
      return { type: 'NPC_NOT_FOUND' };
    }
  
    const npc = gameData.getNPC(resolvedNpc);
  
    return {
      type: 'TALK',
      npcId: resolvedNpc,
      npc,
    };
  };
  