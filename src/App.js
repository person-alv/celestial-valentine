import React, { useState, useEffect, useCallback } from 'react';
import GlobalStyles from './styles/GlobalStyles';
import { soundManager } from './hooks/useSound';
import SoundManagerUI from './components/shared/SoundManager';
import { VALENTINE_DATE, STORAGE_KEYS, loadFromStorage, saveToStorage } from './utils/constants';

// Import phase components
import PhaseAsk from './components/phases/Phase1_Ask';
import PhaseCountdown from './components/phases/Phase2_Countdown';
import PhaseFireworks from './components/phases/Phase3_Fireworks';
import PhaseConstellations from './components/phases/Phase4_Constellations';
import PhaseLetter from './components/phases/Phase5_Letter';

/**
 * Main App Component
 * Manages the entire Valentine's experience flow
 */
function App() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Determine which phase to display based on progress and date
   */
  const determineCurrentPhase = useCallback((savedProgress) => {
    // Phase 5: Letter already completed
    if (savedProgress.completionDate) {
      return 5;
    }

    // Phase 4: In the middle of constellation puzzle
    if (savedProgress.phase === 4 && savedProgress.constellationsCompleted?.length > 0) {
      return 4;
    }

    // Phase 3 or 4: Accepted and it's Valentine's Day
    if (savedProgress.acceptedDate) {
      const now = new Date();
      if (now >= VALENTINE_DATE) {
        // Show fireworks if not seen yet, otherwise constellation puzzle
        return savedProgress.hasSeenFireworks ? 4 : 3;
      } else {
        // Still before Valentine's Day, show countdown
        return 2;
      }
    }

    // Phase 1: Fresh start, show the "Ask"
    return 1;
  }, []);

  /**
   * Load all sound effects
   */
  const loadSounds = useCallback(() => {
    const sounds = [
      'buttonEscape',
      'screenShake',
      'sparkle',
      'tap',
      'firework',
      'starSelect',
      'starConnect',
      'error',
      'shimmer',
      'scroll',
      'success'
    ];

    sounds.forEach(sound => {
      soundManager.loadSound(sound, `/sounds/${sound}.mp3`);
    });
  }, []);

  /**
   * Initialize the app:
   * - Load saved progress
   * - Determine current phase
   * - Load all sounds
   * - Start background music
   */
  const initializeApp = useCallback(() => {
    // Load saved progress from localStorage
    const savedProgress = loadFromStorage(STORAGE_KEYS.progress, {});
    setProgress(savedProgress);

    // Determine which phase to show based on saved data and current date
    const phase = determineCurrentPhase(savedProgress);
    setCurrentPhase(phase);

    // Load all sound effects
    loadSounds();

    // Start background music (will auto-play after first user interaction)
    soundManager.playBackground('/sounds/background-romantic.mp3', 0.3);

    setIsLoading(false);
  }, [determineCurrentPhase, loadSounds]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  /**
   * Update progress and save to localStorage
   */
  const updateProgress = (updates) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    saveToStorage(STORAGE_KEYS.progress, newProgress);
  };

  /**
   * Handle phase transitions
   */
  const handlePhaseTransition = (nextPhase, data = {}) => {
    updateProgress({ ...data, phase: nextPhase });
    setCurrentPhase(nextPhase);
  };

  /**
   * Handle "YES" click in Phase 1
   */
  const handleAccept = () => {
    handlePhaseTransition(2, { acceptedDate: new Date().toISOString() });
  };

  /**
   * Handle countdown completion (when Valentine's Day arrives)
   */
  const handleCountdownComplete = () => {
    handlePhaseTransition(3);
  };

  /**
   * Handle fireworks "START" button click
   */
  const handleFireworksStart = () => {
    handlePhaseTransition(4, { hasSeenFireworks: true });
  };

  /**
   * Handle constellation puzzle completion
   */
  const handleConstellationsComplete = (data) => {
    handlePhaseTransition(5, { 
      completionDate: new Date().toISOString(),
      ...data 
    });
  };

  /**
   * Handle constellation progress updates
   */
  const handleConstellationProgress = (progressData) => {
    updateProgress(progressData);
  };

  /**
   * Handle "Play Again" button
   */
  const handlePlayAgain = () => {
    // Reset only puzzle-related progress, keep acceptance
    const newProgress = {
      ...progress,
      phase: 3,
      solvedCount: 0,
      constellationsCompleted: [],
      viewedNotes: [],
      hasSeenFireworks: false,
      completionDate: null
    };
    setProgress(newProgress);
    saveToStorage(STORAGE_KEYS.progress, newProgress);
    setCurrentPhase(3);
  };

  // Resume audio on first interaction (browser requirement)
  useEffect(() => {
    const resumeAudio = () => {
      soundManager.playBackground('/sounds/background-romantic.mp3', 0.3);
      window.removeEventListener('mousedown', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
    };

    window.addEventListener('mousedown', resumeAudio);
    window.addEventListener('touchstart', resumeAudio);

    return () => {
      window.removeEventListener('mousedown', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
    };
  }, []);

  // Show loading state (you can customize this)
  if (isLoading) {
    return (
      <>
        <GlobalStyles />
        <div style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
          fontFamily: "'Quicksand', sans-serif",
          fontSize: '24px',
          color: 'white'
        }}>
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <SoundManagerUI />
      
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
    </>
  );
}

export default App;