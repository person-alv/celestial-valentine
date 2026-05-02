import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Level 2: The Garden of Rhythm
 * Theme: Twilight, Music, Connection
 * Color Palette: Indigo, Hot Pink, Golden
 */

const Level2 = ({ children }) => {
  return (
    <LevelContainer className="absolute inset-0">
      {/* Twilight Sky Background */}
      <Background className="absolute inset-0" />

      {/* Floating Musical Notes */}
      <NotesContainer className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <MusicalNote
            key={i}
            style={{
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 8 + 's',
              animationDuration: (8 + Math.random() * 6) + 's',
              fontSize: (12 + Math.random() * 12) + 'px'
            }}
          >
            {['🎵', '🎶', '♪', '♫'][Math.floor(Math.random() * 4)]}
          </MusicalNote>
        ))}
      </NotesContainer>

      {/* Vinyl Records Decorations */}
      <VinylDecor className="absolute bottom-10 left-10 opacity-20">
        <div className="text-6xl">💿</div>
      </VinylDecor>
      <VinylDecor className="absolute top-20 right-20 opacity-15">
        <div className="text-4xl">🎧</div>
      </VinylDecor>

      {/* Game Content */}
      <ContentWrapper className="relative z-10 w-full h-full">
        {children}
      </ContentWrapper>
    </LevelContainer>
  );
};

const LevelContainer = styled.div``;

const Background = styled.div`
  background: linear-gradient(to bottom, #4B0082 0%, #663399 50%, #FF69B4 100%);
`;

const NotesContainer = styled.div`
  z-index: 1;
`;

const drift = keyframes`
  0% {
    transform: translateY(110vh) translateX(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(50vh) translateX(30px) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-10vh) translateX(-30px) rotate(360deg);
    opacity: 0.4;
  }
`;

const MusicalNote = styled.div`
  position: absolute;
  animation: ${drift} linear infinite;
  color: #FFD700;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6));
`;

const VinylDecor = styled.div`
  z-index: 1;
  animation: ${keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`} 20s linear infinite;
`;

const ContentWrapper = styled.div``;

export default Level2;
