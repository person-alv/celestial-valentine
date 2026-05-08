import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const EXPRESSION_EMOJIS = {
  idle: '👩‍🎨', happy: '😊', excited: '🤩', thinking: '🧐', determined: '💪',
};

const FaithAvatar = ({ comboCount, isProcessing }) => {
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
        className="w-24 h-24 rounded-full bg-sg-midnight border-4 border-sg-rose flex items-center justify-center text-5xl relative transition-all duration-300"
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
    0%   { transform: scale(1); }
    50%  { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export default FaithAvatar;
