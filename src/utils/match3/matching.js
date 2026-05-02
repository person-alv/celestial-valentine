// src/utils/match3/matching.js

/**
 * Finds all matches of 3 or more on the board, including L and T shapes
 */
export const findMatches = (board) => {
  const size = board.length;
  const horizontalMatches = [];
  const verticalMatches = [];
  
  // 1. Find all horizontal matches
  for (let row = 0; row < size; row++) {
    let matchStart = 0;
    for (let col = 1; col < size; col++) {
      // Robust null checks for tiles (gaps created by power-ups)
      const currentTile = board[row][col];
      const prevTile = board[row][col-1];

      if (!currentTile || !prevTile || currentTile.type !== prevTile.type) {
        if (col - matchStart >= 3) {
          horizontalMatches.push({ row, start: matchStart, end: col - 1 });
        }
        matchStart = col;
      }
    }
    if (size - matchStart >= 3) {
      horizontalMatches.push({ row, start: matchStart, end: size - 1 });
    }
  }
  
  // 2. Find all vertical matches
  for (let col = 0; col < size; col++) {
    let matchStart = 0;
    for (let row = 1; row < size; row++) {
      const currentTile = board[row][col];
      const prevTile = board[row-1][col];

      if (!currentTile || !prevTile || currentTile.type !== prevTile.type) {
        if (row - matchStart >= 3) {
          verticalMatches.push({ col, start: matchStart, end: row - 1 });
        }
        matchStart = row;
      }
    }
    if (size - matchStart >= 3) {
      verticalMatches.push({ col, start: matchStart, end: size - 1 });
    }
  }

  // 3. Map matches to individual tiles for overlap detection (L/T shapes)
  const results = [];
  let matchCounter = 0;

  horizontalMatches.forEach(m => {
    const tiles = [];
    for (let c = m.start; c <= m.end; c++) {
      if (board[m.row][c]) tiles.push({ row: m.row, col: c });
    }
    if (tiles.length >= 3) {
      results.push({ tiles, type: 'horizontal', id: matchCounter++ });
    }
  });

  verticalMatches.forEach(m => {
    const tiles = [];
    for (let r = m.start; r <= m.end; r++) {
      if (board[r][m.col]) tiles.push({ row: r, col: m.col });
    }
    if (tiles.length >= 3) {
      results.push({ tiles, type: 'vertical', id: matchCounter++ });
    }
  });

  return results;
};

/**
 * Handles creation of special pieces based on match length and shape (L/T)
 */
export const resolveSpecialPieces = (board, matches) => {
  const specials = [];
  const tileUsage = new Map();

  matches.forEach(match => {
    match.tiles.forEach(t => {
      const key = `${t.row},${t.col}`;
      tileUsage.set(key, (tileUsage.get(key) || 0) + 1);
    });
  });

  matches.forEach(match => {
    let intersectionTile = null;
    match.tiles.forEach(t => {
      if (tileUsage.get(`${t.row},${t.col}`) > 1) {
        intersectionTile = t;
      }
    });

    if (intersectionTile) {
      specials.push({ ...intersectionTile, specialType: 'domain' });
    } else if (match.tiles.length >= 5) {
      const center = match.tiles[Math.floor(match.tiles.length / 2)];
      specials.push({ ...center, specialType: 'monarch' });
    } else if (match.tiles.length === 4) {
      const center = match.tiles[Math.floor(match.tiles.length / 2)];
      specials.push({ ...center, specialType: 'striker', direction: match.type });
    }
  });

  return specials;
};

/**
 * Check if the board has any possible moves left
 */
export const hasPossibleMoves = (board) => {
  const size = board.length;
  
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c]) continue;
      if (c < size - 1 && board[r][c+1]) {
        if (checkSwapPotential(board, r, c, r, c + 1)) return true;
      }
      if (r < size - 1 && board[r+1][c]) {
        if (checkSwapPotential(board, r, c, r + 1, c)) return true;
      }
    }
  }
  return false;
};

const checkSwapPotential = (board, r1, c1, r2, c2) => {
  const tempBoard = JSON.parse(JSON.stringify(board));
  const t1 = tempBoard[r1][c1];
  tempBoard[r1][c1] = tempBoard[r2][c2];
  tempBoard[r2][c2] = t1;
  return findMatches(tempBoard).length > 0;
};
