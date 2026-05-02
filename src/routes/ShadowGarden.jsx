import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMatch3 } from '../hooks/useMatch3';
import { useSound } from '../hooks/useSound';
import gsap from 'gsap';
import { getLevelConfig } from '../data/shadow-garden/levels';

// Components
import Board from '../components/shadow-garden/game/Board';
import BossBar from '../components/shadow-garden/ui/BossBar';
import FaithAvatar from '../components/shadow-garden/ui/FaithAvatar';
import PowerUpBar from '../components/shadow-garden/ui/PowerUpBar';
import MysteryBox from '../components/shadow-garden/ui/MysteryBox';
import LoveMeter from '../components/shadow-garden/ui/LoveMeter';
import DomainExpansion from '../components/shadow-garden/effects/DomainExpansion';
import TutorialOverlay from '../components/shadow-garden/tutorial/TutorialOverlay';
import LoadingScreen from '../components/shared/LoadingScreen';

// Level Components
import Level1 from '../components/shadow-garden/levels/Level1';
import Level2 from '../components/shadow-garden/levels/Level2';
import Level3 from '../components/shadow-garden/levels/Level3';
import Level4 from '../components/shadow-garden/levels/Level4';
import Level5 from '../components/shadow-garden/levels/Level5';

// Store
import { setBossHealth, setCurrentLevel, rekindleJourney, setDomainExpansion } from '../store/slices/shadowGardenSlice';

const ShadowGarden = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    currentLevel, stats, currentBossHealth, maxBossHealth,
    isDomainExpansionActive, tutorialCompleted, timeLeft, hasCompletedGame 
  } = useSelector(state => state.shadowGarden);
  
  const { playBackground, playSFX } = useSound();
  const [isLoading, setIsLoading] = useState(true);
  const [showFailure, setShowFailure] = useState(false);
  const [activePowerAnimation, setActivePowerAnimation] = useState(null);
  
  const {
    board,
    selectedTile,
    isProcessing,
    comboCount,
    isFreeSwapActive,
    handleTileClick,
    activatePower,
    clearTileType
  } = useMatch3();

  const levelConfig = useMemo(() => getLevelConfig(currentLevel), [currentLevel]);

  const handleAlvinBlessing = useCallback(() => {
    if (!board.length) return;
    const typeCounts = {};
    board.forEach(row => row.forEach(tile => {
      if (tile) typeCounts[tile.type] = (typeCounts[tile.type] || 0) + 1;
    }));
    const leastType = Object.entries(typeCounts).sort((a, b) => a[1] - b[1])[0]?.[0];
    if (leastType) clearTileType(leastType);
  }, [board, clearTileType]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      playBackground(levelConfig.music, 0.4);
      const healthValues = [5000, 8000, 12000, 20000, 50000];
      setTimeout(() => { dispatch(setBossHealth(healthValues[currentLevel - 1] || 5000)); }, 50);
    }
  }, [currentLevel, levelConfig, playBackground, dispatch, isLoading]);

  useEffect(() => {
    if (currentBossHealth <= 0 && currentBossHealth !== null && !isLoading && currentLevel < 5 && maxBossHealth < 999999) {
      playSFX('success', '/sounds/success.mp3');
      setIsLoading(true);
      setTimeout(() => {
        dispatch(setCurrentLevel(currentLevel + 1));
        setIsLoading(false);
      }, 2000);
    }
    if (timeLeft <= 0 && currentLevel < 5 && !isProcessing) setShowFailure(true);
  }, [currentBossHealth, currentLevel, dispatch, playSFX, isLoading, timeLeft, isProcessing, maxBossHealth]);

  const handlePowerActivation = async (id) => {
    setActivePowerAnimation(id);
    playSFX('system_chime', '/sounds/shadow-garden/sfx/system_chime.mp3');
    gsap.fromTo(".power-overlay", { x: "-100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" });
    setTimeout(() => {
       gsap.to(".power-overlay", { x: "100%", opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => setActivePowerAnimation(null) });
       activatePower(id);
    }, 1500);
  };

  // Render appropriate level component based on currentLevel
  const renderLevelWrapper = () => {
    const levelComponents = [Level1, Level2, Level3, Level4, Level5];
    const LevelComponent = levelComponents[currentLevel - 1] || Level1;
    return LevelComponent;
  };

  if (isLoading) return <LoadingScreen message="ENTERING THE SHADOW GARDEN..." />;

  const LevelWrapper = renderLevelWrapper();

  return (
    <GameGrid className="w-screen h-screen bg-black relative overflow-hidden">
      <LevelWrapper>
      
      {/* Zone 1: Boss Bar + Love Meter (Level 5 only) */}
      <HeaderZone className="z-10 flex flex-col items-center justify-center p-4 gap-2">
        <BossBar />
        <LoveMeter />
      </HeaderZone>

      {/* Zone 2: Main Board Area */}
      <BoardZone className="z-10 relative flex items-center justify-center gap-8 px-4">
        <SidePanel className="hidden lg:flex flex-col gap-4 items-center">
           <FaithAvatar comboCount={comboCount} isProcessing={isProcessing} />
           <MysteryBox onAlvinBlessing={handleAlvinBlessing} />
        </SidePanel>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <StatCard label="SCORE" value={stats.totalScore} />
            <StatCard label="TIME" value={timeLeft} isTime={true} />
          </div>
          <BoardWrapper className="relative flex items-center justify-center max-h-[100%] aspect-square">
             <Board board={board} selectedTile={selectedTile} isProcessing={isProcessing} onTileClick={handleTileClick} />
             {isFreeSwapActive && <FreeSwapIndicator className="absolute inset-0 border-4 border-sg-purple animate-pulse pointer-events-none" />}
          </BoardWrapper>
        </div>

        <SidePanel className="hidden lg:flex flex-col gap-4 items-center">
           <PowerUpBar onActivate={handlePowerActivation} isFreeSwapActive={isFreeSwapActive} vertical={true} />
        </SidePanel>
      </BoardZone>

      {/* Zone 3: Footer Controls */}
      <FooterZone className="z-10 flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/40 backdrop-blur-md">
         <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase">REALM {currentLevel}: {levelConfig.name}</div>
            {currentLevel < 5 && hasCompletedGame && (
              <SkipButton onClick={() => dispatch(setCurrentLevel(5))} title="Gateway to Heart Domain">
                 <span className="animate-pulse">🌀</span> OPEN GATE
              </SkipButton>
            )}
         </div>
         <div className="flex items-center gap-4">
            {currentLevel === 5 && (
              <button onClick={() => dispatch(rekindleJourney())} className="btn-system text-[8px] bg-sg-gold/20 hover:bg-sg-gold/40">REKINDLE JOURNEY</button>
            )}
            <button onClick={() => navigate('/')} className="text-[10px] font-mono text-sg-pink hover:underline uppercase tracking-tighter">[ RETURN TO HUB ]</button>
         </div>
      </FooterZone>

      {/* Overlays */}
      {activePowerAnimation !== null && (
        <PowerOverlay className="power-overlay fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-black/40">
           <div className="bg-black/90 w-full py-12 border-y-4 border-sg-gold flex flex-col items-center">
              <h2 className="font-orbitron text-sg-gold text-2xl tracking-[0.5em] animate-pulse">POWER ACTIVATED</h2>
              <div className="font-bangers text-white text-5xl mt-4">
                 {activePowerAnimation === 0 && "SIX EYES: INFINITY"}
                 {activePowerAnimation === 1 && "SHADOW ARMY: ARISE"}
                 {activePowerAnimation === 2 && "RULER'S AUTHORITY"}
                 {activePowerAnimation === 3 && "INVERTED SPEAR"}
                 {activePowerAnimation === 4 && "TEN SHADOWS"}
                 {activePowerAnimation === 5 && "MAGIC EYES"}
                 {activePowerAnimation === 6 && "FULL COUNTER"}
              </div>
           </div>
        </PowerOverlay>
      )}

      {isDomainExpansionActive && <DomainExpansion onComplete={() => { dispatch(setDomainExpansion(false)); navigate('/music-room'); }} />}
      {!tutorialCompleted && <TutorialOverlay />}

      {showFailure && (
        <FailureOverlay className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center backdrop-blur-xl">
           <div className="text-center p-12 border-4 border-red-600 rounded-3xl bg-black shadow-[0_0_50px_rgba(220,38,38,0.5)]">
              <h2 className="font-bangers text-7xl text-red-600 mb-4 tracking-widest animate-bounce">QUEST FAILED</h2>
              <p className="font-orbitron text-white text-lg mb-8 uppercase opacity-60">The gap remains between us...</p>
              <button onClick={() => { setShowFailure(false); dispatch(setCurrentLevel(currentLevel)); }} className="bg-red-600 text-white px-12 py-4 rounded-full font-bold hover:bg-red-500 hover:scale-110 transition-all text-xl shadow-lg">RETRY REALM</button>
           </div>
        </FailureOverlay>
      )}

      </LevelWrapper>
    </GameGrid>
  );
};

