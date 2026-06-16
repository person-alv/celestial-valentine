import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLaptopZoomed: false,
  activePoster: null, // 'gojo', 'given', 'solo'
  ambientMuted: false,
  hasEnteredHub: false,
};

const hubSlice = createSlice({
  name: 'hub',
  initialState,
  reducers: {
    setLaptopZoomed: (state, action) => {
      state.isLaptopZoomed = action.payload;
    },
    setActivePoster: (state, action) => {
      state.activePoster = action.payload;
    },
    toggleAmbientMute: (state) => {
      state.ambientMuted = !state.ambientMuted;
    },
    setEnteredHub: (state, action) => {
      state.hasEnteredHub = action.payload;
    },
  },
});

export const { setLaptopZoomed, setActivePoster, toggleAmbientMute, setEnteredHub } = hubSlice.actions;
export default hubSlice.reducer;
