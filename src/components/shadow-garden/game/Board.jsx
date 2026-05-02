import React, { useRef } from 'react';
import styled from 'styled-components';
import Tile from './Tile';

const Board = ({ board, selectedTile, isProcessing, onTileClick }) => {
  const touchStart = useRef(null);

  if (!board || board.length === 0) return null;

  const handleTouchStart = (e, row, col) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, row, col };
    onTileClick(row, col);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current || isProcessing) return;

    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;
    const threshold = 30;

    let targetRow = touchStart.current.row;
    let targetCol = touchStart.current.col;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > threshold) {
        targetCol += dx > 0 ? 1 : -1;
      }
    } else {
      if (Math.abs(dy) > threshold) {
        targetRow += dy > 0 ? 1 : -1;
      }
    }

    if (targetRow !== touchStart.current.row || targetCol !== touchStart.current.col) {
      // Check boundaries
      if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
        onTileClick(targetRow, targetCol);
      }
    }

    touchStart.current = null;
  };

  return (
    <BoardContainer 
      id="game-board"
      className="grid grid-cols-8 gap-1 p-2 bg-black/40 backdrop-blur-sm border-4 border-sg-purple/30 rounded-xl shadow-2xl touch-none"
    >
      {board.map((row, rowIndex) => 
        row.map((tile, colIndex) => (
          <div 
            key={tile ? tile.id : `empty-${rowIndex}-${colIndex}`}
            onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
            onTouchEnd={handleTouchEnd}
          >
            <Tile
              tile={tile}
              row={rowIndex}
              col={colIndex}
              isSelected={selectedTile?.row === rowIndex && selectedTile?.col === colIndex}
              isProcessing={isProcessing}
              onClick={onTileClick}
            />
          </div>
        ))
      )}
    </BoardContainer>
  );
};

const BoardContainer = styled.div`
  width: min(85vw, min(calc(100vh - 240px), 480px));
  height: min(85vw, min(calc(100vh - 240px), 480px));
  user-select: none;
`;

export default Board;
