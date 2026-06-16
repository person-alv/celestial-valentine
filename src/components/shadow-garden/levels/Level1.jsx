import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Level 1: The Garden of First Encounters
 * Theme: Morning, Cherry Blossoms, New Beginnings
 * Color Palette: Pink, Sky Blue, Golden
 */

const Level1 = ({ children }) => {
  return (
    <LevelContainer className="absolute inset-0">
      {/* Morning Sky Background */}
      <Background className="absolute inset-0" />

      {/* Floating Cherry Blossoms */}
      <PetalsContainer className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <Petal
            key={i}
            style={{
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's',
              animationDuration: (10 + Math.random() * 10) + 's'
            }}
          >
            🌸
          </Petal>
        ))}
      </PetalsContainer>

      {/* Sunrays */}
      <Sunrays className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20" />

      {/* Game Content */}
      <ContentWrapper className="relative z-10 w-full h-full">
        {children}
      </ContentWrapper>
    </LevelContainer>
  );
};

const LevelContainer = styled.div``;

const Background = styled.div`
  background: linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #FFB6C1 100%);
`;

const PetalsContainer = styled.div`
  z-index: 1;
`;

const float = keyframes`
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(50vh) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0.3;
  }
`;

const Petal = styled.div`
  position: absolute;
  font-size: 20px;
  animation: ${float} linear infinite;
  filter: drop-shadow(0 0 3px rgba(255, 182, 193, 0.5));
`;

const Sunrays = styled.div`
  background: radial-gradient(
    ellipse at top,
    rgba(255, 223, 0, 0.3) 0%,
    transparent 60%
  );
`;

const ContentWrapper = styled.div``;

export default Level1;
