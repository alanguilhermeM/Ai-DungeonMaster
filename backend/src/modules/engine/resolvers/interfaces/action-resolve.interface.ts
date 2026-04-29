export type InteractionResult = {
  success: boolean;

  type: string;

  action: string;
  target?: string;

  interactionId?: string;

  effects?: {
    addItems?: string[];
    removeItems?: string[];
    addClues?: string[];
    setFlags?: Record<string, boolean>;
    moveTo?: string;
    talkTo?: string;
    triggerEvent?: string;
    updateWorldState?: Record<string, any>;
  };

  blockedReason?: string;

  missingRequirements?: {
    items?: string[];
    clues?: string[];
    flags?: string[];
  };

  narrativeHint: {
    summary: string;
    tone?: string;
    success?: string;
    failure?: string;
  };
  raw: Record<string, any>;
};
