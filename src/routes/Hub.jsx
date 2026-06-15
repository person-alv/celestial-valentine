import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import gsap from 'gsap';
import { soundManager } from '../hooks/useSound';
import { setActivePoster } from '../store/slices/hubSlice';

// Drop poster images into public/images/posters/ — see README there for sizing.
// Set src: null to keep emoji fallback for that poster.
const POSTERS = [
  { id: 'gojo',  emoji: '👁️', color: '#00BFFF', src: '/images/posters/poster_gojo.jpg'  },
  { id: 'given', emoji: '🎸', color: '#FFB6C1', src: '/images/posters/poster_given.jpg' },
  { id: 'solo',  emoji: '🗡️', color: '#FFD700', src: '/images/posters/poster_solo.jpg'  },
];

const Hub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Show the gold "NEW" badge on the Shadow Garden card until Faith has engaged with it.
  // hasCompletedGame keeps it hidden even after a "Rekindle Journey" reset (which zeroes totalScore).
  const { stats, completedLevels, hasCompletedGame } = useSelector(s => s.shadowGarden);
  const shadowGardenIsNew = !(stats.totalScore > 0 || completedLevels.length > 0 || hasCompletedGame);

  // Unified Camera View State
  const [cameraView, setCameraView] = useState('room'); // 'room', 'laptop', 'gojo', 'solo', 'given'
  const [windowPattern, setWindowPattern] = useState('random');
  const [systemActive, setSystemActive] = useState(false);
  
  const bedroomRef = useRef(null);
  const clickTimer = useRef(null);
  const posterRefs = useRef({});
  // Per-target timestamp for manual double-tap detection on touch devices
  const lastTapTime = useRef({});
  const laptopRef = useRef(null);
  const [failedPosters, setFailedPosters] = useState(new Set());
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    soundManager.playBackground('/sounds/hub/hub_lofi.mp3', 0.2);
    return () => soundManager.stopBackground();
  }, []);

  // Track portrait/phone width so the laptop shows a phone-friendly, vertically
  // stacked system UI instead of the 964×576 landscape canvas.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // --- SMART CLICK / DOUBLE-TAP HANDLER ---
  // Works for both mouse (onDoubleClick via isDoubleClick=true) and touch
  // (two taps within 300ms on the same target).
  const handleInteraction = (target, isDoubleClick = false) => {
    if (isDoubleClick) {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      lastTapTime.current[target] = 0;
      executeZoom(target);
      return;
    }

    // Manual double-tap detection for touch devices
    const now = Date.now();
    const prev = lastTapTime.current[target] || 0;
    if (now - prev < 300) {
      // Second tap within 300ms → zoom
      if (clickTimer.current) clearTimeout(clickTimer.current);
      lastTapTime.current[target] = 0;
      executeZoom(target);
      return;
    }
    lastTapTime.current[target] = now;

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      executeWindowChange();
    }, 250);
  };

  const executeWindowChange = () => {
    const patterns = ['random', 'heart', 'FA', 'cluster'];
    const next = patterns[Math.floor(Math.random() * patterns.length)];
    setWindowPattern(next);
    soundManager.play('tap', '/sounds/tap.mp3');
  };

  const executeZoom = useCallback((target) => {
    if (cameraView === target) {
      // Zoom Out if already zoomed in
      gsap.to(bedroomRef.current, { scale: 1, x: 0, y: 0, duration: 1.2, ease: "power2.inOut" });
      setCameraView('room');
      setSystemActive(false);
      dispatch(setActivePoster(null));
      return;
    }

    setCameraView(target);
    
    let vars = { duration: 1.5, ease: "power3.inOut" };
    
    if (target === 'laptop') {
      const scale = 4;
      const laptopEl = laptopRef.current;
      let tx = 0;
      let ty = 0;
      if (laptopEl) {
        const rect = laptopEl.getBoundingClientRect();
        const laptopCx = rect.left + rect.width / 2;
        const laptopCy = rect.top + rect.height / 2;
        tx = ((window.innerWidth / 2 - laptopCx) / window.innerWidth) * scale * 100;
        ty = ((window.innerHeight / 2 - laptopCy) / window.innerHeight) * scale * 100;
      }
      vars = { ...vars, scale, x: `${tx}%`, y: `${ty}%`, onUpdate: () => {
        if (gsap.getProperty(bedroomRef.current, "scale") > 2.5) setSystemActive(true);
      }};
    } else {
      dispatch(setActivePoster(target));
      const scale = 3;
      const posterEl = posterRefs.current[target];
      if (posterEl) {
        const rect = posterEl.getBoundingClientRect();
        const posterCx = rect.left + rect.width / 2;
        const posterCy = rect.top + rect.height / 2;
        const tx = ((window.innerWidth / 2 - posterCx) / window.innerWidth) * scale * 100;
        const ty = ((window.innerHeight / 2 - posterCy) / window.innerHeight) * scale * 100;
        vars = { ...vars, scale, x: `${tx}%`, y: `${ty}%` };
      }
    }

    gsap.to(bedroomRef.current, vars);
  }, [cameraView, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && cameraView !== 'room') {
        executeZoom(cameraView);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraView, executeZoom]);

  const launchGame = (gameRoute) => {
    // Ensure we have a valid route
    if (!gameRoute || typeof gameRoute !== 'string') {
      console.error('Invalid game route:', gameRoute);
      return;
    }

    soundManager.play('system_chime', '/sounds/shadow-garden/sfx/system_chime.mp3');
    gsap.to(".system-root", {
      opacity: 0,
      scale: 1.2,
      duration: 0.8,
      onComplete: () => {
        console.log('Navigating to:', gameRoute);
        navigate(gameRoute);
      }
    });
  };

  return (
    <Container className="bg-black overflow-hidden relative">
      {/* Close button for poster zoom — shown on mobile/touch where ESC isn't available */}
      {cameraView !== 'room' && cameraView !== 'laptop' && (
        <PosterCloseBtn
          onClick={() => executeZoom(cameraView)}
          aria-label="Return to room"
        >
          ✕
        </PosterCloseBtn>
      )}
      <BedroomWrapper ref={bedroomRef} className="w-full h-full relative origin-center">
        <BackgroundLayer className="absolute inset-0">
          
          {/* Interactive Window */}
          <WindowArea className="bg-[#010409] border-[8px] border-slate-900 rounded shadow-[0_0_50px_rgba(0,0,0,1)]">
            <Constellations type={windowPattern} />
          </WindowArea>

          {/* Posters */}
          <PosterArea>
            {POSTERS.map(p => {
              const showImage = p.src && !failedPosters.has(p.id);
              return (
                <Poster
                  key={p.id}
                  ref={(el) => { posterRefs.current[p.id] = el; }}
                  onClick={() => handleInteraction(p.id, false)}
                  $isFocused={cameraView === p.id}
                  className="cursor-pointer preserve-3d transition-all duration-500"
                >
                  <div className="poster-inner w-full h-full p-1 bg-white/5 border border-white/10 rounded-sm flex flex-col items-center justify-between shadow-2xl">
                    <div className="w-full h-full bg-slate-900/50 flex flex-col items-center justify-center relative overflow-hidden">
                      {showImage
                        ? <img
                            src={p.src}
                            alt={p.id}
                            onError={() => setFailedPosters(prev => new Set([...prev, p.id]))}
                            draggable={false}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        : <>
                            <PosterIcon color={p.color}>{p.emoji}</PosterIcon>
                            <PosterLabel>{p.id.toUpperCase()}</PosterLabel>
                          </>
                      }
                    </div>
                  </div>
                  {cameraView === p.id && (
                    <PosterInfoOverlay className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <span className="font-orbitron text-[10px] text-white tracking-[0.2em] drop-shadow-lg">TAP AGAIN TO RETURN</span>
                    </PosterInfoOverlay>
                  )}
                </Poster>
              );
            })}
          </PosterArea>

          {/* Desk Area */}
          <DeskGroup>
            <DeskSurface className="h-4 bg-gradient-to-b from-[#1a120b] to-black rounded-full" />

            {/* The Gateway Laptop */}
            <LaptopFrame
              ref={laptopRef}
              onClick={() => !systemActive && handleInteraction('laptop', true)}
              className="bg-slate-800 rounded-t-xl cursor-pointer"
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[94%] h-[90%] bg-[#010409] rounded-sm overflow-hidden flex items-center justify-center border border-white/5">
                
                {/* JINWOO SYSTEM UI (Only visible when zoomed) */}
                <SystemContainer $active={systemActive} className="system-root w-full h-full">
                   <SystemGlitch className="absolute inset-0 pointer-events-none opacity-10" />

                   {/* DesktopLayer renders at 964×576 — the exact display size after GSAP scale 4.
                       CSS scale(0.25) pre-shrinks it to fit the 241×144 laptop screen at room scale.
                       Net transform at zoom time: 0.25 × 4 = 1.0 → pixel-perfect rendering. */}
                   <DesktopLayer>
                      <LaptopTitleBar>
                         <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <TrafficLight $color="#FF5F57" />
                            <TrafficLight $color="#FEBC2E" />
                            <TrafficLight $color="#28C840" />
                         </div>
                         <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3em' }}>
                            HUNTER_SYSTEM v2.0
                         </span>
                         <ScreenCloseBtn onClick={(e) => { e.stopPropagation(); executeZoom('laptop'); }}>
                            [ESC]
                         </ScreenCloseBtn>
                      </LaptopTitleBar>

                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

                      <DesktopContent>
                         <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '15px', color: '#c9a227', letterSpacing: '0.25em', marginBottom: '10px', opacity: 0.9 }}>
                            DAILY QUEST: SELECT DESTINY
                         </div>
                         <div style={{ height: '1px', width: '200px', background: 'linear-gradient(to right, transparent, #c9a227, transparent)', marginBottom: '28px', flexShrink: 0 }} />

                         <div style={{ display: 'flex', gap: '28px', width: '100%', flex: 1, minHeight: 0 }}>
                            <GameCard onClick={(e) => { e.stopPropagation(); launchGame('/valentine'); }}>
                               <span style={{ fontSize: '64px', lineHeight: 1 }}>✨</span>
                               <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '18px', color: 'white', marginTop: '16px', letterSpacing: '0.1em' }}>STAR_MAP</span>
                               <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>Valentine</span>
                            </GameCard>

                            <GameCard $purple onClick={(e) => { e.stopPropagation(); launchGame('/shadow-garden-welcome'); }}>
                               {shadowGardenIsNew && <NewBadge><NewBadgeText>NEW</NewBadgeText><NewBadgeSheen /></NewBadge>}
                               <span style={{ fontSize: '64px', lineHeight: 1 }}>🌑</span>
                               <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '18px', color: '#9d4edd', marginTop: '16px', letterSpacing: '0.1em' }}>SHADOW_GARDEN</span>
                               <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>Level-Up Quest</span>
                            </GameCard>
                         </div>

                         <div style={{ marginTop: '18px', fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', flexShrink: 0 }}>
                            [ FAITH_LVL: S-RANK ]
                         </div>
                      </DesktopContent>
                   </DesktopLayer>
                </SystemContainer>

                {!systemActive && (
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-sg-purple rounded-full animate-pulse shadow-[0_0_20px_rgba(123,44,191,0.8)]" />
                    <span className="font-orbitron text-[4px] text-sg-purple/40 mt-2 tracking-widest uppercase">Initializing...</span>
                  </div>
                )}
              </div>
            </LaptopFrame>
          </DeskGroup>

        </BackgroundLayer>
      </BedroomWrapper>

      {/* Mobile system UI — rendered OUTSIDE the GSAP-scaled bedroom so it can fill the
          viewport. Fades in once the laptop zoom crosses the activation threshold, with
          the two destiny cards reflowed into a vertical stack. */}
      {isCompact && systemActive && (
        <MobileSystemOverlay className="system-root">
          <MobileSystemTitleBar>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <TrafficLight $color="#FF5F57" />
              <TrafficLight $color="#FEBC2E" />
              <TrafficLight $color="#28C840" />
            </div>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.25em' }}>
              HUNTER_SYSTEM v2.0
            </span>
            <ScreenCloseBtn onClick={() => executeZoom('laptop')}>[ESC]</ScreenCloseBtn>
          </MobileSystemTitleBar>

          <MobileSystemBody>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '13px', color: '#c9a227', letterSpacing: '0.2em', marginBottom: '6px', opacity: 0.9, textAlign: 'center' }}>
              DAILY QUEST: SELECT DESTINY
            </div>
            <div style={{ height: '1px', width: '160px', background: 'linear-gradient(to right, transparent, #c9a227, transparent)', marginBottom: '18px' }} />

            <MobileCardStack>
              <GameCard onClick={() => launchGame('/valentine')}>
                <span style={{ fontSize: '48px', lineHeight: 1 }}>✨</span>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px', color: 'white', marginTop: '10px', letterSpacing: '0.1em' }}>STAR_MAP</span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Valentine</span>
              </GameCard>

              <GameCard $purple onClick={() => launchGame('/shadow-garden-welcome')}>
                {shadowGardenIsNew && <NewBadge $compact><NewBadgeText $compact>NEW</NewBadgeText><NewBadgeSheen /></NewBadge>}
                <span style={{ fontSize: '48px', lineHeight: 1 }}>🌑</span>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px', color: '#9d4edd', marginTop: '10px', letterSpacing: '0.1em' }}>SHADOW_GARDEN</span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Level-Up Quest</span>
              </GameCard>
            </MobileCardStack>

            <div style={{ marginTop: '16px', fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>
              [ FAITH_LVL: S-RANK ]
            </div>
          </MobileSystemBody>
        </MobileSystemOverlay>
      )}
    </Container>
  );
};

