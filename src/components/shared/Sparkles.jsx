import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Reusable Sparkles/Glitter Component
 * Creates a burst of sparkles at a specific location or full screen
 */
const Sparkles = ({ active, x, y, count = 50, duration = 1 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: (x || 50) + (Math.random() - 0.5) * 40,
        y: (y || 50) + (Math.random() - 0.5) * 40,
        rotation: Math.random() * 360,
        scale: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 1 + 0.8,
        delay: Math.random() * 0.2
      }));
      setParticles(newParticles);
    }
  }, [active, x, y, count]);

  if (!active && particles.length === 0) return null;

  return (
    <GlitterContainer>
      {particles.map(particle => (
        <Sparkle
          key={particle.id}
          $x={particle.x}
          $y={particle.y}
          $rotation={particle.rotation}
          $scale={particle.scale}
          $duration={particle.duration}
          $delay={particle.delay}
        >
          ✨
        </Sparkle>
      ))}
    </GlitterContainer>
  );
};

const GlitterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
`;

const Sparkle = styled.div`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  font-size: 24px;
  pointer-events: none;
  animation: sparkleFloat ${props => props.$duration}s ease-out forwards;
  animation-delay: ${props => props.$delay}s;
  
  @keyframes sparkleFloat {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(${props => props.$scale}) rotate(${props => props.$rotation}deg);
    }
    100% {
      opacity: 0;
      transform: translate(
        calc(-50% + ${props => (Math.random() - 0.5) * 200}px),
        calc(-50% + ${props => (Math.random() - 0.5) * 200}px)
      ) scale(0) rotate(${props => props.$rotation + 360}deg);
    }
  }
`;

export default Sparkles;
