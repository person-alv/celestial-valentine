import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { soundManager } from '../hooks/useSound';
import SoundManagerUI from '../components/shared/SoundManager';
import { VALENTINE_DATE } from '../utils/constants';
import { updateProgress } from '../store/slices/valentineSlice';

// Import phase components
import PhaseAsk from '../components/phases/Phase1_Ask';
import PhaseCountdown from '../components/phases/Phase2_Countdown';
import PhaseFireworks from '../components/phases/Phase3_Fireworks';
import PhaseConstellations from '../components/phases/Phase4_Constellations';
import PhaseLetter from '../components/phases/Phase5_Letter';

/**
 * ValentineGame Route
 * Refactored from the original App.js to work with Redux and Routing
 */
const ValentineGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const progress = useSelector((state) => state.valentine);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Determine which phase to display based on progress and date
   */
  const currentPhase = useMemo(() => {
    // Phase 5: Letter already completed
    if (progress.completionDate) {
      return 5;
    }

    // Phase 4: In the middle of constellation puzzle
    if (progress.phase === 4 && progress.constellationsCompleted?.length > 0) {
      return 4;
    }

    // Phase 3 or 4: Accepted and it's Valentine's Day
    if (progress.acceptedDate) {
      const now = new Date();
      if (now >= VALENTINE_DATE) {
        // Show fireworks if not seen yet, otherwise constellation puzzle
        return progress.hasSeenFireworks ? 4 : 3;
      } else {
        // Still before Valentine's Day, show countdown
        return 2;
      }
    }

    // Phase 1: Fresh start, show the "Ask"
    return 1;
  }, [progress]);

  /**
   * Load all sound effects
   */
  const loadSounds = useCallback(() => {
    const sounds = [
      'buttonEscape', 'screenShake', 'sparkle', 'tap', 'firework',
      'starSelect', 'starConnect', 'error', 'shimmer', 'scroll', 'success'
    ];

    sounds.forEach(sound => {
      soundManager.loadSound(sound, `/sounds/${sound}.mp3`);
    });
  }, []);

  useEffect(() => {
    loadSounds();
    // Start background music
    soundManager.playBackground('/sounds/background-romantic.mp3', 0.3);
    setIsLoading(false);
  }, [loadSounds]);

  /**
   * Handle phase transitions and progress updates
   */
  const handleUpdateProgress = (updates) => {
    dispatch(updateProgress(updates));
  };

  const handlePhaseTransition = (nextPhase, data = {}) => {
    handleUpdateProgress({ ...data, phase: nextPhase });
  };

  const handleAccept = () => {
    handlePhaseTransition(2, { acceptedDate: new Date().toISOString() });
  };

  const handleCountdownComplete = () => {
    handlePhaseTransition(3);
  };

  const handleFireworksStart = () => {
    handlePhaseTransition(4, { hasSeenFireworks: true });
  };

  const handleConstellationsComplete = (data) => {
    handlePhaseTransition(5, { 
      completionDate: new Date().toISOString(),
      ...data 
    });
  };

  const handleConstellationProgress = (progressData) => {
    handleUpdateProgress(progressData);
  };

  const handlePlayAgain = () => {
    dispatch(updateProgress({
      phase: 3,
      constellationsCompleted: [],
      viewedNotes: [],
      hasSeenFireworks: false,
      completionDate: null
    }));
  };

  const handleExitToHub = () => {
    soundManager.stopBackground();
    navigate('/');
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        Loading...
      </LoadingContainer>
    );
  }

  return (
    <GameWrapper>
      <SoundManagerUI />
      
      <ExitButton onClick={handleExitToHub} title="Return to Hub">
        🏠
      </ExitButton>

      {/* Phase 1: The Playful Ask */}
      {currentPhase === 1 && (
        <PhaseAsk onAccept={handleAccept} />
      )}

      {/* Phase 2: The Countdown */}
      {currentPhase === 2 && (
        <PhaseCountdown onComplete={handleCountdownComplete} />
      )}

      {/* Phase 3: The Fireworks */}
      {currentPhase === 3 && (
        <PhaseFireworks onStart={handleFireworksStart} />
      )}

      {/* Phase 4: The Constellation Puzzle */}
      {currentPhase === 4 && (
        <PhaseConstellations
          progress={progress}
          onComplete={handleConstellationsComplete}
          onProgress={handleConstellationProgress}
        />
      )}

      {/* Phase 5: The Love Letter */}
      {currentPhase === 5 && (
        <PhaseLetter onPlayAgain={handlePlayAgain} />
      )}
    </GameWrapper>
  );
};

const GameWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  color: white;
`;

const ExitButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default ValentineGame;