// --- STYLED COMPONENTS ---

const Container = styled.div`
  width: 100vw;
  height: 100vh;   /* fallback */
  height: 100dvh;  /* fill the visible screen on mobile (no URL-bar gap) */
`;
const BedroomWrapper = styled.div` will-change: transform; transition: filter 0.5s ease; `;
const BackgroundLayer = styled.div` background: radial-gradient(circle at 30% 50%, #1e293b 0%, #020617 100%); `;

/* Desktop values preserved exactly; portrait re-composes the diorama with fluid
   vmin/clamp sizes + aspect-ratio so each element keeps its shape (no warping)
   and the whole bedroom fills a portrait phone. */
const WindowArea = styled.div`
  position: absolute;
  top: 8%;
  right: 12%;
  width: 22%;
  height: 38%;
  @media (max-width: 768px) {
    top: 6%;
    right: 5%;
    width: min(32vw, 150px);
    height: auto;
    aspect-ratio: 3 / 4;
  }
`;
const PosterArea = styled.div`
  position: absolute;
  top: 15%;
  left: 8%;
  display: flex;
  gap: 48px;
  @media (max-width: 768px) {
    top: 13%;
    left: 5%;
    gap: 2vw;
  }
`;
const DeskGroup = styled.div`
  position: absolute;
  bottom: 10%;
  left: 30%;
  transform: translateX(-50%);
  @media (max-width: 768px) {
    bottom: 15%;
    left: 50%;
  }
`;
const DeskSurface = styled.div`
  width: 500px;
  @media (max-width: 768px) {
    width: min(86vw, 460px);
  }
`;

