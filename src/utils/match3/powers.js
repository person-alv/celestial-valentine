// src/utils/match3/powers.js

/**
 * Executes the logic for each Legendary Power on the board grid
 * @returns {object} { newBoard, affectedTiles }
 */
export const executePowerLogic = (powerId, board, options = {}) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  const size = board.length;
  const affectedTiles = [];

  switch (powerId) {
    case 0: // Six Eyes (Gojo) - Clear horizontal row
      const targetRow = options.row || Math.floor(size / 2);
      for (let col = 0; col < size; col++) {
        if (newBoard[targetRow][col]) {
          affectedTiles.push({ row: targetRow, col });
          newBoard[targetRow][col] = null;
        }
      }
      break;

    case 1: // Shadow Army (Jinwoo) - Clear 10 random
      const targets = 10;
      let cleared = 0;
      while (cleared < targets) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        if (newBoard[r][c] !== null) {
          affectedTiles.push({ row: r, col: c });
          newBoard[r][c] = null;
          cleared++;
        }
      }
      break;

    case 2: // Ruler's Authority (Jinwoo) - Handled in useMatch3 (Free Swap)
      break;

    case 3: // Inverted Spear (Toji) - Clear specific color
      const targetType = options.type; // 0-5
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (newBoard[r][c]?.type === targetType) {
            affectedTiles.push({ row: r, col: c });
            newBoard[r][c] = null;
          }
        }
      }
      break;

    case 4: // Ten Shadows (Megumi) - Handled in slice (x2 points)
      break;

    case 5: // Magic Eyes (Anos) - Clear corners + adjacent
      const corners = [
        { r: 0, c: 0 }, { r: 0, c: size-1 },
        { r: size-1, c: 0 }, { r: size-1, c: size-1 }
      ];
      corners.forEach(({r, c}) => {
        // Clear corner and neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && newBoard[nr][nc]) {
              affectedTiles.push({ row: nr, col: nc });
              newBoard[nr][nc] = null;
            }
          }
        }
      });
      break;

    case 6: // Full Counter (Meliodas) - Reflect last score x3
      break;

    default:
      break;
  }

  return { newBoard, affectedTiles };
};
