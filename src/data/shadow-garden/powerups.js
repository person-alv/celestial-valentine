// src/data/shadow-garden/powerups.js

/**
 * Legendary Power Definitions for Shadow Garden
 * Inspired by anime characters and their signature abilities
 */

export const powerups = [
  {
    id: 0,
    name: 'Six Eyes: Infinity',
    character: 'Gojo Satoru',
    anime: 'Jujutsu Kaisen',
    icon: '👁️',
    color: '#00BFFF',
    description: 'Unleash the power of limitless void to clear an entire row',
    effect: 'Clears all tiles in the selected horizontal row',
    initialCharges: 3,
    unlockLevel: 1,
    unlockCondition: 'Available from start',
    soundEffect: '/sounds/shadow-garden/sfx/infinity.mp3',
    activation: 'Select a row to obliterate with infinite power'
  },
  {
    id: 1,
    name: 'Shadow Monarch\'s Army',
    character: 'Sung Jinwoo',
    anime: 'Solo Leveling',
    icon: '⚫',
    color: '#1a1a2e',
    description: 'Summon shadow soldiers to eliminate random targets',
    effect: 'Clears 10 random tiles across the board',
    initialCharges: 3,
    unlockLevel: 1,
    unlockCondition: 'Available from start',
    soundEffect: '/sounds/shadow-garden/sfx/arise.mp3',
    activation: 'Automatic - shadows arise and strike at will'
  },
  {
    id: 2,
    name: 'Ruler\'s Authority',
    character: 'Sung Jinwoo',
    anime: 'Solo Leveling',
    icon: '🔱',
    color: '#FFD700',
    description: 'Bend the rules of reality - swap ANY two tiles',
    effect: 'Enables one free swap between any two tiles (ignores adjacency)',
    initialCharges: 2,
    unlockLevel: 2,
    unlockCondition: 'Unlock at Level 2 or achieve a 5+ combo',
    soundEffect: '/sounds/shadow-garden/sfx/system_chime.mp3',
    activation: 'Activate, then select any two tiles anywhere on the board'
  },
  {
    id: 3,
    name: 'Inverted Spear of Heaven',
    character: 'Toji Fushiguro',
    anime: 'Jujutsu Kaisen',
    icon: '🗡️',
    color: '#808080',
    description: 'Nullify all tiles of one cursed color',
    effect: 'Select a tile type - all tiles of that color are destroyed',
    initialCharges: 2,
    unlockLevel: 3,
    unlockCondition: 'Unlock at Level 3 or match 4+ shadow orbs',
    soundEffect: '/sounds/shadow-garden/sfx/inverted_spear.mp3',
    activation: 'Select a tile type to erase from existence'
  },
  {
    id: 4,
    name: 'Ten Shadows: Divine Dogs',
    character: 'Megumi Fushiguro',
    anime: 'Jujutsu Kaisen',
    icon: '🐺',
    color: '#4B0082',
    description: 'Summon divine guardians to double your scoring power',
    effect: 'All points earned are doubled for 15 seconds',
    initialCharges: 1,
    unlockLevel: 4,
    unlockCondition: 'Unlock at Level 4',
    soundEffect: '/sounds/shadow-garden/sfx/divine_dogs.mp3',
    activation: 'Automatic - multiplier activates immediately',
    duration: 15
  },
  {
    id: 5,
    name: 'Magic Eyes of Destruction',
    character: 'Anos Voldigoad',
    anime: 'The Misfit of Demon King Academy',
    icon: '👁️‍🗨️',
    color: '#8B0000',
    description: 'Destroy the four corners and all surrounding tiles',
    effect: 'Clears all 4 corners plus a 3x3 area around each corner',
    initialCharges: 1,
    unlockLevel: 5,
    unlockCondition: 'Unlock at Level 5',
    soundEffect: '/sounds/shadow-garden/sfx/destruction.mp3',
    activation: 'Automatic - annihilates corners with destructive magic'
  },
  {
    id: 6,
    name: 'Full Counter',
    character: 'Meliodas',
    anime: 'The Seven Deadly Sins',
    icon: '⚔️',
    color: '#FFD700',
    description: 'Reflect the last match with triple effectiveness',
    effect: 'Triples the points from the most recent match (must use within 3 seconds)',
    initialCharges: 1,
    unlockLevel: 5,
    unlockCondition: 'Unlock at Level 5',
    soundEffect: '/sounds/shadow-garden/sfx/full_counter.mp3',
    activation: 'Use immediately after a big match to triple its value',
    timeWindow: 3
  }
];

/**
 * Get power-up data by ID
 * @param {number} id - Power ID (0-6)
 * @returns {object} Power-up configuration
 */
export const getPowerById = (id) => {
  return powerups.find(power => power.id === id) || powerups[0];
};

/**
 * Get all power-ups unlocked at a specific level
 * @param {number} level - Level number (1-5)
 * @returns {array} Array of power-up objects
 */
export const getPowersByLevel = (level) => {
  return powerups.filter(power => power.unlockLevel <= level);
};

/**
 * Check if a power is unlocked at current level
 * @param {number} powerId - Power ID (0-6)
 * @param {number} currentLevel - Current level (1-5)
 * @returns {boolean} True if unlocked
 */
export const isPowerUnlocked = (powerId, currentLevel) => {
  const power = getPowerById(powerId);
  return power.unlockLevel <= currentLevel;
};
