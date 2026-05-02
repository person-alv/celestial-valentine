import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { gameAnimations } from '../../../utils/animations';

const Boss = ({ currentBossHealth, maxBossHealth }) => {
  const { currentLevel } = useSelector(state => state.shadowGarden);
  const bossRef = useRef(null);
  const prevHealth = useRef(currentBossHealth);

  const bossData = {
    1: { name: 'Hesitation', symbol: '🔘', color: '#808080' },
    2: { name: 'Silence', symbol: '🔇', color: '#4682B4' },
    3: { name: 'Loneliness', symbol: '👻', color: '#7B2CBF' },
    4: { name: 'Distance', symbol: '👤', color: '#000000' },
    5: { name: 'Final Trial', symbol: '💎', color: '#FFD700' }
  };

  const currentBoss = bossData[currentLevel] || bossData[1];

  useEffect(() => {
    if (currentBossHealth < prevHealth.current) {
      gameAnimations.bossHit(bossRef.current);
    }
    prevHealth.current = currentBossHealth;
  }, [currentBossHealth]);

  return (
    <BossContainer ref={bossRef} className="flex flex-col items-center">
      <BossVisual 
        $color={currentBoss.color}
        className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-2xl relative"
      >
        {currentBoss.symbol}
        
        {/* Evil Aura */}
        <div className="absolute inset-0 rounded-full animate-pulse border-4 border-black/20" />
        
        {/* Damage Indicators */}
        {currentBossHealth < maxBossHealth * 0.5 && (
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">💢</div>
        )}
      </BossVisual>
      <BossLabel className="font-orbitron text-xs text-white/40 mt-2 uppercase tracking-widest">
        {currentBoss.name}
      </BossLabel>
    </BossContainer>
  );
};

const BossContainer = styled.div``;
const BossVisual = styled.div`
  background: ${props => `radial-gradient(circle at center, ${props.$color} 0%, #000 100%)`};
  border: 4px solid ${props => props.$color}44;
`;
const BossLabel = styled.span``;

export default Boss;
