// src/data/shadow-garden/tiles.js

/**
 * Sacred Symbol Definitions for Shadow Garden Match-3
 * Each tile represents an aspect of the romantic journey
 */

export const TILE_TYPES = [
  {
    id: 0,
    name: 'cherry-blossom',
    displayName: 'Cherry Blossom',
    symbol: '🌸',
    color: '#FFB6C1',
    meaning: 'New beginnings and fleeting beauty',
    rarity: 'common',
    soundEffect: '/sounds/sparkle.mp3'
  },
  {
    id: 1,
    name: 'shadow-orb',
    displayName: 'Shadow Orb',
    symbol: '⚫',
    color: '#1a1a2e',
    meaning: 'Mystery and hidden depths',
    rarity: 'common',
    soundEffect: '/sounds/tap.mp3'
  },
  {
    id: 2,
    name: 'six-eyes',
    displayName: 'Six Eyes Gem',
    symbol: '💙',
    color: '#00BFFF',
    meaning: 'Infinite perception and clarity',
    rarity: 'uncommon',
    soundEffect: '/sounds/sparkle.mp3',
    tribute: 'Gojo Satoru - Jujutsu Kaisen'
  },
  {
    id: 3,
    name: 'music-note',
    displayName: 'Musical Note',
    symbol: '🎵',
    color: '#FFD700',
    meaning: 'Harmony and shared rhythm',
    rarity: 'common',
    soundEffect: '/sounds/tap.mp3'
  },
  {
    id: 4,
    name: 'black-heart',
    displayName: 'Black Heart',
    symbol: '🖤',
    color: '#4B0082',
    meaning: 'Deep, unconventional love',
    rarity: 'uncommon',
    soundEffect: '/sounds/shimmer.mp3'
  },
  {
    id: 5,
    name: 'star-fragment',
    displayName: 'Star Fragment',
    symbol: '✨',
    color: '#F8F9FA',
    meaning: 'Celestial connection and wishes',
    rarity: 'rare',
    soundEffect: '/sounds/sparkle.mp3'
  }
];

/**
 * Special Piece Types created from specific match patterns
 */
export const SPECIAL_TYPES = {
  STRIKER: {
    name: 'Striker',
    effect: 'Clears entire row or column',
    createdBy: 'Match 4 tiles in a row',
    icon: '⚡',
    color: '#FFD700'
  },
  DOMAIN: {
    name: 'Domain',
    effect: 'Clears 3x3 area around it',
    createdBy: 'Match tiles in L or T shape',
    icon: '💫',
    color: '#7b2cbf'
  },
  MONARCH: {
    name: 'Monarch',
    effect: 'Clears all tiles of one color',
    createdBy: 'Match 5+ tiles in a straight line',
    icon: '👑',
    color: '#1a1a2e'
  }
};

/**
 * Get tile type by ID
 * @param {number} id - Tile type ID (0-5)
 * @returns {object} Tile configuration
 */
export const getTileById = (id) => {
  return TILE_TYPES.find(tile => tile.id === id) || TILE_TYPES[0];
};

/**
 * Get tile type by name
 * @param {string} name - Tile name (e.g., 'cherry-blossom')
 * @returns {object} Tile configuration
 */
export const getTileByName = (name) => {
  return TILE_TYPES.find(tile => tile.name === name) || TILE_TYPES[0];
};

/**
 * Get random tile type ID
 * @returns {number} Random tile ID (0-5)
 */
export const getRandomTileId = () => {
  return Math.floor(Math.random() * TILE_TYPES.length);
};
