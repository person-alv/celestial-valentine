import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLevel: 1,
  completedLevels: [],
  unlockedPowers: [0, 1], // Start with Gojo and Shadow Army
  powerUsages: {
    0: 3, 1: 3, 2: 2, 3: 2, 4: 1, 5: 1, 6: 1 
  },
  stats: {
    totalScore: 0,
    totalCombos: 0,
    playTime: 0,
  },
  currentBossHealth: 1,
  maxBossHealth: 5000,
  loveMeter: 0,
  timeLeft: 300,
  activeMultipliers: {
    score: 1,
    duration: 0
  },
  isDomainExpansionActive: false,
  unlockedPhotos: [],
  unlockedDolls: [],
  unlockedVoiceNotes: [],
  viewedLoveNotes: [],
  musicRoomUnlocked: false,
  tutorialCompleted: false,
  isPlaying: false,
  hasCompletedGame: false, // PERSISTENT FLAG
  // Audio State
  musicMuted: false,
  sfxMuted: false,
  musicVolume: 0.3,
  sfxVolume: 1.0,
};

const shadowGardenSlice = createSlice({
  name: 'shadowGarden',
  initialState,
  reducers: {
    setCurrentLevel: (state, action) => {
      state.currentLevel = action.payload;
      state.loveMeter = 0;
      const timers = [300, 360, 420, 480, 9999]; 
      state.timeLeft = timers[action.payload - 1] || 300;
      state.currentBossHealth = 999999; 

      if (state.currentLevel === 2 && !state.unlockedPowers.includes(2)) state.unlockedPowers.push(2);
      if (state.currentLevel === 3 && !state.unlockedPowers.includes(3)) state.unlockedPowers.push(3);
      if (state.currentLevel === 4 && !state.unlockedPowers.includes(4)) state.unlockedPowers.push(4);
      if (state.currentLevel === 5) {
        if (!state.unlockedPowers.includes(5)) state.unlockedPowers.push(5);
        if (!state.unlockedPowers.includes(6)) state.unlockedPowers.push(6);
      }
    },
    tickTimer: (state) => {
      if (state.timeLeft > 0 && state.currentLevel < 5) {
        state.timeLeft -= 1;
      }
    },
    completeLevel: (state, action) => {
      if (!state.completedLevels.includes(action.payload)) {
        state.completedLevels.push(action.payload);
      }
      if (action.payload === 5) {
        state.hasCompletedGame = true;
      }
    },
    addScore: (state, action) => {
      const points = action.payload * (state.activeMultipliers.score || 1);
      state.stats.totalScore += points;
      if (state.currentBossHealth > 0) {
        state.currentBossHealth = Math.max(0, state.currentBossHealth - points);
      }
      
      if (state.currentLevel === 5) {
        state.loveMeter = Math.min(100, state.loveMeter + (points / 500));
      }
    },
    incrementCombo: (state) => {
      state.stats.totalCombos += 1;
    },
    setBossHealth: (state, action) => {
      state.currentBossHealth = action.payload;
      state.maxBossHealth = action.payload;
    },
    unlockPower: (state, action) => {
      if (!state.unlockedPowers.includes(action.payload)) {
        state.unlockedPowers.push(action.payload);
      }
    },
    consumePowerCharge: (state, action) => {
      const powerId = action.payload;
      if (state.powerUsages[powerId] > 0) {
        state.powerUsages[powerId] -= 1;
      }
    },
    refillPower: (state, action) => {
      const powerId = action.payload;
      state.powerUsages[powerId] += 1;
    },
    setDomainExpansion: (state, action) => {
      state.isDomainExpansionActive = action.payload;
    },
    setTutorialCompleted: (state, action) => {
      state.tutorialCompleted = action.payload;
    },
    toggleMusicMute: (state) => {
      state.musicMuted = !state.musicMuted;
    },
    toggleSFXMute: (state) => {
      state.sfxMuted = !state.sfxMuted;
    },
    rekindleJourney: (state) => {
      state.currentLevel = 1;
      state.completedLevels = [];
      state.unlockedPowers = [0, 1];
      state.loveMeter = 0;
      state.stats.totalScore = 0;
      state.powerUsages = { 0: 3, 1: 3, 2: 2, 3: 2, 4: 1, 5: 1, 6: 1 };
      state.isDomainExpansionActive = false;
      state.timeLeft = 300;
    },
    resetShadowGarden: () => initialState,
  },
});

export const { 
  setCurrentLevel, 
  tickTimer,
  completeLevel, 
  addScore, 
  incrementCombo,
  setBossHealth,
  unlockPower,
  consumePowerCharge,
  refillPower,
  setDomainExpansion,
  setTutorialCompleted,
  toggleMusicMute,
  toggleSFXMute,
  rekindleJourney,
  resetShadowGarden
} = shadowGardenSlice.actions;
export default shadowGardenSlice.reducer;
