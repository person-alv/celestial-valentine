import React, { useState } from 'react';
import styled from 'styled-components';
import { useSound } from '../../hooks/useSound';

/**
 * Sound Manager UI Component
 * Provides floating mute toggle buttons for Music and SFX independently
 */
const SoundManager = () => {
  const { toggleSFX, toggleMusic, isSFXMuted, isMusicMuted } = useSound();
  
  const [sfxMuted, setSfxMuted] = useState(isSFXMuted());
  const [musicMuted, setMusicMuted] = useState(isMusicMuted());

  const handleToggleSFX = () => {
    setSfxMuted(toggleSFX());
  };

  const handleToggleMusic = () => {
    setMusicMuted(toggleMusic());
  };

  return (
    <ControlPanel>
      <MuteButton 
        onClick={handleToggleMusic} 
        aria-label={musicMuted ? "Unmute music" : "Mute music"}
        title="Toggle Background Music"
      >
        {musicMuted ? '🔇' : '🎵'}
      </MuteButton>
      <MuteButton 
        onClick={handleToggleSFX} 
        aria-label={sfxMuted ? "Unmute SFX" : "Mute SFX"}
        title="Toggle Sound Effects"
      >
        {sfxMuted ? '🔕' : '🔊'}
      </MuteButton>
    </ControlPanel>
  );
};

const ControlPanel = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 9999;
`;

const MuteButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1) translateY(-2px);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
`;

export default SoundManager;