import { configureStore } from '@reduxjs/toolkit';
import hubReducer from './slices/hubSlice';
import shadowGardenReducer from './slices/shadowGardenSlice';
import valentineReducer from './slices/valentineSlice';
import localStorageMiddleware, { loadStateFromStorage } from './middleware/localStorageMiddleware';

const preloadedState = loadStateFromStorage();

const store = configureStore({
  reducer: {
    hub: hubReducer,
    shadowGarden: shadowGardenReducer,
    valentine: valentineReducer
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware)
});

export default store;
