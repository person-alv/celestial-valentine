import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  phase: 1,
  acceptedDate: false,
  hasSeenFireworks: false,
  constellationsCompleted: [],
  viewedNotes: [],
  completionDate: null,
};

const valentineSlice = createSlice({
  name: 'valentine',
  initialState,
  reducers: {
    updateProgress: (state, action) => {
      return { ...state, ...action.payload };
    },
    migrateFromLocalStorage: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetValentineProgress: () => initialState,
  },
});

export const { updateProgress, migrateFromLocalStorage, resetValentineProgress } = valentineSlice.actions;
export default valentineSlice.reducer;
