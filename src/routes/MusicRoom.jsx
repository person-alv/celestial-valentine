import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useSound } from '../hooks/useSound';
import { loveNotes } from '../data/shadow-garden/loveNotes';
import { rekindleJourney } from '../store/slices/shadowGardenSlice';

const MusicRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { playBackground, playSFX, stopBackground } = useSound();
  const [activeVinyl, setActiveVinyl] = useState(null);
  const [showPhoto, setShowPhoto] = useState(null);
  const [showNote, setShowNote] = useState(null);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);

  const voiceNotes = [
    { id: 1, title: "Our First Hello", date: "Feb 2024" },
    { id: 2, title: "Midnight Thoughts", date: "April 2024" },
    { id: 3, title: "Summer Dreams", date: "July 2024" },
    { id: 4, title: "Autumn Whispers", date: "Oct 2024" },
    { id: 5, title: "A Special Message", date: "Valentine 2026" }
  ];

  const photos = [
    { id: 1, caption: "The day we met... ✨" },
    { id: 2, caption: "Coffee dates and rainy days. ☕" },
    { id: 3, caption: "Under the summer sun. ☀️" },
    { id: 4, caption: "Making magic together. 🪄" },
    { id: 5, caption: "Forever and always. ❤️" }
  ];

  useEffect(() => {
    playBackground('/sounds/music_room_ambient.mp3', 0.3);
    return () => stopBackground();
  }, [playBackground, stopBackground]);

  const handleVinylClick = (id) => {
    if (activeVinyl === id) {
      setActiveVinyl(null);
      playBackground('/sounds/music_room_ambient.mp3', 0.3);
    } else {
      setActiveVinyl(id);
      playSFX('vinyl_scratch', '/sounds/shadow-garden/sfx/vinyl_scratch.mp3');
      playBackground(`/sounds/voice_notes/note_${id}.mp3`, 0.6, false);
    }
  };

  const handlePhotoClick = (id) => {
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

  return (
    <Container className="w-screen h-screen bg-[#0a0a12] relative overflow-hidden flex flex-col items-center justify-center">
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
        <h1 className="font-dancing text-6xl text-sg-pink drop-shadow-[0_0_15px_rgba(255,182,193,0.5)]">The Heart Domain</h1>
        <p className="font-orbitron text-[10px] text-white/40 tracking-[0.5rem] uppercase mt-2">Faith & Alvin's Sanctuary</p>
      </Header>

      <MainContent className="relative z-10 w-full max-w-7xl h-[75vh] flex gap-6 p-4">
        
        {/* Left: Vinyl Player & Notes */}
        <Section className="flex-1 glass-card p-6 flex flex-col items-center gap-4">
          <SectionTitle className="font-orbitron text-sg-gold text-xs tracking-widest mb-4">ARCHIVE</SectionTitle>
          
          <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto hide-scrollbar">
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
                  onClick={() => setShowNote(note)}
                  className="bg-sg-purple/20 border border-sg-purple/40 p-2 rounded hover:bg-sg-purple/40 transition-all text-xl"
                >
                  📝
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Center: Doll Display */}
        <Section className="flex-[1.5] glass-card p-8 flex flex-col items-center justify-between relative">
          <SectionTitle className="font-orbitron text-sg-gold text-xs tracking-widest">HUNTER'S COLLECTION</SectionTitle>
          
          <div className="flex-1 w-full flex items-center justify-center gap-4 relative">
            <Shelf className="absolute bottom-1/4 w-[90%] h-4 bg-gradient-to-b from-[#3d2b1f] to-[#1a120d] rounded-sm shadow-2xl" />
            {['🧸', '🦊', '🐰', '🐼', '🐱'].map((emoji, i) => (
              <DollWrapper key={i} className="group relative">
                <Doll className="text-7xl cursor-pointer transition-all duration-500 group-hover:-translate-y-8 group-hover:scale-125 drop-shadow-xl">{emoji}</Doll>
              </DollWrapper>
            ))}
          </div>

          <div className="w-full bg-black/40 p-4 rounded-xl border border-white/5 text-center">
            <p className="font-dancing text-xl text-white/80">"Every shadow defeated, every memory cherished..."</p>
          </div>
        </Section>

        {/* Right: Gallery Wall */}
        <Section className="flex-1 glass-card p-6 flex flex-col items-center">
          <SectionTitle className="font-orbitron text-sg-gold text-xs tracking-widest mb-4">PHOTO GALLERY</SectionTitle>
          <div className="grid grid-cols-1 gap-4 w-full overflow-y-auto hide-scrollbar">
            {photos.map(photo => (
              <PhotoFrame 
                key={photo.id}
                onClick={() => handlePhotoClick(photo.id)}
                className="w-full bg-white p-2 shadow-2xl transform rotate-[-1deg] hover:rotate-0 transition-all cursor-pointer"
              >
                <div className="w-full aspect-video bg-gray-200 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-mono text-[8px]">IMG_{photo.id}</div>
                </div>
                <p className="font-dancing text-black text-center mt-2 text-sm">{photo.caption}</p>
              </PhotoFrame>
            ))}
          </div>
        </Section>
      </MainContent>

      <Footer className="relative z-10 mt-4 flex gap-4 items-center">
        <button onClick={() => navigate('/')} className="btn-system text-[10px] bg-sg-midnight hover:bg-sg-purple border border-sg-purple">
          RETURN TO HUB
        </button>
        <button onClick={handlePlayAgain} className="btn-system text-[10px] bg-sg-gold/20 hover:bg-sg-gold/40 border border-sg-gold text-sg-gold">
          ⚔️ PLAY AGAIN
        </button>
        <div className="text-[8px] font-mono text-white/20 italic">
          "Every ending is a new beginning..."
        </div>
      </Footer>

      {/* Overlays */}
      {showPhoto && (
        <ModalOverlay onClick={() => setShowPhoto(null)}>
          <div className="bg-white p-4 rounded-sm shadow-2xl max-w-4xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-[600px] h-[400px] bg-gray-100 flex items-center justify-center border border-gray-200 relative">
               <span className="font-mono text-gray-400">MEMORY_00{showPhoto}</span>
               <button 
                onClick={(e) => handleDownload(e, showPhoto)}
                className="absolute bottom-4 right-4 bg-black/10 hover:bg-black/20 p-2 rounded-full"
               >
                 💾
               </button>
            </div>
            <div className="p-4 text-center">
              <h2 className="font-dancing text-3xl text-black">{photos.find(p => p.id === showPhoto)?.caption}</h2>
              <button onClick={() => setShowPhoto(null)} className="mt-4 font-orbitron text-[10px] text-gray-400 uppercase">Close</button>
            </div>
          </div>
        </ModalOverlay>
      )}

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
const SectionTitle = styled.h3``;
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

export default MusicRoom;
