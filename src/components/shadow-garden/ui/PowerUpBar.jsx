import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { powerups } from '../../../data/shadow-garden/powerups';

const PowerUpBar = ({ onActivate, isFreeSwapActive, vertical = false, compact = false }) => {
  const { powerUsages, unlockedPowers } = useSelector(state => state.shadowGarden);
  const [failedIcons, setFailedIcons] = useState(new Set());

  // compact = mobile horizontal bar (36px tiles, tight gaps)
  const containerLayout = vertical
    ? 'flex-col gap-2 p-3'
    : compact
    ? 'flex-row gap-1 p-1.5 w-full'
    : 'flex-row gap-3 p-4';

  // compact = mobile dock: tiles fluid-fill the row (square), so all 7 powers stay
  // clearly identifiable and never overflow — from ~38px on 375px up to 46px on 430px.
  const tileSize = vertical
    ? 'w-10 h-10 rounded-lg'
    : compact
    ? 'flex-1 aspect-square min-w-0 max-w-[46px] rounded-lg'
    : 'w-14 h-14 rounded-full';

  return (
    <Container className={`flex glass-card bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md ${containerLayout}`}>
      {!vertical && !compact && <h4 className="font-orbitron text-[10px] text-sg-purple tracking-widest self-center mr-2">LEGENDARY POWERS</h4>}

      {powerups.map(power => {
        const isUnlocked = unlockedPowers.includes(power.id);
        const charges = powerUsages[power.id] || 0;
        const isActive = power.id === 2 && isFreeSwapActive;

        return (
          <PowerItem
            key={power.id}
            onClick={() => isUnlocked && charges > 0 && onActivate(power.id)}
            $isUnlocked={isUnlocked}
            $hasCharges={charges > 0}
            $isActive={isActive}
            $color={power.color}
            title={isUnlocked ? `${power.name} (${charges} uses)` : `Locked: ${power.name}`}
            className={`relative flex items-center justify-center text-xl transition-all duration-300 ${tileSize} ${isUnlocked && charges > 0 ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-not-allowed grayscale'}`}
          >
            {isUnlocked
              ? (!failedIcons.has(power.id)
                  ? <img
                      src={`/images/powers/icon_${power.id}.png`}
                      alt={power.name}
                      onError={() => setFailedIcons(prev => new Set([...prev, power.id]))}
                      draggable={false}
                      style={{ width: '65%', height: '65%', objectFit: 'contain', userSelect: 'none' }}
                    />
                  : power.icon)
              : '🔒'
            }

            {isUnlocked && (
              <ChargeBadge className={`absolute rounded-full bg-sg-shadow border border-white/20 flex items-center justify-center font-mono text-white ${vertical || compact ? '-bottom-0.5 -right-0.5 w-4 h-4 text-[7px]' : '-bottom-1 -right-1 w-6 h-6 text-[10px]'}`}>
                {charges}
              </ChargeBadge>
            )}

            {isActive && (
              <div className="absolute inset-0 rounded-full border-2 border-sg-gold animate-ping" />
            )}
          </PowerItem>
        );
      })}
    </Container>
  );
};

const Container = styled.div``;

const PowerItem = styled.div`
  background: ${props => props.$isUnlocked ? `rgba(255, 255, 255, 0.1)` : `rgba(0, 0, 0, 0.4)`};
  border: 2px solid ${props => props.$isActive ? props.$color : props.$isUnlocked ? `${props.$color}44` : 'transparent'};
  box-shadow: ${props => props.$isActive ? `0 0 15px ${props.$color}` : 'none'};
`;

const ChargeBadge = styled.div``;

export default PowerUpBar;
