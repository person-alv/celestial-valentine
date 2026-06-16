import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const EXPRESSION_EMOJIS = {
  idle: '👩‍🎨', happy: '😊', excited: '🤩', thinking: '🧐', determined: '💪',
};

const FaithAvatar = ({ comboCount, isProcessing, compact = false }) => {
  const { currentBossHealth, maxBossHealth } = useSelector(state => state.shadowGarden);

  const expressionKey = useMemo(() => {
    if (comboCount >= 5) return 'excited';
    if (comboCount >= 3) return 'happy';
    if (isProcessing) return 'thinking';
    if (currentBossHealth < maxBossHealth * 0.25) return 'determined';
    return 'idle';
  }, [comboCount, isProcessing, currentBossHealth, maxBossHealth]);

  const [imgFailed, setImgFailed] = useState(false);

  // Reset per-expression failure when expression changes
  useEffect(() => {
    setImgFailed(false);
  }, [expressionKey]);

  const getAuraColor = () => {
    if (comboCount >= 5) return 'rgba(255, 215, 0, 0.6)';
    if (comboCount >= 3) return 'rgba(255, 182, 193, 0.6)';
    return 'transparent';
  };

  return (
    <div className="flex flex-col items-center">
      <AvatarContainer
        $auraColor={getAuraColor()}
        $compact={compact}
        style={compact ? { width: 'clamp(56px, 10dvh, 92px)', height: 'clamp(56px, 10dvh, 92px)' } : undefined}
        className={`${compact ? 'border-2 text-3xl' : 'w-24 h-24 border-4 text-5xl'} rounded-full bg-sg-midnight border-sg-rose flex items-center justify-center relative transition-all duration-300`}
      >
        {!imgFailed
          ? <img
              src={`/images/avatars/faith_${expressionKey}.png`}
              alt={expressionKey}
              onError={() => setImgFailed(true)}
              draggable={false}
              style={{ width: '92%', height: '92%', objectFit: 'cover', borderRadius: '50%', userSelect: 'none' }}
            />
          : EXPRESSION_EMOJIS[expressionKey]
        }

        {comboCount >= 3 && (
          <div className={`absolute animate-bounce ${compact ? '-top-2 -right-1 text-xs' : '-top-4 -right-2'}`}>💖</div>
        )}
      </AvatarContainer>
      <span className={`font-orbitron text-sg-pink tracking-tighter ${compact ? 'text-[8px] mt-0.5' : 'text-xs mt-2'}`}>
        {compact ? 'FAITH' : 'HUNTER FAITH'}
      </span>
    </div>
  );
};

const AvatarContainer = styled.div`
  box-shadow: ${props =>
    props.$auraColor !== 'transparent'
      ? `0 0 20px ${props.$auraColor}`
      : props.$compact
      ? '0 0 10px rgba(255, 182, 193, 0.55)'  /* slight idle glow in the mobile stat row */
      : 'none'};
  animation: ${props => props.$auraColor !== 'transparent' ? 'pulse 1s infinite' : 'none'};

  @keyframes pulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export default FaithAvatar;
