import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const FaithAvatar = ({ comboCount, isProcessing }) => {
  const { currentBossHealth, maxBossHealth } = useSelector(state => state.shadowGarden);
  
  const expression = useMemo(() => {
    if (comboCount >= 5) return '🤩'; // Excited
    if (comboCount >= 3) return '😊'; // Happy
    if (isProcessing) return '🧐'; // Thinking/Processing
    if (currentBossHealth < maxBossHealth * 0.25) return '💪'; // Determined
    return '👩‍🎨'; // Idle
  }, [comboCount, isProcessing, currentBossHealth, maxBossHealth]);

  const getAuraColor = () => {
    if (comboCount >= 5) return 'rgba(255, 215, 0, 0.6)';
    if (comboCount >= 3) return 'rgba(255, 182, 193, 0.6)';
    return 'transparent';
  };

  return (
    <div className="flex flex-col items-center">
      <AvatarContainer 
        $auraColor={getAuraColor()}
        className="w-24 h-24 rounded-full bg-sg-midnight border-4 border-sg-rose flex items-center justify-center text-5xl relative transition-all duration-300"
      >
        {expression}
        
        {/* Floating Hearts for high combos */}
        {comboCount >= 3 && (
          <div className="absolute -top-4 -right-2 animate-bounce">💖</div>
        )}
      </AvatarContainer>
      <span className="font-orbitron text-xs text-sg-pink mt-2 tracking-tighter">HUNTER FAITH</span>
    </div>
  );
};

const AvatarContainer = styled.div`
  box-shadow: 0 0 20px ${props => props.$auraColor};
  animation: ${props => props.$auraColor !== 'transparent' ? 'pulse 1s infinite' : 'none'};
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export default FaithAvatar;
