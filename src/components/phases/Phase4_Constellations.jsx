import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useSound } from '../../hooks/useSound';
import { constellations, generatePortrait, getRandomNoteIndices } from '../../utils/constellationData';
import { loveNotes } from '../../data/loveNotes';

const Phase4_Constellations = ({ onComplete, progress, onProgress }) => {
  const { play } = useSound();
  
  // -- STATE --
  
  // The random order in which user will solve the constellations (array of IDs 0-11)
  const [solvingOrder] = useState(() => 
    progress?.solvingOrder || 
    Array.from({ length: 12 }, (_, i) => i).sort(() => Math.random() - 0.5)
  );

  // How many we have solved so far (0 to 12)
  const [solvedCount, setSolvedCount] = useState(progress?.solvedCount || 0);

  // Which actual constellation ID are we currently working on?
  const currentConstellationId = solvingOrder[solvedCount < 12 ? solvedCount : 11];

  // List of IDs that are fully completed
  const [completedConstellationIds, setCompletedConstellationIds] = useState(
    progress?.constellationsCompleted || []
  );

  // Notes logic
  const [noteTriggerIds] = useState(() => 
    progress?.noteIndices || getRandomNoteIndices()
  );
  const [viewedNoteIds, setViewedNoteIds] = useState(progress?.viewedNotes || []);
  const [showNote, setShowNote] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  
  // Drawing state
  const [drawnConnections, setDrawnConnections] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [connectedStars, setConnectedStars] = useState(new Set());
  
  // Visuals
  const [backgroundStars] = useState(() => generateBackgroundStars());
  const [isGuideMinimized, setIsGuideMinimized] = useState(false);
  
  // "Sky Phrase" mode (after all 12 are done)
  const [showSkyPhrase, setShowSkyPhrase] = useState(false);

  // Derived Data
  const currentConstellation = constellations[currentConstellationId];
  
  // Fix for the "undefined" bug: Portrait needs to regenerate when the constellation ID changes
  // We use useMemo to keep it stable until the ID changes
  const portrait = useMemo(() => {
    if (solvedCount >= 12) return [];
    return generatePortrait(currentConstellation);
  }, [solvedCount, currentConstellation]);

  // -- HELPERS --

  function generateBackgroundStars() {
    return Array.from({ length: 200 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      twinkleDelay: Math.random() * 3
    }));
  }

  // Check if current puzzle is complete
  const isPuzzleComplete = drawnConnections.length === currentConstellation?.connections.length;

  // -- EFFECTS --

  // Handle puzzle completion
  useEffect(() => {
    // If we haven't officially marked this ID as complete yet...
    if (isPuzzleComplete && !completedConstellationIds.includes(currentConstellationId)) {
      play('success');
      
      const newCompletedIds = [...completedConstellationIds, currentConstellationId];
      setCompletedConstellationIds(newCompletedIds);
      
      // Delay to show success animation
      setTimeout(() => {
        // Check for Love Note
        if (noteTriggerIds.includes(currentConstellationId) && !viewedNoteIds.includes(currentConstellationId)) {
          const noteIndex = noteTriggerIds.indexOf(currentConstellationId);
          setCurrentNote(loveNotes[noteIndex]);
          setShowNote(true);
          setViewedNoteIds(prev => [...prev, currentConstellationId]);
          
          // Save progress here too so we don't lose the "viewed" status if they reload
          onProgress({
            solvingOrder,
            solvedCount: solvedCount, // Still on current count until note closes
            constellationsCompleted: newCompletedIds,
            noteIndices: noteTriggerIds,
            viewedNotes: [...viewedNoteIds, currentConstellationId]
          });
        } else {
          advanceToNextLevel(newCompletedIds);
        }
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPuzzleComplete]);

  const advanceToNextLevel = (updatedCompletedIds) => {
    const nextCount = solvedCount + 1;
    
    if (nextCount < 12) {
      // Prepare for next puzzle
      setSolvedCount(nextCount);
      setDrawnConnections([]);
      setConnectedStars(new Set());
      setCurrentPath(null);
      
      onProgress({
        solvingOrder,
        solvedCount: nextCount,
        constellationsCompleted: updatedCompletedIds,
        noteIndices: noteTriggerIds,
        viewedNotes: viewedNoteIds
      });
    } else {
      // All 12 done! Show the Sky Phrase finale
      setSolvedCount(12);
      setShowSkyPhrase(true);
      
      onProgress({
        solvingOrder,
        solvedCount: 12,
        constellationsCompleted: updatedCompletedIds,
        noteIndices: noteTriggerIds,
        viewedNotes: viewedNoteIds
      });

      // After a moment of admiring the phrase, complete the phase
      setTimeout(() => {
        onComplete({ constellationsCompleted: updatedCompletedIds });
      }, 8000); // 8 seconds to admire the sky phrase
    }
  };

  const handleNoteClose = () => {
    setShowNote(false);
    advanceToNextLevel(completedConstellationIds);
  };

  // -- INPUT HANDLERS --

  const handleStarMouseDown = (starIndex) => {
    if (showSkyPhrase) return;
    setCurrentPath({ 
      from: starIndex, 
      current: currentConstellation.stars[starIndex] 
    });
    play('starSelect');
  };

  const handleMouseMove = (e) => {
    if (!currentPath || showSkyPhrase) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) / rect.width * 100;
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) / rect.height * 100;
    
    setCurrentPath(prev => ({
      ...prev,
      current: { x, y }
    }));
  };

  const handleStarMouseUp = (starIndex) => {
    if (!currentPath || showSkyPhrase) return;
    
    const from = currentPath.from;
    const to = starIndex;
    
    // Valid connection check
    const isValid = currentConstellation.connections.some(
      conn => (conn[0] === from && conn[1] === to) || (conn[1] === from && conn[0] === to)
    );
    
    // Already drawn check
    const alreadyDrawn = drawnConnections.some(
      conn => (conn[0] === from && conn[1] === to) || (conn[1] === from && conn[0] === to)
    );
    
    if (isValid && from !== to && !alreadyDrawn) {
      setDrawnConnections(prev => [...prev, [from, to]]);
      setConnectedStars(prev => new Set([...prev, from, to]));
      play('starConnect');
    } else if (!isValid && from !== to) {
      play('error');
    }
    
    setCurrentPath(null);
  };

  const handleTouchEnd = (e) => {
    if (!currentPath || showSkyPhrase) return;

    const touch = e.changedTouches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX) - rect.left) / rect.width * 100;
    const y = ((touch.clientY) - rect.top) / rect.height * 100;

    // Find if we ended near any star
    const starIndex = currentConstellation.stars.findIndex(star => {
      const dist = Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2));
      return dist < 6; // Threshold for touch
    });

    if (starIndex !== -1) {
      handleStarMouseUp(starIndex);
    } else {
      setCurrentPath(null);
    }
  };

  const progress_percent = ((completedConstellationIds.length / 12) * 100).toFixed(0);

  // -- RENDER --

  return (
    <Container>
      {/* Background stars */}
      <StarField>
        {backgroundStars.map((star, i) => (
          <BackgroundStar
            key={i}
            x={star.x}
            y={star.y}
            size={star.size}
            delay={star.twinkleDelay}
          />
        ))}
      </StarField>

      {/* Progress & Title - Always visible at top */}
      <ProgressContainer>
        <ProgressText>
          {completedConstellationIds.length} of 12 stars collected
        </ProgressText>
        <ProgressBarOuter>
          <ProgressBarInner width={progress_percent} />
        </ProgressBarOuter>
        
        {/* The "Wheel of Fortune" Phrase */}
        <CompletedPhrase>
          {constellations.map((c, i) => (
            <Letter key={i} completed={completedConstellationIds.includes(c.id)}>
              {completedConstellationIds.includes(c.id) ? c.char : '_'}
            </Letter>
          ))}
        </CompletedPhrase>
      </ProgressContainer>

      {/* GAMEPLAY LAYER */}
      {!showSkyPhrase && currentConstellation && (
        <>
          <DrawingCanvas
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseUp={() => setCurrentPath(null)}
            onTouchEnd={handleTouchEnd}
          >
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
              {drawnConnections.map(([from, to], i) => (
                <line
                  key={i}
                  x1={`${currentConstellation.stars[from].x}%`}
                  y1={`${currentConstellation.stars[from].y}%`}
                  x2={`${currentConstellation.stars[to].x}%`}
                  y2={`${currentConstellation.stars[to].y}%`}
                  stroke="#FFD700"
                  strokeWidth="2"
                  opacity="0.6"
                />
              ))}
              
              {currentPath && (
                <line
                  x1={`${currentConstellation.stars[currentPath.from].x}%`}
                  y1={`${currentConstellation.stars[currentPath.from].y}%`}
                  x2={`${currentPath.current.x}%`}
                  y2={`${currentPath.current.y}%`}
                  stroke="rgba(255, 215, 0, 0.5)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              )}
            </svg>
            
            {currentConstellation.stars.map((star, i) => (
              <ConstellationStar
                key={i}
                x={star.x}
                y={star.y}
                connected={connectedStars.has(i)}
                onMouseDown={() => handleStarMouseDown(i)}
                onMouseUp={() => handleStarMouseUp(i)}
                onTouchStart={() => handleStarMouseDown(i)}
                onTouchEnd={() => handleStarMouseUp(i)}
              />
            ))}
          </DrawingCanvas>

          <PortraitGuide $minimized={isGuideMinimized}>
            <GuideHeader onClick={() => setIsGuideMinimized(!isGuideMinimized)}>
              <GuideTitle>Pattern</GuideTitle>
              <MinimizeBtn>{isGuideMinimized ? '+' : '-'}</MinimizeBtn>
            </GuideHeader>
            
            {!isGuideMinimized && (
              <PortraitCanvas>
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  {portrait.map((dot, i) => (
                    <circle key={i} cx={dot.x} cy={dot.y} r="3" fill="rgba(255, 255, 255, 0.8)" />
                  ))}
                  {currentConstellation.connections.map(([from, to], i) => (
                    <line
                      key={i}
                      x1={portrait[from].x}
                      y1={portrait[from].y}
                      x2={portrait[to].x}
                      y2={portrait[to].y}
                      stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
              </PortraitCanvas>
            )}
          </PortraitGuide>
        </>
      )}

      {/* FINALE LAYER - Sky Phrase */}
      {showSkyPhrase && (
        <SkyPhraseContainer>
          <SkyPhraseTitle>Your Constellation is Complete</SkyPhraseTitle>
          <SkyPhrase>Faith & Alvin ❤️</SkyPhrase>
          <SkySubtext>Written in the stars, forever.</SkySubtext>
        </SkyPhraseContainer>
      )}

      {/* Love note modal */}
      {showNote && (
        <NoteModal onClick={handleNoteClose}>
          <NoteCard onClick={(e) => e.stopPropagation()}>
            <NoteContent>{currentNote}</NoteContent>
            <CloseButton onClick={handleNoteClose}>Close ❤️</CloseButton>
          </NoteCard>
        </NoteModal>
      )}
    </Container>
  );
};

// -- STYLES --

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #191970 0%, #0a0a2e 100%);
  position: relative;
  overflow: hidden;
`;

const StarField = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const twinkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
`;

const BackgroundStar = styled.div`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation: ${twinkle} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const ProgressContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  width: 90%;
  max-width: 600px;
  pointer-events: none;
`;

const ProgressText = styled.div`
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
`;

const ProgressBarOuter = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarInner = styled.div`
  width: ${props => props.width}%;
  height: 100%;
  background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
  transition: width 0.5s ease;
`;

const letterReveal = keyframes`
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  50% { transform: scale(1.5) rotate(0deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const CompletedPhrase = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 15px;
  font-family: 'Dancing Script', cursive;
  font-size: 28px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    font-size: 24px;
    gap: 6px;
  }
`;

const Letter = styled.span`
  color: ${props => props.completed ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'};
  text-shadow: ${props => props.completed ? '0 0 20px rgba(255, 215, 0, 0.8)' : 'none'};
  transition: all 0.5s ease;
  min-width: 15px;
  display: inline-block;
  
  ${props => props.completed && css`
    animation: ${letterReveal} 0.8s ease-out;
  `}
`;

const DrawingCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 8px rgba(255, 255, 255, 0.8); transform: translate(-50%, -50%) scale(1); }
  50% { box-shadow: 0 0 15px rgba(255, 215, 0, 1); transform: translate(-50%, -50%) scale(1.2); }
  100% { box-shadow: 0 0 8px rgba(255, 255, 255, 0.8); transform: translate(-50%, -50%) scale(1); }
`;

const ConstellationStar = styled.div`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.connected ? '12px' : '8px'};
  height: ${props => props.connected ? '12px' : '8px'};
  background: ${props => props.connected ? '#FFD700' : 'white'};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 20;
  
  &::after {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
  }

  animation: ${pulse} 2s infinite ease-in-out;
  
  ${props => props.connected && css`
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
    animation: none;
  `}

  &:hover {
    transform: translate(-50%, -50%) scale(1.5);
    background: #FFD700;
  }
`;

const PortraitGuide = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: ${props => props.$minimized ? 'auto' : '120px'};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  z-index: 50;
  transition: all 0.3s ease;
  overflow: hidden;
  
  @media (max-width: 768px) {
    top: auto;
    bottom: 20px;
    right: 20px;
  }
`;

const GuideHeader = styled.div`
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const GuideTitle = styled.div`
  font-family: 'Quicksand', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
`;

const MinimizeBtn = styled.span`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const PortraitCanvas = styled.div`
  width: 100%;
  height: 120px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoteModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const NoteCard = styled.div`
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
  padding: 40px;
  border-radius: 20px;
  max-width: 600px;
  margin: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.5s ease-out;
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const NoteContent = styled.p`
  font-family: 'Dancing Script', cursive;
  font-size: 28px;
  color: white;
  line-height: 1.6;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  white-space: pre-wrap;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 15px;
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 600;
  background: white;
  border: none;
  border-radius: 50px;
  color: #E63946;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }
`;

const skyReveal = keyframes`
  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const SkyPhraseContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background: rgba(0, 0, 0, 0.4);
  animation: ${skyReveal} 2s ease-out;
`;

const SkyPhraseTitle = styled.h2`
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  color: #FFD700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
  opacity: 0.8;
`;

const SkyPhrase = styled.h1`
  font-family: 'Dancing Script', cursive;
  font-size: 84px;
  color: white;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 105, 180, 0.5);
  margin-bottom: 20px;
  text-align: center;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    font-size: 56px;
  }
`;

const SkySubtext = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
`;

export default Phase4_Constellations;