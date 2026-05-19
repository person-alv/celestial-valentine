import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMatch3 } from '../hooks/useMatch3';
import { useSound } from '../hooks/useSound';
import { getLevelConfig } from '../data/shadow-garden/levels';
import { getPowerById } from '../data/shadow-garden/powerups';

// Game components
import Board from '../components/shadow-garden/game/Board';
import BossBar from '../components/shadow-garden/ui/BossBar';
import FaithAvatar from '../components/shadow-garden/ui/FaithAvatar';
import PowerUpBar from '../components/shadow-garden/ui/PowerUpBar';
import MysteryBox from '../components/shadow-garden/ui/MysteryBox';
import LoveMeter from '../components/shadow-garden/ui/LoveMeter';
import ComboDisplay from '../components/shadow-garden/ui/ComboDisplay';
import DomainExpansion from '../components/shadow-garden/effects/DomainExpansion';
import PowerCinema from '../components/shadow-garden/effects/PowerCinema';
import TutorialOverlay from '../components/shadow-garden/tutorial/TutorialOverlay';
import LoadingScreen from '../components/shared/LoadingScreen';

// Level wrapper components (themed backgrounds)
import Level1 from '../components/shadow-garden/levels/Level1';
import Level2 from '../components/shadow-garden/levels/Level2';
import Level3 from '../components/shadow-garden/levels/Level3';
import Level4 from '../components/shadow-garden/levels/Level4';
import Level5 from '../components/shadow-garden/levels/Level5';

// Redux
import {
  setBossHealth,
  setCurrentLevel,
  rekindleJourney,
  setDomainExpansion,
} from '../store/slices/shadowGardenSlice';

const LEVEL_WRAPPERS = [Level1, Level2, Level3, Level4, Level5];