const laptopGlow = keyframes`
  0%, 100% { box-shadow: 0 0 18px 2px rgba(123, 44, 191, 0.45), 0 8px 24px rgba(0,0,0,0.6); }
  50%      { box-shadow: 0 0 36px 8px rgba(123, 44, 191, 0.85), 0 8px 24px rgba(0,0,0,0.6); }
`;

const LaptopFrame = styled.div`
  position: absolute;
  top: -96px;            /* -top-24: sits above the desk surface */
  left: 50%;
  transform: translateX(-50%);
  width: 256px;
  height: 160px;
  perspective: 1000px;
  animation: ${laptopGlow} 2.4s ease-in-out infinite;  /* glow = "tap me" affordance */
  &:hover { background: #334155; }
  @media (max-width: 768px) {
    top: auto;
    bottom: 0;           /* rest the laptop on the desk in portrait */
    width: min(54vw, 240px);
    height: auto;
    aspect-ratio: 8 / 5;
  }
`;

const SystemContainer = styled.div`
  position: relative;
  opacity: ${props => props.$active ? 1 : 0};
  pointer-events: ${props => props.$active ? 'auto' : 'none'};
  transition: opacity 0.5s ease;
  background: radial-gradient(circle at center, #0f172a 0%, #010409 100%);
`;

