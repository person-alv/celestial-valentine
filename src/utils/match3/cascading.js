// src/utils/match3/cascading.js
import { TILE_TYPES } from './board';

/**
 * Drops pieces into null spaces and refills from top
 */
export const cascadeBoard = (board) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  const size = board.length;
  const tileCount = TILE_TYPES.length;
  
  for (let col = 0; col < size; col++) {
    let writeRow = size - 1;
    
    // Drop existing pieces
    for (let row = size - 1; row >= 0; row--) {
      if (newBoard[row][col] !== null) {
        if (row !== writeRow) {
          newBoard[writeRow][col] = newBoard[row][col];
          newBoard[row][col] = null;
        }
        writeRow--;
      }
    }
    
    // Refill from top
    for (let row = writeRow; row >= 0; row--) {
      newBoard[row][col] = {
        type: Math.floor(Math.random() * tileCount),
        id: `tile-refill-${row}-${col}-${Date.now()}-${Math.random()}`,
        isSpecial: false,
        specialType: null
      };
    }
  }
  
  return newBoard;
};
