// src/data/shadow-garden/levels.js

/**
 * Level Configuration for Shadow Garden
 * Defines aesthetics, timers, and progression for each realm
 */

export const levels = [
  {
    id: 1,
    name: 'Morning',
    fullName: 'The Garden of First Encounters',
    theme: 'Cherry Blossoms & New Beginnings',
    background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)',
    music: '/sounds/shadow-garden/level1_morning.mp3',
    musicDescription: 'Upbeat, hopeful romantic piano',
    timer: 300, // 5 minutes
    targetScore: 5000,
    bossId: 1,
    atmosphere: 'bright and optimistic',
    colors: {
      primary: '#FFB6C1', // Cherry blossom pink
      secondary: '#87CEEB', // Sky blue
      accent: '#FFD700' // Golden
    }
  },
  {
    id: 2,
    name: 'Twilight',
    fullName: 'The Garden of Rhythm',
    theme: 'Music & Connection',
    background: 'linear-gradient(to bottom, #4B0082, #FF69B4)',
    music: '/sounds/shadow-garden/level2_twilight.mp3',
    musicDescription: 'Smooth R&B instrumental or lo-fi romantic beat',
    timer: 360, // 6 minutes
    targetScore: 8000,
    bossId: 2,
    atmosphere: 'smooth and melodic',
    colors: {
      primary: '#4B0082', // Indigo
      secondary: '#FF69B4', // Hot pink
      accent: '#FFD700' // Golden
    },
    special: 'Rhythm bonus available on beat-synced matches'
  },
  {
    id: 3,
    name: 'Cozy',
    fullName: 'The Doll Collector\'s Sanctuary',
    theme: 'Warmth & Comfort',
    background: 'linear-gradient(to bottom, #2C1810, #8B4513)',
    music: '/sounds/shadow-garden/level3_cozy.mp3',
    musicDescription: 'Warm music box melody with soft drums',
    timer: 420, // 7 minutes
    targetScore: 12000,
    bossId: 3,
    atmosphere: 'warm and intimate',
    colors: {
      primary: '#8B4513', // Saddle brown
      secondary: '#D2691E', // Chocolate
      accent: '#FFB6C1' // Light pink
    }
  },
  {
    id: 4,
    name: 'Battle',
    fullName: 'The Domain of Legendary Powers',
    theme: 'Epic Confrontation',
    background: 'linear-gradient(to bottom, #000000, #4B0082)',
    music: '/sounds/shadow-garden/level4_battle.mp3',
    musicDescription: 'Epic orchestral intensity (Solo Leveling style)',
    timer: 480, // 8 minutes
    targetScore: 20000,
    bossId: 4,
    atmosphere: 'intense and dramatic',
    colors: {
      primary: '#000000', // Black
      secondary: '#4B0082', // Indigo
      accent: '#FFD700' // Golden
    },
    special: 'All legendary powers unlocked'
  },
  {
    id: 5,
    name: 'Cosmos',
    fullName: 'The Heart Domain - Final Gate',
    theme: 'Infinite Love',
    background: 'radial-gradient(circle, #1a1a2e 0%, #000000 100%)',
    music: '/sounds/shadow-garden/level5_finale.mp3',
    musicDescription: 'Emotional, sweeping climax (Your Name style)',
    timer: 9999, // No time limit
    targetScore: null, // No score requirement
    bossId: 5,
    atmosphere: 'ethereal and transcendent',
    colors: {
      primary: '#1a1a2e', // Deep space
      secondary: '#7b2cbf', // Purple
      accent: '#FFB6C1' // Rose pink
    },
    special: 'Fill Love Meter to 100% to trigger Domain Expansion',
    winCondition: 'loveMeterFull',
    unlocks: 'Music Room - The Ultimate Sanctuary'
  }
];

/**
 * Get level data by level number
 * @param {number} level - Level number (1-5)
 * @returns {object} Level configuration
 */
export const getLevelConfig = (level) => {
  return levels.find(lvl => lvl.id === level) || levels[0];
};

/**
 * Get timer for a specific level
 * @param {number} level - Level number (1-5)
 * @returns {number} Timer in seconds
 */
export const getLevelTimer = (level) => {
  const config = getLevelConfig(level);
  return config.timer;
};

/**
 * Get background gradient for a specific level
 * @param {number} level - Level number (1-5)
 * @returns {string} CSS gradient string
 */
export const getLevelBackground = (level) => {
  const config = getLevelConfig(level);
  return config.background;
};