const glitchAnim = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const SystemGlitch = styled.div`
  background: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
  animation: ${glitchAnim} 0.2s infinite;
`;

const Poster = styled.div`
  width: 128px;   /* w-32 */
  height: 192px;  /* h-48 */
  @media (max-width: 768px) {
    width: min(17vw, 84px);
    height: auto;
    aspect-ratio: 2 / 3;
  }
  ${props => props.$isFocused && css`
    z-index: 100;
    filter: drop-shadow(0 0 30px rgba(123, 44, 191, 0.5));
  `}
`;

const PosterIcon = styled.div`
  font-size: 40px;
  filter: drop-shadow(0 0 10px ${props => props.color});
  opacity: 0.6;
`;

const PosterLabel = styled.span`
  margin-top: 1rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 8px;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.2);
`;

const DesktopLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 964px;
  height: 576px;
  transform: scale(0.25);
  transform-origin: top left;
  display: flex;
  flex-direction: column;
`;

const LaptopTitleBar = styled.div`
  height: 52px;
  flex-shrink: 0;
  background: rgba(5, 10, 20, 0.97);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const TrafficLight = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => props.$color};
  opacity: 0.85;
  flex-shrink: 0;
`;

const ScreenCloseBtn = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 2px;
  line-height: 1;
  transition: all 0.2s ease;
  &:hover { color: #e43f5a; border-color: #e43f5a; background: rgba(228, 63, 90, 0.08); }
`;

const DesktopContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 32px 24px;
  min-height: 0;
`;

const badgeSheen = keyframes`
  0%        { transform: translateX(-160%) skewX(-18deg); opacity: 0; }
  12%       { opacity: 0.85; }
  45%, 100% { transform: translateX(240%) skewX(-18deg); opacity: 0; }
`;

const badgeGlow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.30); }
  50%      { box-shadow: 0 0 11px rgba(255, 215, 0, 0.55); }
`;

// Subtle gold "NEW" tag for the Shadow Garden card — sweeping sheen + soft glow.
// Solid-fill text (NOT background-clip) stays crisp when the desktop laptop canvas is
// GSAP-scaled up 4×; a background-clipped gradient would rasterize at the 0.25 base scale
// and blur on upscale. The sheen overlay is a soft gradient, so upscaling never hurts it.
// pointer-events:none so it never intercepts the card's launch click.
const NewBadge = styled.div`
  position: absolute;
  top: ${props => props.$compact ? '6px' : '8px'};
  right: ${props => props.$compact ? '6px' : '8px'};
  padding: ${props => props.$compact ? '2px 6px' : '3px 9px'};
  border-radius: 999px;
  border: 1px solid rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.07);
  overflow: hidden;
  pointer-events: none;
  animation: ${badgeGlow} 2.6s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

const NewBadgeText = styled.span`
  position: relative;
  z-index: 1;
  font-family: 'Orbitron', sans-serif;
  font-size: ${props => props.$compact ? '8px' : '11px'};
  letter-spacing: 0.18em;
  line-height: 1;
  color: #FFD700;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.45);
`;

const NewBadgeSheen = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 45%;
  z-index: 2;
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.85) 50%, transparent 100%);
  transform: translateX(-160%) skewX(-18deg);
  animation: ${badgeSheen} 3.4s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) { display: none; }
`;

const GameCard = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${props => props.$purple ? 'rgba(123, 44, 191, 0.35)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover {
    background: ${props => props.$purple ? 'rgba(123, 44, 191, 0.1)' : 'rgba(255, 215, 0, 0.06)'};
    border-color: ${props => props.$purple ? '#9d4edd' : '#ffd700'};
    box-shadow: 0 0 40px ${props => props.$purple ? 'rgba(123, 44, 191, 0.25)' : 'rgba(255, 215, 0, 0.2)'};
  }
`;

// --- MOBILE LAPTOP SYSTEM UI (portrait, vertically stacked) ---

const fadeInOverlay = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const MobileSystemOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at center, #0f172a 0%, #010409 100%);
  animation: ${fadeInOverlay} 0.45s ease forwards;
`;

const MobileSystemTitleBar = styled.div`
  flex-shrink: 0;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;
  background: rgba(5, 10, 20, 0.97);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

const MobileSystemBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 22px calc(24px + env(safe-area-inset-bottom));
`;

const MobileCardStack = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PosterCloseBtn = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: rgba(255,255,255,0.15); }
  &:active { transform: scale(0.9); }
`;

const hintShowAndHide = keyframes`
  0%   { opacity: 0; }
  15%  { opacity: 1; }
  70%  { opacity: 1; }
  100% { opacity: 0; }
`;

const PosterInfoOverlay = styled.div`
  animation: ${hintShowAndHide} 1.8s ease-in-out forwards;
  pointer-events: none;
`;

// --- CONSTELLATION COMPONENT ---

const Constellations = ({ type }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = [];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      let x, y, size = Math.random() * 2 + 1;
      
      if (type === 'heart') {
        const t = Math.random() * 2 * Math.PI;
        x = 16 * Math.pow(Math.sin(t), 3);
        y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        x = (x * 2) + 50;
        y = (y * 2) + 50;
      } else if (type === 'FA') {
        // Simple F & A grid
        const isF = Math.random() > 0.5;
        if (isF) {
          x = 30 + (Math.random() * 10);
          y = 30 + (Math.random() * 40);
        } else {
          x = 60 + (Math.random() * 10);
          y = 30 + (Math.random() * 40);
        }
      } else {
        x = Math.random() * 100;
        y = Math.random() * 100;
      }

      newStars.push({ x: `${x}%`, y: `${y}%`, size, delay: Math.random() * 5 });
    }
    setStars(newStars);
  }, [type]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {stars.map((s, i) => (
        <Star key={i} style={{ left: s.x, top: s.y, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  );
};

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
`;

const Star = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: ${pulse} 3s infinite ease-in-out;
`;

export default Hub;
