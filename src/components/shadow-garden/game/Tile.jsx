import React from 'react';
import styled from 'styled-components';
import { TILE_TYPES } from '../../../utils/match3/board';

const Tile = ({ tile, row, col, isSelected, isProcessing, onClick }) => {
  // Null check for tile (happens during match clearing)
  if (!tile) {
    return <TileContainer $isEmpty={true} />;
  }

  const typeInfo = TILE_TYPES[tile.type];

  return (
    <TileContainer
      onClick={() => onClick(row, col)}
      $isSelected={isSelected}
      $isProcessing={isProcessing}
      $isEmpty={false}
      className="relative flex items-center justify-center cursor-pointer transition-all duration-300"
    >
      <TileInner 
        $color={typeInfo.color}
        className="w-[85%] h-[85%] rounded-lg flex items-center justify-center text-3xl shadow-lg border-2 border-white/10"
      >
        {typeInfo.symbol}
        
        {tile.isSpecial && (
          <SpecialOverlay $type={tile.specialType} className="absolute inset-0 rounded-lg pointer-events-none">
            {tile.specialType === 'striker' && <div className="absolute inset-0 animate-pulse border-2 border-sg-electric-blue rounded-lg" />}
            {tile.specialType === 'monarch' && <div className="absolute inset-0 animate-pulse border-2 border-sg-gold rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.8)]" />}
            {tile.specialType === 'domain' && <div className="absolute inset-0 animate-pulse border-2 border-sg-purple rounded-lg shadow-[0_0_15px_rgba(123,44,191,0.8)]" />}
          </SpecialOverlay>
        )}
      </TileInner>
    </TileContainer>
  );
};

const TileContainer = styled.div`
  aspect-ratio: 1;
  transform: ${props => props.$isSelected ? 'scale(1.1)' : 'scale(1)'};
  z-index: ${props => props.$isSelected ? '10' : '1'};
  opacity: ${props => props.$isEmpty ? '0' : '1'};
  
  &:hover {
    transform: ${props => !props.$isProcessing && !props.$isSelected && !props.$isEmpty ? 'scale(1.05)' : ''};
  }
`;

const TileInner = styled.div`
  background: ${props => `radial-gradient(circle at center, ${props.$color}44 0%, ${props.$color}22 100%)`};
  border-color: ${props => `${props.$color}66`};
`;

const SpecialOverlay = styled.div``;

export default Tile;
