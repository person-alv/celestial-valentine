import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
  
  // Unified Camera View State
  const [cameraView, setCameraView] = useState('room'); // 'room', 'laptop', 'gojo', 'solo', 'given'
  const [windowPattern, setWindowPattern] = useState('random');
  const [systemActive, setSystemActive] = useState(false);
  
  const bedroomRef = useRef(null);
  const clickTimer = useRef(null);
  const posterRefs = useRef({});
  const laptopRef = useRef(null);
  const [failedPosters, setFailedPosters] = useState(new Set());

  useEffect(() => {
    soundManager.playBackground('/sounds/hub/hub_lofi.mp3', 0.2);
    return () => soundManager.stopBackground();
  }, []);

  // --- SMART CLICK HANDLER ---
  const handleInteraction = (target, isDoubleClick = false) => {
    if (isDoubleClick) {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      executeZoom(target);
    } else {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => {
        executeWindowChange();
      }, 250); // 250ms window for double click
    }
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
    <Container className="bg-black overflow-hidden relative w-screen h-screen">
      <BedroomWrapper ref={bedroomRef} className="w-full h-full relative origin-center">
        <BackgroundLayer className="absolute inset-0">
          
          {/* Interactive Window */}
          <WindowArea className="absolute top-[8%] right-[12%] w-[22%] h-[38%] bg-[#010409] border-[8px] border-slate-900 rounded shadow-[0_0_50px_rgba(0,0,0,1)]">
            <Constellations type={windowPattern} />
          </WindowArea>

          {/* Posters */}
          <PosterArea className="absolute top-[15%] left-[8%] flex gap-12">
            {POSTERS.map(p => {
              const showImage = p.src && !failedPosters.has(p.id);
              return (
                <Poster
                  key={p.id}
                  ref={(el) => { posterRefs.current[p.id] = el; }}
                  onClick={() => handleInteraction(p.id, false)}
                  onDoubleClick={() => handleInteraction(p.id, true)}
                  $isFocused={cameraView === p.id}
                  className="w-32 h-48 cursor-pointer preserve-3d transition-all duration-500"
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
                      <span className="font-orbitron text-[6px] text-white tracking-[0.2em]">DOUBLE TAP TO RETURN</span>
                    </PosterInfoOverlay>
                  )}
                </Poster>
              );
            })}
          </PosterArea>

          {/* Desk Area */}
          <DeskGroup className="absolute bottom-[10%] left-[30%] -translate-x-1/2">
            <DeskSurface className="w-[500px] h-4 bg-gradient-to-b from-[#1a120b] to-black rounded-full" />
            
            {/* The Gateway Laptop */}
            <LaptopFrame
              ref={laptopRef}
              onClick={() => !systemActive && handleInteraction('laptop', true)}
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-40 bg-slate-800 rounded-t-xl cursor-pointer shadow-2xl"
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
    </Container>
  );
};

// --- STYLED COMPONENTS ---

const Container = styled.div``;
const BedroomWrapper = styled.div` will-change: transform; transition: filter 0.5s ease; `;
const BackgroundLayer = styled.div` background: radial-gradient(circle at 30% 50%, #1e293b 0%, #020617 100%); `;
const WindowArea = styled.div``;
const PosterArea = styled.div``;
const DeskGroup = styled.div``;
const DeskSurface = styled.div``;

const LaptopFrame = styled.div`
  perspective: 1000px;
  &:hover { background: #334155; }
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

const SystemCard = styled.div`
  position: relative;
  width: 120px;
  height: 160px;
  cursor: pointer;
  
  .card-border {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .card-content {
    position: absolute;
    inset: 4px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  &:hover {
    .card-border { border-color: #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
    .card-content { background: rgba(255, 215, 0, 0.05); }
  }
`;

const DisconnectBtn = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.2);
  font-family: 'Orbitron', sans-serif;
  font-size: 5px;
  padding: 4px 12px;
  border-radius: 99px;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  &:hover { color: #e43f5a; border-color: #e43f5a; background: rgba(228, 63, 90, 0.1); }
`;

const Poster = styled.div`
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

const GameCard = styled.div`
  flex: 1;
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
