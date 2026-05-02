import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Level 5: The Heart Domain - Final Gate
 * Theme: Cosmos, Aurora, Infinite Love, Ethereal
 * Color Palette: Deep Space, Purple, Rose Pink
 */

const Level5 = ({ children }) => {
  return (
    <LevelContainer className="absolute inset-0">
      {/* Cosmic Background */}
      <Background className="absolute inset-0" />

      {/* Twinkling Stars */}
      <StarsContainer className="absolute inset-0 pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <Star
            key={i}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: (2 + Math.random() * 3) + 's',
              fontSize: (2 + Math.random() * 3) + 'px'
            }}
          />
        ))}
      </StarsContainer>

      {/* Aurora Borealis Effect */}
      <Aurora className="absolute inset-0 pointer-events-none" />

      {/* Floating Hearts */}
      <HeartsContainer className="absolute inset-0 pointer-events-none overflow-hidden">
        {['💖', '💕', '💗', '💝', '❤️'].map((heart, i) => (
          <FloatingHeart
            key={i}
            style={{
              left: (i * 20 + 10) + '%',
              animationDelay: i * 1.2 + 's',
              animationDuration: (10 + i * 2) + 's'
            }}
          >
            {heart}
          </FloatingHeart>
        ))}
      </HeartsContainer>

      {/* Nebula Glow */}
      <NebulaGlow className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none" />
      <NebulaGlow2 className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" />

      {/* Game Content */}
      <ContentWrapper className="relative z-10 w-full h-full">
        {children}
      </ContentWrapper>
    </LevelContainer>
  );
};

const LevelContainer = styled.div``;

const Background = styled.div`
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a14 50%, #000000 100%);
`;

const StarsContainer = styled.div`
  z-index: 1;
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
  animation: ${twinkle} ease-in-out infinite;
`;

const wave = keyframes`
  0% { transform: translateX(-50%) translateY(0) scaleY(1); opacity: 0.3; }
  50% { transform: translateX(-50%) translateY(-20px) scaleY(1.1); opacity: 0.6; }
  100% { transform: translateX(-50%) translateY(0) scaleY(1); opacity: 0.3; }
`;

const Aurora = styled.div`
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(123, 44, 191, 0.3) 20%,
    rgba(255, 105, 180, 0.3) 40%,
    rgba(255, 182, 193, 0.3) 60%,
    rgba(123, 44, 191, 0.3) 80%,
    transparent 100%
  );
  height: 200px;
  top: 30%;
  left: 50%;
  width: 150%;
  transform: translateX(-50%);
  filter: blur(60px);
  animation: ${wave} 12s ease-in-out infinite;
  z-index: 2;
`;

const HeartsContainer = styled.div`
  z-index: 3;
`;

const rise = keyframes`
  0% {
    transform: translateY(110vh) scale(0.5) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10vh) scale(1.2) rotate(360deg);
    opacity: 0;
  }
`;

const FloatingHeart = styled.div`
  position: absolute;
  font-size: 24px;
  animation: ${rise} linear infinite;
  filter: drop-shadow(0 0 10px rgba(255, 182, 193, 0.8));
`;

const nebulaPulse = keyframes`
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.2);
  }
`;

const NebulaGlow = styled.div`
  background: radial-gradient(
    circle,
    rgba(123, 44, 191, 0.4) 0%,
    rgba(255, 105, 180, 0.2) 40%,
    transparent 70%
  );
  animation: ${nebulaPulse} 10s ease-in-out infinite;
  filter: blur(80px);
  z-index: 1;
`;

const NebulaGlow2 = styled.div`
  background: radial-gradient(
    circle,
    rgba(255, 182, 193, 0.3) 0%,
    rgba(123, 44, 191, 0.2) 40%,
    transparent 70%
  );
  animation: ${nebulaPulse} 12s ease-in-out infinite;
  animation-delay: 2s;
  filter: blur(80px);
  z-index: 1;
`;

const ContentWrapper = styled.div``;

export default Level5;
