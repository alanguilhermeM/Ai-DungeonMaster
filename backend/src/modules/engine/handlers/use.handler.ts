export const handleUse = (parsedAction, state, service) => {
    const { gameData, resolve } = service;
    const item = parsedAction.item;
    const target = parsedAction.target;

    if (!target ) {
      return {
        type: 'INVALID_USE',
      };
    }
    
    const resolvedUse = resolve(gameData, state, item, target);
    
    if (!resolvedUse.target ) {
      return {
        type: 'INVALID_USE',
      };
    }

    return {
      type: 'USE',
      item: resolvedUse.item,
      target: resolvedUse.target,
      input: parsedAction.input
    }
  };
