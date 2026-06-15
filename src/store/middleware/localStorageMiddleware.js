const STORAGE_KEY_PREFIX = 'celestial_valentine_';

// High-frequency actions that update session-only state — skipping these
// stops the 1-write/second localStorage flood from tickTimer.
const SKIP_SAVE_ACTIONS = new Set([
  'shadowGarden/tickTimer',
]);

const localStorageMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();

  // Save Shadow Garden state (skip high-frequency / session-only actions)
  if (action.type?.startsWith('shadowGarden/') && !SKIP_SAVE_ACTIONS.has(action.type)) {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}shadow_garden`,
      JSON.stringify(state.shadowGarden)
    );
  }
  
  // Save Valentine state
  if (action.type?.startsWith('valentine/')) {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}valentine`,
      JSON.stringify(state.valentine)
    );
  }
  
  return result;
};

export const loadStateFromStorage = () => {
  try {
    const shadowGardenState = localStorage.getItem(`${STORAGE_KEY_PREFIX}shadow_garden`);
    const valentineState = localStorage.getItem(`${STORAGE_KEY_PREFIX}valentine`);
    
    const shadowGarden = shadowGardenState ? JSON.parse(shadowGardenState) : undefined;
    return {
      shadowGarden: shadowGarden ? {
        ...shadowGarden,
        // Session-transient fields — always reset to safe defaults on load
        sfxMuted: false,
        musicMuted: false,
        isDomainExpansionActive: false,
        scoreMultiplier: 1,
        scoreMultiplierExpiresAt: 0,
        // Migration default for saves created before power intros existed
        seenPowerIntros: shadowGarden.seenPowerIntros ?? [],
      } : undefined,
      valentine: valentineState ? JSON.parse(valentineState) : undefined
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return {};
  }
};

export default localStorageMiddleware;
