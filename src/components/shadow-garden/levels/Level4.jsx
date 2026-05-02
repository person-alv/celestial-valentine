import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Level 4: The Domain of Legendary Powers
 * Theme: Epic Battle, Storm, Intensity
 * Color Palette: Black, Indigo, Golden
 */

const Level4 = ({ children }) => {
  return (
    <LevelContainer className="absolute inset-0">
      {/* Storm Background */}
      <Background className="absolute inset-0" />

      {/* Lightning Flashes */}
      <Lightning className="absolute inset-0 pointer-events-none" />

      {/* Floating Power Symbols */}
      <PowerSymbols className="absolute inset-0 pointer-events-none overflow-hidden">
        {['⚡', '👁️', '🗡️', '🔱', '⚔️', '💫'].map((symbol, i) => (
          <Symbol
            key={i}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: i * 0.8 + 's',
              animationDuration: (4 + Math.random() * 3) + 's'
            }}
          >
            {symbol}
          </Symbol>
        ))}
      </PowerSymbols>

      {/* Shadow Tendrils */}
      <ShadowEffects className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-black/80 to-transparent" />
      </ShadowEffects>

      {/* Game Content */}
      <ContentWrapper className="relative z-10 w-full h-full">
        {children}
      </ContentWrapper>
    </LevelContainer>
  );
};

const LevelContainer = styled.div``;

const Background = styled.div`
  background: linear-gradient(to bottom, #000000 0%, #1a0033 30%, #4B0082 100%);
`;

const flash = keyframes`
  0%, 90%, 100% { opacity: 0; }
  92%, 94% { opacity: 0.3; background: rgba(255, 255, 255, 0.1); }
  93% { opacity: 0.8; background: rgba(135, 206, 250, 0.2); }
`;

const Lightning = styled.div`
  z-index: 2;
  animation: ${flash} 7s ease-in-out infinite;
`;

const PowerSymbols = styled.div`
  z-index: 1;
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.4;
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4));
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 1;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
  }
`;

const Symbol = styled.div`
  position: absolute;
  font-size: 28px;
  color: #FFD700;
  animation: ${pulse} ease-in-out infinite;
`;

const ShadowEffects = styled.div`
  z-index: 1;
`;

const ContentWrapper = styled.div``;

export default Level4;
