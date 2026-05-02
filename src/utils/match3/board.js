// src/utils/match3/board.js

import { TILE_TYPES } from '../../data/shadow-garden/tiles';

export { TILE_TYPES }; // Re-export for backwards compatibility
export const BOARD_SIZE = 8;

/**
 * Generates an 8x8 board with no initial matches
 */
export const generateBoard = (size = BOARD_SIZE) => {
  const board = [];
  const tileCount = TILE_TYPES.length;
  
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      let typeId;
      // Ensure no immediate 3-matches during generation
      do {
        typeId = Math.floor(Math.random() * tileCount);
      } while (
        (col >= 2 && board[row][col-1].type === typeId && board[row][col-2].type === typeId) ||
        (row >= 2 && board[row-1][col].type === typeId && board[row-2][col].type === typeId)
      );
      
      board[row][col] = {
        type: typeId,
        id: `tile-${row}-${col}-${Date.now()}-${Math.random()}`, // Unique ID for keying
        isSpecial: false,
        specialType: null // 'striker', 'domain', 'monarch'
      };
    }
  }
  
  return board;
};
