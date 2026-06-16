import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Level 3: The Doll Collector's Sanctuary
 * Theme: Warmth, Comfort, Cozy Intimate Space
 * Color Palette: Saddle Brown, Chocolate, Light Pink
 */

const Level3 = ({ children }) => {
  return (
    <LevelContainer className="absolute inset-0">
      {/* Warm Cozy Background */}
      <Background className="absolute inset-0" />

      {/* Floating Dolls/Plushies */}
      <DollsContainer className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🧸', '🎀', '🌸', '💝'].map((emoji, i) => (
          <FloatingDoll
            key={i}
            style={{
              left: (i * 25 + 5) + '%',
              animationDelay: i * 1.5 + 's',
              animationDuration: (6 + i) + 's'
            }}
          >
            {emoji}
          </FloatingDoll>
        ))}
      </DollsContainer>

      {/* Warm Glow Effects */}
      <WarmGlow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" />

      {/* Shelf Silhouettes (Decorative) */}
      <ShelfDecor className="absolute bottom-20 left-0 right-0 h-2 bg-[#8B4513] opacity-30" />
      <ShelfDecor className="absolute top-32 left-0 right-0 h-2 bg-[#8B4513] opacity-20" />

      {/* Game Content */}
      <ContentWrapper className="relative z-10 w-full h-full">
        {children}
      </ContentWrapper>
    </LevelContainer>
  );
};

const LevelContainer = styled.div``;

const Background = styled.div`
  background: linear-gradient(to bottom, #2C1810 0%, #5D4037 50%, #8B4513 100%);
`;

const DollsContainer = styled.div`
  z-index: 1;
`;

const sway = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 1;
  }
`;

const FloatingDoll = styled.div`
  position: absolute;
  top: 20%;
  font-size: 30px;
  animation: ${sway} ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 182, 193, 0.4));
`;

const glow = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
`;

const WarmGlow = styled.div`
  background: radial-gradient(
    circle,
    rgba(255, 140, 0, 0.2) 0%,
    transparent 70%
  );
  animation: ${glow} 8s ease-in-out infinite;
  z-index: 1;
`;

const ShelfDecor = styled.div`
  z-index: 1;
`;

const ContentWrapper = styled.div``;

export default Level3;