// --- STYLED COMPONENTS ---
const GameGrid = styled.div` display: grid; grid-template-rows: auto 1fr auto; `;
const HeaderZone = styled.header``;
const BoardZone = styled.main``;
const FooterZone = styled.footer``;
const BoardWrapper = styled.div``;
const SidePanel = styled.div` min-width: 150px; `;
const StatCard = ({ label, value, isTime }) => (
  <div className="glass-card p-2 flex flex-col items-center w-full">
    <span className="text-[8px] font-mono text-white/40">{label}</span>
    <span className="text-xl font-orbitron text-sg-gold">
       {isTime ? `${Math.floor(value/60)}:${(value%60).toString().padStart(2, '0')}` : Math.floor(value).toLocaleString()}
    </span>
  </div>
);
const FreeSwapIndicator = styled.div` box-shadow: inset 0 0 100px rgba(123, 44, 191, 0.6); `;
const PowerOverlay = styled.div``;
const FailureOverlay = styled.div``;
const SkipButton = styled.button` background: rgba(123, 44, 191, 0.3); border: 1px solid #7b2cbf; color: white; padding: 4px 12px; border-radius: 4px; font-family: 'Orbitron', sans-serif; font-size: 8px; cursor: pointer; display: flex; items-center; gap: 6px; transition: all 0.3s ease; &:hover { background: #7b2cbf; box-shadow: 0 0 15px #7b2cbf; } `;

export default ShadowGarden;
