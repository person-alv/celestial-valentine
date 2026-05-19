import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getBossByLevel } from '../../../data/shadow-garden/bosses';

const BossBar = () => {
  const { currentBossHealth, maxBossHealth, currentLevel } = useSelector(state => state.shadowGarden);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [currentLevel]);

  const healthPercent = (currentBossHealth / maxBossHealth) * 100;
  const boss = getBossByLevel(currentLevel);

  return (
    <Container className="w-full max-w-2xl px-3 md:px-4 py-1.5 md:py-2 bg-black/60 border-b-2 border-sg-purple/50 backdrop-blur-md flex items-center gap-2 md:gap-4">
      <BossIcon className="w-12 h-12 md:w-20 md:h-20 flex-shrink-0 rounded-full bg-sg-midnight border-2 border-sg-purple flex items-center justify-center text-xl md:text-3xl shadow-[0_0_15px_rgba(123,44,191,0.5)]">
        {!imgFailed
          ? <img
              src={`/images/bosses/boss_${currentLevel}.png`}
              alt={boss.name}
              onError={() => setImgFailed(true)}
              draggable={false}
              style={{ width: '96%', height: '96%', objectFit: 'cover', borderRadius: '50%', userSelect: 'none' }}
            />
          : boss.emoji
        }
      </BossIcon>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1 gap-2">
          <BossName className="font-orbitron text-sg-gold text-sm md:text-lg tracking-wider truncate">{boss.name}</BossName>
          <HPText className="font-mono text-[10px] md:text-xs text-white/60 flex-shrink-0">
            <span className="hidden md:inline">HP: {Math.floor(currentBossHealth)} / {maxBossHealth}</span>
            <span className="md:hidden">{Math.floor(currentBossHealth / 1000)}k</span>
          </HPText>
        </div>

        <BarContainer className="h-3 md:h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
          <HealthBar
            $percent={healthPercent}
            className="h-full bg-gradient-to-r from-red-600 to-rose-400 shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all duration-500 ease-out"
          />
        </BarContainer>
      </div>

      <Hearts className="hidden md:flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`text-sm ${i < Math.ceil(healthPercent / 20) ? 'text-red-500' : 'text-white/20'}`}>❤️</div>
        ))}
      </Hearts>
    </Container>
  );
};

const Container = styled.div``;
const BossIcon = styled.div``;
const BossName = styled.h3``;
const HPText = styled.span``;
const BarContainer = styled.div``;
const HealthBar = styled.div`
  width: ${props => props.$percent}%;
`;
const Hearts = styled.div``;

export default BossBar;
