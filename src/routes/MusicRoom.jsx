import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Howl } from 'howler';
import { useSound } from '../hooks/useSound';
import { loveNotes } from '../data/shadow-garden/loveNotes';
import { rekindleJourney } from '../store/slices/shadowGardenSlice';

/**
 * Section header that doubles as a collapsible toggle on mobile.
 * Panels are multi-open: each header toggles its own panel independently.
 * On md+ it reverts to a static centered title (non-interactive, no chevron),
 * so the desktop three-panel layout is unchanged.
 */
const AccordionHeader = ({ id, title, openPanels, togglePanel, className = '' }) => (
  <button
    type="button"
    onClick={() => togglePanel(id)}
    className={`w-full md:w-auto flex items-center justify-between md:justify-center gap-2 md:pointer-events-none md:cursor-default font-orbitron text-sg-gold text-xs tracking-widest ${className}`}
  >
    <span>{title}</span>
    <span className={`md:hidden text-sg-gold/70 text-base leading-none transition-transform duration-300 ${openPanels.includes(id) ? 'rotate-90' : ''}`}>▸</span>
  </button>
);

const MusicRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { playBackground, playSFX, setBackgroundVolume } = useSound();
  const voiceRef = useRef(null);
  const [activeVinyl, setActiveVinyl] = useState(null);
  const [showPhoto, setShowPhoto] = useState(null);
  const [showNote, setShowNote] = useState(null);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);
  const [activeDoll, setActiveDoll] = useState(null);
  // Mobile collapsible panels — multi-open; Collection leads. (Inert on md+.)
  const [openPanels, setOpenPanels] = useState(['collection']);
  const togglePanel = (id) =>
    setOpenPanels(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]));

  const voiceNotes = [
    { id: 1, title: "Our First Hello", date: "Feb 2024" },
    { id: 2, title: "Midnight Thoughts", date: "April 2024" },
    { id: 3, title: "Summer Dreams", date: "July 2024" },
    { id: 4, title: "Autumn Whispers", date: "Oct 2024" },
    { id: 5, title: "A Special Message", date: "Valentine 2026" }
  ];

  // aspectRatio derived from measured pixel dimensions of each file in public/images/photos/
  const photos = [
    { id: 1, caption: "The day we met... ✨",            aspectRatio: "9/16" },  // 900×1600
    { id: 9, caption: "Always by your side. 🌙",        aspectRatio: "9/16" },  // update ratio once file is measured
    { id: 2, caption: "Coffee dates and rainy days. ☕", aspectRatio: "4/3",  colSpan: 2 },  // 1393×1080 landscape — own row
    { id: 3, caption: "Under the summer sun. ☀️",        aspectRatio: "9/16" },  // 720×1280
    { id: 4, caption: "Making magic together. 🪄",        aspectRatio: "9/16" },  // 720×1280
    { id: 5, caption: "Making magic together. 🪄",        aspectRatio: "4/7"  },  // 862×1509
    { id: 6, caption: "Making magic together. 🪄",        aspectRatio: "3/4"  },  // 899×1190
    { id: 7, caption: "Making magic together. 🪄",        aspectRatio: "8/9"  },  // 780×880
    { id: 8, caption: "Forever and always. ❤️",          aspectRatio: "1/1"  },  // 899×907
  ];

  // Drop images into public/images/photos/ and public/images/dolls/ — see READMEs there.
  const dolls = [
    { id: 1, emoji: '🧸', src: '/images/dolls/doll_1.png', name: 'Hesitation',   label: 'First Of the Fallen Five.'             },
    { id: 2, emoji: '🦊', src: '/images/dolls/doll_2.png', name: 'Silence',   label: 'No Match For Hunter Faith.'       },
    { id: 3, emoji: '🐰', src: '/images/dolls/doll_3.png', name: 'Loneliness',label: 'Chose the Path to Destruction.'  },
    { id: 4, emoji: '🐼', src: '/images/dolls/doll_4.png', name: 'Distance', label: 'Love will Always Prevail.'        },
    { id: 5, emoji: '🐱', src: '/images/dolls/doll_5.png', name: 'Final Trial',   label: 'Worthy Opponent but S-Rank Hunter Awakened.'         },
    { id: 6, emoji: '👑', src: '/images/dolls/doll_6.png', name: 'Koro-Sensei',  label: 'Best Teacher Ever !!'          },
    { id: 7, emoji: '⚔️', src: '/images/dolls/doll_7.png', name: 'Gibson ES-330 belonging to Mafuyu', label: "Legendary Guitar Used By Mafuyu From Given."        },
    { id: 8, emoji: '🔮', src: '/images/dolls/doll_8.png', name: 'Shadow Monarch Deadly Dagger', label: 'One of Many Blades belonging to the Shadow Monarch.'        },
    { id: 9, emoji: '🌙', src: '/images/dolls/doll_9.png', name: 'Sukuna Finger',  label: 'Artifact Belonging to the King of Curses that started it all.'         },
  ];

  const [failedPhotos,   setFailedPhotos]   = useState(new Set());
  const [failedDolls,    setFailedDolls]    = useState(new Set());
  // Isolated from failedPhotos — a modal load error must never poison the gallery thumbnails
  const [modalImgFailed, setModalImgFailed] = useState(false);

  const handlePhotoImgError = useCallback((id) => {
    setFailedPhotos(prev => new Set([...prev, id]));
  }, []);

  const handleDollImgError = useCallback((id) => {
    setFailedDolls(prev => new Set([...prev, id]));
  }, []);

  useEffect(() => {
    playBackground('/sounds/music_room_ambient.mp3', 0.3);
  }, [playBackground]);

  // Stop any orphaned voice note Howl on unmount
  useEffect(() => {
    return () => {
      if (voiceRef.current) {
        voiceRef.current.stop();
        voiceRef.current = null;
      }
    };
  }, []);

  const handleVinylClick = (id) => {
    // Always stop any currently-playing voice note first
    if (voiceRef.current) {
      voiceRef.current.stop();
      voiceRef.current = null;
    }

    if (activeVinyl === id) {
      // Toggle off — restore ambient to full volume
      setActiveVinyl(null);
      setBackgroundVolume(0.3);
      return;
    }

    // New voice note — duck ambient, play note as a separate Howl
    setActiveVinyl(id);
    playSFX('vinyl_scratch', '/sounds/shadow-garden/sfx/vinyl_scratch.mp3');
    setBackgroundVolume(0.08);

    const noteHowl = new Howl({
      src: [`/sounds/voice_notes/note_${id}.mp3`],
      volume: 0.85,
      html5: true,
      onend: () => {
        setActiveVinyl(null);
        setBackgroundVolume(0.3);
        voiceRef.current = null;
      },
    });
    voiceRef.current = noteHowl;
    noteHowl.play();
  };

  const handlePhotoClick = (id) => {
    setModalImgFailed(false); // reset before each open so a fresh load is always attempted
    setShowPhoto(id);
    playSFX('shutter', '/sounds/shadow-garden/sfx/shutter.mp3');
  };

  const handleDownload = (e, id) => {
    e.stopPropagation();
    alert(`Downloading image ${id}... (Mock)`);
  };

  const handlePlayAgain = () => {
    setShowConfirmRestart(true);
  };

  const confirmRestart = () => {
    dispatch(rekindleJourney());
    playSFX('system_chime', '/sounds/shadow-garden/sfx/system_chime.mp3');
    setTimeout(() => {
      navigate('/shadow-garden');
    }, 300);
  };

  // One shelf row of dolls — shared by the mobile (3 per shelf) and desktop (5+4) blocks.
  const renderShelf = (dollList) => (
    <div className="w-full flex items-end justify-center gap-0 relative pb-5">
      <Shelf className="absolute bottom-0 w-[90%] h-4 bg-gradient-to-b from-[#3d2b1f] to-[#1a120d] rounded-sm shadow-2xl" />
      {dollList.map(doll => (
        <DollWrapper
          key={doll.id}
          className="group relative flex-1 flex justify-center"
          onClick={() => {
            setActiveDoll(doll);
            playSFX('sparkle', '/sounds/sparkle.mp3');
          }}
        >
          <Doll className="text-8xl cursor-pointer transition-all duration-500 group-hover:-translate-y-8 group-hover:scale-125 drop-shadow-xl">
            {failedDolls.has(doll.id)
              ? doll.emoji
              : <img
                  src={doll.src}
                  alt={doll.name}
                  onError={() => handleDollImgError(doll.id)}
                  draggable={false}
                  style={{ width: '1em', height: '1em', objectFit: 'contain' }}
                />
            }
          </Doll>
        </DollWrapper>
      ))}
    </div>
  );

  return (
    <Container className="w-screen h-[100dvh] md:h-screen bg-[#0a0a12] relative overflow-y-auto md:overflow-hidden flex flex-col items-center md:justify-center justify-start">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-90" />
      
      <Stars className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <Star key={i} style={{
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 5 + 's'
          }} />
        ))}
      </Stars>

      <Header className="relative z-10 mb-4 text-center">
        <h1 className="font-dancing text-4xl md:text-6xl text-sg-pink drop-shadow-[0_0_15px_rgba(255,182,193,0.5)]">The Heart Domain</h1>
        <p className="font-orbitron text-[10px] text-white/40 tracking-[0.3rem] md:tracking-[0.5rem] uppercase mt-2">Faith & Alvin's Sanctuary</p>
      </Header>

      <MainContent className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row md:h-[75vh] gap-4 md:gap-6 p-3 md:p-4">
        
        {/* Left: Vinyl Player & Notes */}
        <Section className="order-3 md:order-1 flex-none md:flex-1 md:min-h-0 glass-card p-4 md:p-6 flex flex-col items-center gap-4">
          <AccordionHeader id="archive" title="ARCHIVE" openPanels={openPanels} togglePanel={togglePanel} className="mb-2 md:mb-4" />

          <div className={`w-full flex-1 ${openPanels.includes('archive') ? 'flex' : 'hidden'} md:flex flex-col gap-4 overflow-y-auto max-h-[60vh] md:max-h-none hide-scrollbar`}>
            <h4 className="font-orbitron text-[10px] text-white/40 border-b border-white/10 pb-1">VOICE NOTES</h4>
            {voiceNotes.map(note => (
              <VinylRow 
                key={note.id}
                onClick={() => handleVinylClick(note.id)}
                $active={activeVinyl === note.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <VinylIcon $active={activeVinyl === note.id} className="w-10 h-10 rounded-full bg-black border-2 border-gray-800 flex items-center justify-center relative">
                  <div className="w-3 h-3 rounded-full bg-sg-rose" />
                </VinylIcon>
                <div className="flex-1">
                  <h4 className="font-quicksand font-bold text-white text-sm group-hover:text-sg-pink">{note.title}</h4>
                </div>
              </VinylRow>
            ))}

            <h4 className="font-orbitron text-[10px] text-white/40 border-b border-white/10 pb-1 mt-4">LOVE NOTES</h4>
            <div className="grid grid-cols-3 gap-2">
              {loveNotes.map(note => (
                <button
                  key={note.id}
                  onClick={() => {
                    setShowNote(note);
                    playSFX('sparkle', '/sounds/sparkle.mp3');
                  }}
                  className="bg-sg-purple/20 border border-sg-purple/40 p-2 rounded hover:bg-sg-purple/40 transition-all text-xl"
                >
                  📝
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Center: Doll Display */}
        <Section className="order-1 md:order-2 flex-none md:flex-[1.5] md:min-h-0 glass-card px-3 py-4 md:py-6 flex flex-col items-center justify-between relative">
          <AccordionHeader id="collection" title="HUNTER'S COLLECTION" openPanels={openPanels} togglePanel={togglePanel} className="mb-2 md:mb-0" />

          <div className={`flex-1 w-full ${openPanels.includes('collection') ? 'flex' : 'hidden'} md:flex flex-col justify-around py-2 gap-2`}>
            {/* Mobile: 3 shelves of 3 */}
            <div className="md:hidden flex flex-col justify-around gap-3 flex-1">
              {renderShelf(dolls.slice(0, 3))}
              {renderShelf(dolls.slice(3, 6))}
              {renderShelf(dolls.slice(6, 9))}
            </div>
            {/* Desktop: 5 + 4 */}
            <div className="hidden md:flex flex-col justify-around gap-2 flex-1 w-full">
              {renderShelf(dolls.slice(0, 5))}
              {renderShelf(dolls.slice(5))}
            </div>
          </div>

          <div className={`w-full bg-black/40 p-4 rounded-xl border border-white/5 text-center ${openPanels.includes('collection') ? 'block' : 'hidden'} md:block`}>
            <p className="font-dancing text-xl text-white/80">"Every shadow defeated, every memory cherished..."</p>
          </div>
        </Section>

        {/* Right: Gallery Wall */}
        <Section className="order-2 md:order-3 flex-none md:flex-1 md:min-h-0 glass-card p-4 md:p-6 flex flex-col items-center">
          <AccordionHeader id="gallery" title="PHOTO GALLERY" openPanels={openPanels} togglePanel={togglePanel} className="mb-2 md:mb-4" />
          <div className={`${openPanels.includes('gallery') ? 'grid' : 'hidden'} md:grid grid-cols-1 md:grid-cols-2 gap-3 w-full overflow-y-auto max-h-[60vh] md:max-h-none hide-scrollbar`}>
            {photos.map(photo => (
              <PhotoFrame
                key={photo.id}
                onClick={() => handlePhotoClick(photo.id)}
                className={`w-full bg-white p-2 shadow-2xl transform rotate-[-1deg] hover:rotate-0 transition-all cursor-pointer ${photo.colSpan === 2 ? 'md:col-span-2' : ''}`}
              >
                <div
                  className="w-full bg-gray-200 overflow-hidden relative"
                  style={{ aspectRatio: photo.aspectRatio }}
                >
                  {failedPhotos.has(photo.id)
                    ? <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono text-[8px]">MEMORY_00{photo.id}</div>
                    : <img
                        src={`/images/photos/photo_${photo.id}.jpeg`}
                        alt={photo.caption}
                        onError={() => handlePhotoImgError(photo.id)}
                        className="w-full h-full object-cover"
                      />
                  }
                </div>
                <p className="font-dancing text-black text-center mt-1 text-xs leading-tight">{photo.caption}</p>
              </PhotoFrame>
            ))}
          </div>
        </Section>
      </MainContent>

      <Footer className="relative z-10 mt-4 mb-4 md:mb-0 flex flex-wrap gap-4 items-center justify-center px-4">
        <button onClick={() => navigate('/')} className="btn-system text-[10px] bg-sg-midnight hover:bg-sg-purple border border-sg-purple">
          RETURN TO HUB
        </button>
        <button onClick={handlePlayAgain} className="btn-system text-[10px] bg-sg-gold/20 hover:bg-sg-gold/40 border border-sg-gold text-sg-gold">
          ⚔️ PLAY AGAIN
        </button>
        <div className="w-full md:w-auto text-center text-[8px] font-mono text-white/20 italic">
          "Every ending is a new beginning..."
        </div>
      </Footer>

      {/* Overlays */}
      {showPhoto && (() => {
        const currentPhoto = photos.find(p => p.id === showPhoto);
        return (
          <ModalOverlay onClick={() => setShowPhoto(null)}>
            <div className="bg-white p-4 rounded-sm shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '95vh', display: 'flex', flexDirection: 'column' }}
            >
              <div
                className="bg-gray-100 overflow-hidden relative"
                style={{
                  aspectRatio: currentPhoto?.aspectRatio,
                  maxHeight: '80vh',
                  maxWidth: '85vw',
                  width: '100%',
                  flex: '0 0 auto',
                }}
              >
                {modalImgFailed
                  ? <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono text-sm">MEMORY_00{showPhoto}</div>
                  : <img
                      src={`/images/photos/photo_${showPhoto}.jpeg`}
                      alt={currentPhoto?.caption}
                      onError={() => setModalImgFailed(true)}
                      className="w-full h-full object-contain"
                    />
                }
                <button
                  onClick={(e) => handleDownload(e, showPhoto)}
                  className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white"
                >
                  💾
                </button>
              </div>
              <div className="py-3 px-2 text-center flex-shrink-0">
                <h2 className="font-dancing text-2xl text-black">{currentPhoto?.caption}</h2>
                <button onClick={() => setShowPhoto(null)} className="mt-3 font-orbitron text-[10px] text-gray-400 uppercase hover:text-gray-600">Close</button>
              </div>
            </div>
          </ModalOverlay>
        );
      })()}

      {showNote && (
        <ModalOverlay onClick={() => setShowNote(null)}>
          <div className="bg-gradient-to-br from-sg-midnight to-sg-purple border-2 border-sg-gold p-8 rounded-2xl max-w-md text-center shadow-[0_0_30px_rgba(255,215,0,0.3)]" onClick={e => e.stopPropagation()}>
            <h2 className="font-orbitron text-sg-gold text-xs tracking-[0.3rem] mb-6 uppercase">System Message</h2>
            <p className="font-quicksand text-white text-lg leading-relaxed mb-8 italic">"{showNote.text}"</p>
            <p className="font-dancing text-sg-pink text-xl">- Alvin ❤️</p>
            <button onClick={() => setShowNote(null)} className="mt-8 bg-sg-gold text-black px-6 py-1 rounded-full font-bold text-xs">CLOSE</button>
          </div>
        </ModalOverlay>
      )}

      {/* Doll zoom modal */}
      {activeDoll && (
        <DollModalOverlay onClick={() => setActiveDoll(null)}>
          <DollModalCard onClick={e => e.stopPropagation()}>
            <DollZoomFigure>
              {failedDolls.has(activeDoll.id)
                ? <span style={{ fontSize: '120px' }}>{activeDoll.emoji}</span>
                : <DollZoomImg
                    src={activeDoll.src}
                    alt={activeDoll.name}
                    onError={() => {
                      handleDollImgError(activeDoll.id);
                    }}
                    draggable={false}
                  />
              }
            </DollZoomFigure>
            <DollZoomName className="font-orbitron text-sg-gold tracking-widest uppercase">
              {activeDoll.name}
            </DollZoomName>
            <DollZoomLabel className="font-dancing text-sg-pink">
              {activeDoll.label}
            </DollZoomLabel>
            <button
              onClick={() => setActiveDoll(null)}
              className="mt-6 font-orbitron text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest"
            >
              [ close ]
            </button>
          </DollModalCard>
        </DollModalOverlay>
      )}

      {showConfirmRestart && (
        <ModalOverlay onClick={() => setShowConfirmRestart(false)}>
          <div className="bg-gradient-to-br from-black via-sg-purple to-sg-midnight border-4 border-sg-gold p-10 rounded-3xl max-w-lg text-center shadow-[0_0_50px_rgba(255,215,0,0.5)] animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-6">⚔️</div>
            <h2 className="font-bangers text-4xl text-sg-gold tracking-wider mb-4 uppercase">Rekindle the Journey?</h2>
            <p className="font-quicksand text-white text-base leading-relaxed mb-6">
              This will reset all your progress and begin the Shadow Garden quest anew.
              Your love and memories remain eternal, but the adventure starts fresh.
            </p>
            <p className="font-mono text-sg-pink text-sm mb-8 italic">
              "In every cycle, our love grows stronger..."
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmRestart}
                className="bg-sg-gold text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-110 transition-transform shadow-lg"
              >
                YES, BEGIN AGAIN
              </button>
              <button
                onClick={() => setShowConfirmRestart(false)}
                className="bg-white/10 text-white border border-white/30 px-8 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all"
              >
                STAY HERE
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div``;
const Section = styled.div` background: rgba(10, 10, 20, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; `;
const Header = styled.header``;
const MainContent = styled.main``;
const Footer = styled.footer``;
const Stars = styled.div``;
const Star = styled.div` position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; animation: twinkle 3s infinite; @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } } `;
const VinylRow = styled.div` background: ${props => props.$active ? 'rgba(255, 182, 193, 0.1)' : 'transparent'}; border: 1px solid ${props => props.$active ? 'rgba(255, 182, 193, 0.3)' : 'transparent'}; `;
const VinylIcon = styled.div` animation: ${props => props.$active ? 'spin 3s linear infinite' : 'none'}; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `;
const Shelf = styled.div``;
const DollWrapper = styled.div``;
const Doll = styled.div``;
const PhotoFrame = styled.div``;
const ModalOverlay = styled.div` position: fixed; inset: 0; z-index: 100; background: rgba(0, 0, 0, 0.95); display: flex; align-items: center; justify-content: center; `;

/* ── Doll zoom modal ── */
const dollZoomIn = keyframes`
  from { transform: scale(0.25) translateY(40px); opacity: 0; }
  to   { transform: scale(1)    translateY(0);    opacity: 1; }
`;

const dollWobble = keyframes`
  0%   { transform: rotate(0deg); }
  15%  { transform: rotate(-6deg) scale(1.04); }
  30%  { transform: rotate(5deg)  scale(1.06); }
  45%  { transform: rotate(-4deg) scale(1.04); }
  60%  { transform: rotate(3deg)  scale(1.02); }
  75%  { transform: rotate(-2deg) scale(1.01); }
  100% { transform: rotate(0deg)  scale(1); }
`;

const DollModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DollModalCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  max-width: 90vw;
  width: 100%;
  background: linear-gradient(135deg, rgba(10, 0, 30, 0.95) 0%, rgba(30, 0, 60, 0.95) 100%);
  border: 2px solid rgba(157, 78, 221, 0.6);
  border-radius: 28px;
  box-shadow: 0 0 60px rgba(157, 78, 221, 0.35), 0 0 120px rgba(255, 105, 180, 0.15), inset 0 0 40px rgba(157, 78, 221, 0.06);
  animation: ${dollZoomIn} 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

  @media (min-width: 640px) {
    padding: 40px 48px;
    width: auto;
  }
`;

const DollZoomFigure = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  animation: ${dollWobble} 0.65s ease-out 0.3s 1;
  filter: drop-shadow(0 8px 24px rgba(157, 78, 221, 0.5));
`;

const DollZoomImg = styled.img`
  width: min(220px, 60vw);
  height: min(220px, 60vw);
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
`;

const DollZoomName = styled.div`
  font-size: 13px;
  letter-spacing: 0.35em;
  margin-bottom: 6px;
  text-shadow: 0 0 16px rgba(255, 215, 0, 0.6);
`;

const DollZoomLabel = styled.div`
  font-size: 22px;
  text-shadow: 0 0 14px rgba(255, 182, 193, 0.6);
`;

export default MusicRoom;