const ShadowGarden = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const {
    currentLevel,
    stats,
    currentBossHealth,
    maxBossHealth,
    isDomainExpansionActive,
    tutorialCompleted,
    timeLeft,
    hasCompletedGame,
    scoreMultiplier,
    scoreMultiplierExpiresAt,
    loveMeter,
  } = useSelector(s => s.shadowGarden);

  const { playBackground, playSFX, setBackgroundVolume } = useSound();
  const [isLoading,      setIsLoading]      = useState(true);
  const [showFailure,    setShowFailure]     = useState(false);
  const [activeCinemaId, setActiveCinemaId] = useState(null); // which power cinema is showing
  const deTriggeredRef = useRef(false);

  const {
    board,
    selectedTile,
    isProcessing,
    comboCount,
    isFreeSwapActive,
    isSelectingRow,
    isSelectingType,
    specialEffects,
    handleTileClick,
    touchSwap,
    activatePower,
    clearTileType,
  } = useMatch3();

  const levelConfig = useMemo(() => getLevelConfig(currentLevel), [currentLevel]);

  // ── Alvin Blessing helper ──
  const handleAlvinBlessing = useCallback(() => {
    if (!board.length) return;
    const counts = {};
    board.forEach(row => row.forEach(tile => {
      if (tile) counts[tile.type] = (counts[tile.type] || 0) + 1;
    }));
    const leastType = Object.entries(counts).sort((a, b) => a[1] - b[1])[0]?.[0];
    if (leastType !== undefined) clearTileType(Number(leastType));
  }, [board, clearTileType]);

  // ── Loading ──
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  // ── Music + boss health per level ──
  useEffect(() => {
    if (isLoading) return;
    playBackground(levelConfig.music, 0.4);
    const healthValues = [5000, 8000, 12000, 20000, 50000];
    setTimeout(() => dispatch(setBossHealth(healthValues[currentLevel - 1] || 5000)), 50);
  }, [currentLevel, levelConfig, playBackground, dispatch, isLoading]);

  // ── Level progression: boss defeated ──
  useEffect(() => {
    if (
      currentBossHealth <= 0 &&
      currentBossHealth !== null &&
      !isLoading &&
      currentLevel < 5 &&
      maxBossHealth < 999999
    ) {
      setIsLoading(true);
      setTimeout(() => {
        dispatch(setCurrentLevel(currentLevel + 1));
        setIsLoading(false);
      }, 2000);
    }
    // Failure: time ran out on timed levels
    if (timeLeft <= 0 && currentLevel < 5 && !isProcessing) {
      setShowFailure(true);
    }
  }, [currentBossHealth, currentLevel, dispatch, isLoading, timeLeft, isProcessing, maxBossHealth]);

  // ── Power activation: duck realm music, play SFX, restore on end, show cinema ──
  const handlePowerActivation = useCallback((id) => {
    if (activeCinemaId !== null) return;
    const power = getPowerById(id);
    if (power?.soundEffect) {
      setBackgroundVolume(0.12, 200);
      playSFX(`power_${id}`, power.soundEffect, 0.8, () => {
        setBackgroundVolume(0.4, 500);
      });
    }
    setActiveCinemaId(id);
  }, [activeCinemaId, playSFX, setBackgroundVolume]);

  // ── Cinema complete: route to targeting mode or fire directly ──
  const handleCinemaComplete = useCallback((id) => {
    setActiveCinemaId(null);
    // activatePower handles:
    //   0 → sets isSelectingRow
    //   2 → sets isFreeSwapActive
    //   3 → sets isSelectingType
    //   4 → dispatches multiplier (no board change)
    //   6 → fires full counter score
    //   1,5 → direct board effect
    activatePower(id);
  }, [activatePower]);

  // ── Multiplier timer display ──
  const [multiplierSecsLeft, setMultiplierSecsLeft] = useState(0);
  useEffect(() => {
    if (scoreMultiplierExpiresAt <= Date.now()) {
      setMultiplierSecsLeft(0);
      return;
    }
    const tick = () => {
      const left = Math.max(0, Math.ceil((scoreMultiplierExpiresAt - Date.now()) / 1000));
      setMultiplierSecsLeft(left);
    };
    tick();
    const iv = setInterval(tick, 500);
    return () => clearInterval(iv);
  }, [scoreMultiplierExpiresAt]);

  // ── Level 5 win: love meter full → trigger domain expansion ──
  useEffect(() => {
    if (loveMeter === 0) deTriggeredRef.current = false; // reset on rekindle
  }, [loveMeter]);

  useEffect(() => {
    if (currentLevel === 5 && loveMeter >= 100 && !deTriggeredRef.current && !isProcessing) {
      deTriggeredRef.current = true;
      dispatch(setDomainExpansion(true));
    }
  }, [loveMeter, currentLevel, isProcessing, dispatch]);

  // Called by DomainExpansion at Stage 5 — "ENTER THE HEART DOMAIN"; cross-fade from level 5 music
  const handleDomainAudioStart = useCallback(() => {
    playBackground('/sounds/shadow-garden/sfx/domain_expansion.mp3', 1.0, true, false);
  }, [playBackground]);

  // ── Domain Expansion complete ──
  const handleDomainComplete = useCallback(() => {
    dispatch(setDomainExpansion(false));
    navigate('/music-room');
  }, [dispatch, navigate]);

  // ── Targeting mode cursor hint ──
  const targetingHint = isSelectingRow
    ? '— TAP ANY TILE TO TARGET THAT ROW —'
    : isSelectingType
    ? '— TAP A TILE TO DESTROY ALL OF ITS TYPE —'
    : isFreeSwapActive
    ? '— RULER\'S AUTHORITY: SWAP ANY TWO TILES —'
    : null;

  if (isLoading) return <LoadingScreen message="ENTERING THE SHADOW GARDEN..." />;

  const LevelWrapper = LEVEL_WRAPPERS[currentLevel - 1] || Level1;

  return (
    <GameGrid className="w-screen h-screen bg-black relative overflow-hidden">
      <LevelWrapper>

        {/* ── TOP: Boss Bar + Love Meter (L5 only) ── */}
        <HeaderZone className={`z-10 flex flex-col items-center justify-center ${currentLevel === 5 ? 'py-1 px-4' : 'p-4'} gap-2`}>
          <BossBar />
          <LoveMeter />
        </HeaderZone>

        {/* ── CENTER: Board + Side Panels ── */}
        <BoardZone className="z-10 relative flex items-center justify-center gap-8 px-4">

          {/* LEFT panel */}
          <SidePanel className="hidden lg:flex flex-col gap-4 items-center">
            <FaithAvatar comboCount={comboCount} isProcessing={isProcessing} />
            <ComboDisplay comboCount={comboCount} />
            <MysteryBox onAlvinBlessing={handleAlvinBlessing} />
          </SidePanel>

          {/* Board column */}
          <div className="flex flex-col items-center gap-3">
            {/* Score + Timer */}
            <div className="flex items-center gap-4">
              <StatCard label="SCORE" value={stats.totalScore} />
              <StatCard label="TIME"  value={timeLeft}        isTime />
              {multiplierSecsLeft > 0 && (
                <MultiplierPill>×{scoreMultiplier} · {multiplierSecsLeft}s</MultiplierPill>
              )}
            </div>

            {/* Combo — mobile shows here in stats row; desktop shows in left panel */}
            {comboCount >= 2 && (
              <div className="lg:hidden">
                <ComboDisplay comboCount={comboCount} />
              </div>
            )}

            {/* Targeting hint bar */}
            {targetingHint && (
              <TargetingBanner
                className="font-mono text-center px-4 py-1 text-xs tracking-widest animate-pulse"
              >
                {targetingHint}
              </TargetingBanner>
            )}

            {/* The board */}
            <BoardWrapper className="relative flex items-center justify-center">
              <Board
                board={board}
                selectedTile={selectedTile}
                isProcessing={isProcessing}
                onTileClick={handleTileClick}
                onTouchSwap={touchSwap}
                isSelectingRow={isSelectingRow}
                isSelectingType={isSelectingType}
                specialEffects={specialEffects}
              />
              {isFreeSwapActive && (
                <FreeSwapRing className="absolute inset-0 border-4 border-sg-purple rounded-xl animate-pulse pointer-events-none" />
              )}
              {/* Power Cinema — board-scoped overlay, tiles remain visible beneath */}
              <PowerCinema
                activePowerId={activeCinemaId}
                onComplete={handleCinemaComplete}
              />
            </BoardWrapper>
          </div>

          {/* RIGHT panel */}
          <SidePanel className="hidden lg:flex flex-col gap-4 items-center">
            <PowerUpBar
              onActivate={handlePowerActivation}
              isFreeSwapActive={isFreeSwapActive}
              vertical
            />
          </SidePanel>
        </BoardZone>

        {/* ── FOOTER ── */}
        <FooterZone className="z-10 flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
              REALM {currentLevel}: {levelConfig.name}
            </div>
            {currentLevel < 5 && hasCompletedGame && (
              <SkipButton onClick={() => dispatch(setCurrentLevel(5))} title="Gateway to Heart Domain">
                <span className="animate-pulse">🌀</span> OPEN GATE
              </SkipButton>
            )}
          </div>
          <div className="flex items-center gap-4">
            {currentLevel === 5 && (
              <button
                onClick={() => dispatch(rekindleJourney())}
                className="btn-system text-[8px] bg-sg-gold/20 hover:bg-sg-gold/40"
              >
                REKINDLE JOURNEY
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="text-[10px] font-mono text-sg-pink hover:underline uppercase tracking-tighter"
            >
              [ RETURN TO HUB ]
            </button>
          </div>
        </FooterZone>

        {/* ── OVERLAYS ── */}

        {/* Domain Expansion — Level 5 victory cinematic */}
        {isDomainExpansionActive && (
          <DomainExpansion onComplete={handleDomainComplete} onAudioStart={handleDomainAudioStart} />
        )}

        {/* ── MOBILE POWER BAR (hidden on lg+) ── */}
        <MobilePowerBar className="lg:hidden absolute bottom-[52px] left-0 right-0 z-20">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex-1">
              <PowerUpBar
                onActivate={handlePowerActivation}
                isFreeSwapActive={isFreeSwapActive}
                compact
              />
            </div>
            <div className="flex-shrink-0">
              <MysteryBox onAlvinBlessing={handleAlvinBlessing} compact />
            </div>
          </div>
        </MobilePowerBar>

        {/* Tutorial */}
        {!tutorialCompleted && <TutorialOverlay />}

        {/* Failure screen */}
        {showFailure && (
          <FailureOverlay className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center backdrop-blur-xl">
            <div className="text-center p-12 border-4 border-red-600 rounded-3xl bg-black shadow-[0_0_50px_rgba(220,38,38,0.5)]">
              <h2 className="font-bangers text-7xl text-red-600 mb-4 tracking-widest animate-bounce">
                QUEST FAILED
              </h2>
              <p className="font-orbitron text-white text-lg mb-8 uppercase opacity-60">
                The gap remains between us...
              </p>
              <button
                onClick={() => {
                  setShowFailure(false);
                  dispatch(setCurrentLevel(currentLevel));
                  const hv = [5000, 8000, 12000, 20000, 50000];
                  dispatch(setBossHealth(hv[currentLevel - 1] || 5000));
                }}
                className="bg-red-600 text-white px-12 py-4 rounded-full font-bold hover:bg-red-500 hover:scale-110 transition-all text-xl shadow-lg"
              >
                RETRY REALM
              </button>
            </div>
          </FailureOverlay>
        )}

      </LevelWrapper>
    </GameGrid>
  );
};

/* ── Styled components ── */
const GameGrid    = styled.div`display: grid; grid-template-rows: auto 1fr auto;`;
const HeaderZone  = styled.header``;
const BoardZone   = styled.main``;
const FooterZone  = styled.footer``;
const BoardWrapper = styled.div`position: relative;`;
const SidePanel   = styled.div`min-width: 150px;`;
const FreeSwapRing = styled.div`box-shadow: inset 0 0 100px rgba(123,44,191,0.6);`;
const FailureOverlay = styled.div``;

const TargetingBanner = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.15em;
  width: 100%;
`;

const MultiplierPill = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  color: #00BFFF;
  background: rgba(0, 191, 255, 0.12);
  border: 1px solid rgba(0, 191, 255, 0.5);
  border-radius: 20px;
  padding: 4px 10px;
  letter-spacing: 0.15em;
  text-shadow: 0 0 10px #00BFFF;
  animation: pulse 1s ease-in-out infinite;
  @keyframes pulse { 0%,100%{opacity:0.8} 50%{opacity:1} }
`;

const StatCard = ({ label, value, isTime }) => (
  <div className="glass-card p-2 flex flex-col items-center w-full">
    <span className="text-[8px] font-mono text-white/40">{label}</span>
    <span className="text-xl font-orbitron text-sg-gold">
      {isTime
        ? `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`
        : Math.floor(value).toLocaleString()}
    </span>
  </div>
);

const MobilePowerBar = styled.div`
  background: rgba(5, 5, 15, 0.92);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(123, 44, 191, 0.35);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
`;

const SkipButton = styled.button`
  background: rgba(123,44,191,0.3);
  border: 1px solid #7b2cbf;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  &:hover { background: #7b2cbf; box-shadow: 0 0 15px #7b2cbf; }
`;

export default ShadowGarden;
