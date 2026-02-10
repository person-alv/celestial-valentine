import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useSound } from '../../hooks/useSound';
import finalLetter from '../../data/finalLetter';
import html2canvas from 'html2canvas';

const Phase5_Letter = ({ onPlayAgain }) => {
  const { play } = useSound();
  const animationStarted = useRef(false);
  
  const [isUnrolling, setIsUnrolling] = useState(true);
  const [visibleSentences, setVisibleSentences] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  
  // Split letter into logical blocks (paragraphs or stanzas) based on double newlines
  // This preserves the internal structure of poem stanzas
  const rawBlocks = finalLetter
    .split(/\n\s*\n/) // Split by double newlines (paragraphs/stanzas)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.includes('PLACEHOLDER'));

  useEffect(() => {
    if (animationStarted.current) return;
    animationStarted.current = true;

    // Play scroll sound
    play('scroll');
    
    // Unroll animation duration
    setTimeout(() => {
      setIsUnrolling(false);
      
      let cumulativeDelay = 0;

      rawBlocks.forEach((block, index) => {
        // Determine reading time based on content type
        const isPoemStanza = block.includes('\n'); // Stanzas have internal line breaks
        const isShortLine = block.length < 50;
        
        // Base delay
        let readTime = 2500; 
        
        if (isPoemStanza) {
          readTime = 5000; // Give 5 seconds to read a stanza
        } else if (isShortLine) {
          readTime = 1500; // Shorter pause for short lines
        }

        setTimeout(() => {
          setVisibleSentences(prev => [...prev, block]);
          play('shimmer');
          
          // Show buttons after last block
          if (index === rawBlocks.length - 1) {
            setTimeout(() => setShowButtons(true), 2000);
          }
        }, cumulativeDelay);

        cumulativeDelay += readTime;
      });
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScreenshot = async () => {
    try {
      const element = document.getElementById('scroll-container');
      const canvas = await html2canvas(element, {
        backgroundColor: null, // Transparent background to capture stars if possible
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = 'faith-alvin-valentine.png';
      link.href = canvas.toDataURL();
      link.click();
      
      play('success');
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  // Generate background stars
  const backgroundStars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    twinkleDelay: Math.random() * 3
  }));

  return (
    <Container>
      {/* Night Sky Background */}
      <StarField>
        {backgroundStars.map((star) => (
          <Star
            key={star.id}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.twinkleDelay}s`
            }}
          />
        ))}
      </StarField>

      <ScrollContainer id="scroll-container">
        <ParchmentScroll unrolling={isUnrolling}>
          <ScrollTop />
          <ScrollBody>
            <LetterContent>
              {visibleSentences.map((block, i) => (
                <Sentence 
                  key={i} 
                  $isGreeting={block.startsWith('Dear Princess')}
                  $isSignature={block.startsWith('All my love') || block.includes('Alvin ❤️')}
                  $isPoem={block.includes('\n')}
                >
                  {block}
                </Sentence>
              ))}
            </LetterContent>
          </ScrollBody>
          <ScrollBottom />
        </ParchmentScroll>
      </ScrollContainer>

      {showButtons && (
        <ButtonContainer>
          <ActionButton onClick={onPlayAgain} primary>
            Play Again ✨
          </ActionButton>
          <ActionButton onClick={handleScreenshot}>
            Screenshot My Love 📸
          </ActionButton>
        </ButtonContainer>
      )}
    </Container>
  );
};

// Styled Components

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Changed from center to allow scrolling down */
  overflow-y: auto;
  padding: 40px 20px 120px; /* Increased bottom padding */
  position: relative;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const twinkle = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const Star = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: ${twinkle} 3s ease-in-out infinite;
`;

const ScrollContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 900px;
  margin-bottom: 40px;
  position: relative;
  z-index: 10;
`;

const ParchmentScroll = styled.div`
  width: 100%;
  max-width: 800px;
  /* Realistic Paper Texture */
  background-color: #f4e8d0;
  background-image: 
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
  
  border-radius: 5px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 0 40px rgba(139, 69, 19, 0.1);
    
  position: relative;
  overflow: hidden;
  animation: ${props => props.unrolling ? 'unroll 2s ease-out forwards' : 'none'};
  max-height: ${props => props.unrolling ? '0' : 'none'};
  
  @keyframes unroll {
    0% {
      max-height: 0;
      transform: scaleY(0);
      transform-origin: top;
    }
    100% {
      max-height: 5000px;
      transform: scaleY(1);
    }
  }
`;

const ScrollTop = styled.div`
  width: 100%;
  height: 50px;
  /* Wood texture for scroll handles */
  background: linear-gradient(180deg, #5d4037 0%, #8b4513 50%, #3e2723 100%);
  border-radius: 8px 8px 0 0;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  
  &::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 12px;
    background: #3e2723;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
  }
`;

const ScrollBody = styled.div`
  padding: 80px 60px;
  min-height: 400px;
  
  @media (max-width: 768px) {
    padding: 50px 25px;
  }
`;

const LetterContent = styled.div`
  font-family: 'Dancing Script', cursive;
  font-size: 26px;
  line-height: 1.8;
  color: #2C1810;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Sentence = styled.p`
  margin-bottom: ${props => props.$isGreeting ? '40px' : '24px'};
  font-weight: ${props => (props.$isGreeting || props.$isSignature) ? 'bold' : 'normal'};
  white-space: pre-line; /* Respects internal newlines for poems */
  line-height: ${props => props.$isPoem ? '1.6' : '1.8'};
  animation: shimmerIn 2s ease-out;
  
  ${props => props.$isSignature && css`
    margin-top: 40px;
    margin-bottom: 8px;
  `}

  @keyframes shimmerIn {
    0% {
      opacity: 0;
      filter: blur(5px);
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0);
    }
  }
`;

const ScrollBottom = styled(ScrollTop)`
  border-radius: 0 0 8px 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeIn 1s ease-out;
  z-index: 20;
  margin-bottom: 40px; /* Added margin */
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ActionButton = styled.button`
  padding: 15px 40px;
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: white;
    box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6);
    }
  ` : `
    background: white;
    color: #E63946;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }
  `}
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 12px 30px;
    font-size: 16px;
  }
`;

export default Phase5_Letter;