import React from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

const LoveMeter = () => {
  const { loveMeter, currentLevel } = useSelector(state => state.shadowGarden);
  
  if (currentLevel !== 5) return null;

  return (
    <Container className="w-full max-w-md px-6 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-sg-pink/30 flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <span className="font-orbitron text-[10px] text-sg-pink tracking-widest uppercase">Love Meter</span>
        <span className="font-mono text-[10px] text-white/60">{Math.floor(loveMeter)}%</span>
      </div>
      
      <BarContainer className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
        <Fill
          $percent={loveMeter}
          className="h-full bg-gradient-to-r from-sg-pink to-sg-rose transition-all duration-500 relative"
        >
          <Shimmer />
        </Fill>
        <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-40">
          <span>❤️</span><span>💖</span><span>💕</span>
        </div>
      </BarContainer>
    </Container>
  );
};

const shimmerAnim = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const Container = styled.div``;
const BarContainer = styled.div``;
const Fill = styled.div`
  width: ${props => props.$percent}%;
`;
const Shimmer = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: ${shimmerAnim} 2s linear infinite;
`;

export default LoveMeter;
