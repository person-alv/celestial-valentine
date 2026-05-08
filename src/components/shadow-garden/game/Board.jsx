import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Tile from './Tile';

const Board = ({
  board,
  selectedTile,
  isProcessing,
  onTileClick,
  isSelectingRow = false,
  isSelectingType = false,
  specialEffects = [],
}) => {
  const touchStart = useRef(null);
  const [hoveredRow, setHoveredRow] = useState(null);

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
      if (Math.abs(dx) > threshold) targetCol += dx > 0 ? 1 : -1;
    } else {
      if (Math.abs(dy) > threshold) targetRow += dy > 0 ? 1 : -1;
    }
    if (targetRow !== touchStart.current.row || targetCol !== touchStart.current.col) {
      if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
        onTileClick(targetRow, targetCol);
      }
    }
    touchStart.current = null;
  };

  return (
    <BoardContainer
      id="game-board"
      className="grid grid-cols-8 gap-1 p-2 bg-black/40 backdrop-blur-sm border-4 border-sg-purple/30 rounded-xl shadow-2xl touch-none relative"
      onMouseLeave={() => setHoveredRow(null)}
    >
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <div
            key={`cell-${rowIndex}-${colIndex}`}
            onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => isSelectingRow && setHoveredRow(rowIndex)}
          >
            <Tile
              tile={tile}
              row={rowIndex}
              col={colIndex}
              isSelected={selectedTile?.row === rowIndex && selectedTile?.col === colIndex}
              isProcessing={isProcessing}
              onClick={onTileClick}
              isRowHighlighted={isSelectingRow && hoveredRow === rowIndex}
              isTypeTargeting={isSelectingType}
            />
          </div>
        ))
      )}

      {/* Special tile detonation effects layer */}
      <EffectsLayer>
        {specialEffects.map(effect => (
          <SpecialEffectItem key={effect.id} effect={effect} />
        ))}
      </EffectsLayer>
    </BoardContainer>
  );
};

/* Renders a single board-space effect (striker beam, domain burst, etc.) */
const SpecialEffectItem = ({ effect }) => {
  const { type, row, col } = effect;
  if (type === 'striker-h') {
    return <StrikerBeam $row={row} $direction="h" className="animate-striker-h" />;
  }
  if (type === 'striker-v') {
    return <StrikerBeam $col={col} $direction="v" className="animate-striker-v" />;
  }
  if (type === 'domain') {
    return <DomainBurst $row={row} $col={col} className="animate-domain" />;
  }
  if (type === 'monarch') {
    return <MonarchRing $row={row} $col={col} className="animate-monarch" />;
  }
  return null;
};

const BoardContainer = styled.div`
  width: min(85vw, min(calc(100vh - 240px), 480px));
  height: min(85vw, min(calc(100vh - 240px), 480px));
  user-select: none;
`;

const EffectsLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
`;

const StrikerBeam = styled.div`
  position: absolute;
  background: ${p => p.$direction === 'h'
    ? 'linear-gradient(to right, transparent, rgba(255,215,0,0.9), rgba(255,255,255,1), rgba(255,215,0,0.9), transparent)'
    : 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.9), rgba(255,255,255,1), rgba(255,215,0,0.9), transparent)'};
  box-shadow: 0 0 20px rgba(255,215,0,0.8);
  ${p => p.$direction === 'h' ? `
    left: 0; right: 0;
    top: calc(${p.$row} * 12.5%);
    height: 12.5%;
  ` : `
    top: 0; bottom: 0;
    left: calc(${p.$col} * 12.5%);
    width: 12.5%;
  `}
  animation: strikerFlash 0.5s ease-out forwards;
  @keyframes strikerFlash {
    0%   { opacity: 0; }
    20%  { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const DomainBurst = styled.div`
  position: absolute;
  left: calc(${p => (p.$col - 1)} * 12.5%);
  top: calc(${p => (p.$row - 1)} * 12.5%);
  width: 37.5%;
  height: 37.5%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(123,44,191,0.9) 0%, rgba(123,44,191,0.3) 50%, transparent 70%);
  box-shadow: 0 0 30px rgba(123,44,191,0.8);
  animation: domainExpand 0.6s ease-out forwards;
  @keyframes domainExpand {
    0%   { transform: scale(0); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
`;

const MonarchRing = styled.div`
  position: absolute;
  left: calc(${p => p.$col} * 12.5% - 6.25%);
  top: calc(${p => p.$row} * 12.5% - 6.25%);
  width: 25%;
  height: 25%;
  border: 3px solid rgba(26,26,46,0.9);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(26,26,46,0.9), inset 0 0 20px rgba(123,44,191,0.5);
  animation: monarchRing 0.8s ease-out forwards;
  @keyframes monarchRing {
    0%   { transform: scale(0) rotate(0deg); opacity: 1; }
    100% { transform: scale(4) rotate(180deg); opacity: 0; }
  }
`;

export default Board;
