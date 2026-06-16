// src/data/shadow-garden/bosses.js

/**
 * Boss Definitions for Shadow Garden
 * Each level has a boss representing an emotional obstacle
 */

export const bosses = [
  {
    id: 1,
    name: 'Hesitation',
    emoji: '😰',
    description: 'The uncertainty that holds us back from taking the first step',
    maxHealth: 5000,
    difficulty: 'Easy',
    realm: 'The Garden of First Encounters'
  },
  {
    id: 2,
    name: 'Silence',
    emoji: '🎧💔',
    description: 'The quiet moments where words go unspoken',
    maxHealth: 8000,
    difficulty: 'Medium',
    realm: 'The Garden of Rhythm'
  },
  {
    id: 3,
    name: 'Loneliness',
    emoji: '👻🧸',
    description: 'The feeling of distance even when together',
    maxHealth: 12000,
    difficulty: 'Medium-Hard',
    realm: 'The Doll Collector\'s Sanctuary'
  },
  {
    id: 4,
    name: 'Distance',
    emoji: '🌑',
    description: 'The space between hearts that must be bridged',
    maxHealth: 20000,
    difficulty: 'Hard',
    realm: 'The Domain of Legendary Powers'
  },
  {
    id: 5,
    name: 'The Final Trial',
    emoji: '💖',
    description: 'The ultimate test of devotion and love',
    maxHealth: 50000,
    difficulty: 'Epic',
    realm: 'The Heart Domain - Final Gate',
    special: 'Fill the Love Meter to 100% to unlock Domain Expansion'
  }
];

/**
 * Get boss data by level number
 * @param {number} level - Level number (1-5)
 * @returns {object} Boss data
 */
export const getBossByLevel = (level) => {
  return bosses.find(boss => boss.id === level) || bosses[0];
};
