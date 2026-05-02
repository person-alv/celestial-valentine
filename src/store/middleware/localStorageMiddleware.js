const STORAGE_KEY_PREFIX = 'celestial_valentine_';

const localStorageMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();
  
  // Save Shadow Garden state
  if (action.type?.startsWith('shadowGarden/')) {
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
    
    return {
      shadowGarden: shadowGardenState ? JSON.parse(shadowGardenState) : undefined,
      valentine: valentineState ? JSON.parse(valentineState) : undefined
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return {};
  }
};

export default localStorageMiddleware;
