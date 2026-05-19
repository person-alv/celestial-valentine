import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { refillAllPowers } from '../../../store/slices/shadowGardenSlice';
import { useSound } from '../../../hooks/useSound';

const MysteryBox = ({ onAlvinBlessing, compact = false }) => {
  const dispatch = useDispatch();
  const { playSFX } = useSound();
  const [isOpened, setIsOpened] = useState(false);
  const [rewardText, setRewardText] = useState(null);
  const [closedImgFailed, setClosedImgFailed] = useState(false);
  const [openedImgFailed, setOpenedImgFailed] = useState(false);

  const handleOpen = () => {
    if (isOpened) return;

    setIsOpened(true);
    playSFX('sparkle', '/sounds/sparkle.mp3');

    const rng = Math.floor(Math.random() * 3);

    if (rng === 0) {
      setRewardText("Power Refill! ⚡");
      dispatch(refillAllPowers());
    } else if (rng === 1) {
      setRewardText("Alvin's Blessing! 💖");
      if (onAlvinBlessing) onAlvinBlessing();
    } else {
      setRewardText("Shadow Boost! 🌑");
    }

    setTimeout(() => setRewardText(null), 3000);
  };

  const sizeClass = compact ? 'w-9 h-9 text-xl rounded-lg' : 'w-24 h-24 text-5xl rounded-xl';

  return (
    <div className="flex flex-col items-center">
      <BoxContainer
        onClick={handleOpen}
        $isOpened={isOpened}
        className={`${sizeClass} flex items-center justify-center transition-all duration-500 cursor-pointer relative ${isOpened ? 'opacity-50 grayscale' : 'animate-bounce'}`}
      >
        {isOpened
          ? (openedImgFailed
              ? '📦'
              : <img
                  src="/images/mystery_box/box_opened.png"
                  alt="opened"
                  onError={() => setOpenedImgFailed(true)}
                  draggable={false}
                  style={{ width: '90%', height: '90%', objectFit: 'contain', userSelect: 'none' }}
                />)
          : (closedImgFailed
              ? '🎁'
              : <img
                  src="/images/mystery_box/box_closed.png"
                  alt="Mystery Box"
                  onError={() => setClosedImgFailed(true)}
                  draggable={false}
                  style={{ width: '90%', height: '90%', objectFit: 'contain', userSelect: 'none' }}
                />)
        }

        {!isOpened && (
          <div className="absolute inset-0 bg-sg-gold/20 animate-ping rounded-xl pointer-events-none" />
        )}
      </BoxContainer>

      {rewardText && (
        <RewardPopup className="font-bangers text-sg-gold text-center whitespace-nowrap mt-1 text-sm">
          {rewardText}
        </RewardPopup>
      )}

      {!compact && (
        <span className="font-mono text-[8px] text-white/30 uppercase mt-1">S-Rank Box</span>
      )}
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
