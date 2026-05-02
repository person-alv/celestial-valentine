import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { refillPower } from '../../../store/slices/shadowGardenSlice';
import { useSound } from '../../../hooks/useSound';

const MysteryBox = ({ onAlvinBlessing }) => {
  const dispatch = useDispatch();
  const { playSFX } = useSound();
  const { unlockedPowers } = useSelector(state => state.shadowGarden);
  const [isOpened, setIsOpened] = useState(false);
  const [rewardText, setRewardText] = useState(null);

  const handleOpen = () => {
    if (isOpened) return;

    setIsOpened(true);
    playSFX('sparkle', '/sounds/sparkle.mp3');

    const rng = Math.floor(Math.random() * 3);

    if (rng === 0) {
      setRewardText("Power Refill! ⚡");
      const randomPowerId = unlockedPowers[Math.floor(Math.random() * unlockedPowers.length)];
      dispatch(refillPower(randomPowerId));
    } else if (rng === 1) {
      setRewardText("Alvin's Blessing! 💖");
      if (onAlvinBlessing) onAlvinBlessing();
    } else {
      setRewardText("Shadow Boost! 🌑");
    }

    setTimeout(() => setRewardText(null), 3000);
  };

  return (
    <div className="flex flex-col items-center">
      <BoxContainer 
        onClick={handleOpen}
        $isOpened={isOpened}
        className={`w-20 h-20 flex items-center justify-center text-4xl transition-all duration-500 cursor-pointer ${isOpened ? 'opacity-50 grayscale' : 'animate-bounce'}`}
      >
        {isOpened ? '📦' : '🎁'}
        
        {!isOpened && (
          <div className="absolute inset-0 bg-sg-gold/20 animate-ping rounded-xl pointer-events-none" />
        )}
      </BoxContainer>
      
      {rewardText && (
        <RewardPopup className="font-bangers text-sg-gold text-center whitespace-nowrap mt-2">
          {rewardText}
        </RewardPopup>
      )}
      
      <span className="font-mono text-[8px] text-white/30 uppercase mt-1">S-Rank Box</span>
    </div>
  );
};

const BoxContainer = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid ${props => props.$isOpened ? 'transparent' : '#FFD700'};
  border-radius: 12px;
`;

const RewardPopup = styled.div`
  animation: rewardSlide 0.5s ease-out;
  @keyframes rewardSlide {
    0% { transform: translateY(10px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
`;

export default MysteryBox;
