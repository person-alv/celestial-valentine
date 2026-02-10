import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useSound } from '../../hooks/useSound';

// --- ANIMATIONS ---

const shakeAnimation = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(-10px, -10px) rotate(-2deg); }
  20% { transform: translate(10px, 10px) rotate(2deg); }
  30% { transform: translate(-10px, 10px) rotate(-1deg); }
  40% { transform: translate(10px, -10px) rotate(1deg); }
  50% { transform: translate(-10px, -10px) rotate(-2deg); }
  60% { transform: translate(10px, 10px) rotate(2deg); }
  70% { transform: translate(-10px, 10px) rotate(-1deg); }
  80% { transform: translate(10px, -10px) rotate(1deg); }
  90% { transform: translate(-10px, -10px) rotate(0deg); }
`;

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  20% { opacity: 0.2; }
  80% { opacity: 0.2; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.7); }
  100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
`;

const etherealFade = keyframes`
  0% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); filter: blur(10px); }
`;

const popIn = keyframes`
  0% { transform: translate(-50%, -50%) scale(0) rotate(-10deg); }
  100% { transform: translate(-50%, -50%) scale(1) rotate(2deg); }
`;

const heartPulse = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.4)); }
  50% { transform: scale(1.15); filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.8)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.4)); }
`;

const sparkleFloat = keyframes`
  0% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  100% { opacity: 0; transform: translate(calc(-50% + 100px), calc(-50% + 100px)) scale(0) rotate(360deg); }
`;

// --- STYLED COMPONENTS ---

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 50%, #FF1493 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  ${props => props.$shake && css`
    animation: ${shakeAnimation} 0.5s ease-in-out;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%);
    pointer-events: none;
  }
`;

const BackgroundAura = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const FloatingEl = styled.div`
  position: absolute;
  left: ${props => props.$x}%;
  top: 100%;
  font-size: ${props => props.$size}px;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.children ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} ${props => props.$duration}s linear infinite;
  animation-delay: ${props => props.$delay}s;
  filter: blur(2px);
`;

const Title = styled.h1`
  font-family: 'Dancing Script', cursive;
  font-size: 64px;
  background: linear-gradient(90deg, #fff 0%, #FFD700 25%, #fff 50%, #FFD700 75%, #fff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 4s linear infinite;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 40px;
  }
`;

const RedHeart = styled.span`
  display: inline-block;
  -webkit-text-fill-color: initial;
  background: none;
  animation: ${heartPulse} 2s ease-in-out infinite;
  vertical-align: middle;
  margin-left: 10px;
`;

const TitleShadow = styled(Title)`
  position: absolute;
  top: 4px;
  left: 4px;
  filter: blur(8px);
  opacity: 0.3;
  z-index: 1;
`;

const TitleContainer = styled.div`
  position: relative;
  margin-bottom: 60px;
`;

const GlowContainer = styled.div`
  position: relative;
  border-radius: 50px;
  animation: ${pulseGlow} 2s infinite ease-in-out;
  transform: scale(${props => props.$scale});
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
`;

const YesButton = styled.button`
  padding: 20px 60px;
  font-size: 24px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
    transform: rotate(45deg);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(255, 215, 0, 0.6);
  }
  
  @media (max-width: 768px) {
    padding: 15px 40px;
    font-size: 20px;
  }
`;

const NoButton = styled.button`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  padding: 25px 80px;
  font-size: 28px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  background: #E63946;
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: translate(-50%, -50%);
  box-shadow: 0 8px 20px rgba(230, 57, 70, 0.4);
  z-index: 5;
  
  ${props => props.$dissolving && css`
    animation: dissolve 1s ease-out forwards;
  `}
  
  @keyframes dissolve {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.2); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); filter: blur(10px); }
  }
  
  @media (hover: hover) {
    &:hover {
      transform: translate(-50%, -50%) scale(1.05);
    }
  }
`;

const GhostButton = styled.div`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  padding: 25px 80px;
  font-size: 28px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ${etherealFade} 0.8s ease-out forwards;
  z-index: 1;
`;

const SpeechBubble = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 30px 40px;
  border-radius: 30px;
  font-family: 'Bangers', cursive;
  font-size: 32px;
  color: #E63946;
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.3),
    inset 0 -5px 0 rgba(0,0,0,0.05);
  z-index: 1000;
  max-width: 80%;
  text-align: center;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$show ? 1 : 0};
  pointer-events: none;
  border: 4px solid #FADADD; /* Soft pink border */
  
  ${props => props.$show && css`
    animation: ${popIn} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  `}

  &::after {
    content: '';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 25px solid #fff;
  }
`;

const Content = styled.div`
  text-align: center;
  z-index: 10;
`;

const ButtonContainer = styled.div`
  position: relative;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// --- HELPER COMPONENTS ---

const GlitterExplosion = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 40,
    y: 50 + (Math.random() - 0.5) * 40,
    rotation: Math.random() * 360,
    scale: Math.random() * 1.5 + 0.5,
    duration: Math.random() * 1 + 0.8,
    delay: Math.random() * 0.2
  }));

  return (
    <GlitterContainer>
      {particles.map(particle => (
        <Sparkle
          key={particle.id}
          $x={particle.x}
          $y={particle.y}
          $rotation={particle.rotation}
          $scale={particle.scale}
          $duration={particle.duration}
          $delay={particle.delay}
        >
          ✨
        </Sparkle>
      ))}
    </GlitterContainer>
  );
};

const GlitterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
`;

const Sparkle = styled.div`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  font-size: 24px;
  pointer-events: none;
  animation: ${sparkleFloat} ${props => props.$duration}s ease-out forwards;
  animation-delay: ${props => props.$delay}s;
`;

// --- MAIN COMPONENT ---

const Phase1_Ask = ({ onAccept }) => {
  const { play } = useSound();
  
  // State management
  const [noPosition, setNoPosition] = useState({ x: 70, y: 50 });
  const [yesSize, setYesSize] = useState(1);
  const [ghostTrail, setGhostTrail] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showGlitter, setShowGlitter] = useState(false);
  const [noButtonDissolving, setNoButtonDissolving] = useState(false);

  // Popup messages with emojis
  const popupMessages = [
    "HEY! Wrong way! 😤",
    "Stop that! You know you love me! 💕",
    "Really? REALLY?? 🙄",
    "Alvin is sad now... 😢 🥺",
    "The YES button is RIGHT THERE! 👉 ✨",
    "You're breaking my heart! 💔 😭",
    "Fine, I'll just move again... 😏 💨",
    "This is getting ridiculous 😂 🛑",
    "Come on, you know you want to! 😘 💖",
    "I can do this all day! 💪 🏃‍♂️"
  ];

  // Helper to generate a safe position
  const getSafePosition = () => {
    let newX, newY, distance;
    const centerX = 50;
    const centerY = 50;
    const safeRadius = 25; 

    let attempts = 0;
    do {
      newX = Math.random() * 80 + 10;
      newY = Math.random() * 80 + 10;
      distance = Math.sqrt(Math.pow(newX - centerX, 2) + Math.pow(newY - centerY, 2));
      attempts++;
    } while (distance < safeRadius && attempts < 50);

    return { x: newX, y: newY };
  };

  const handleNoHover = () => {
    setGhostTrail(prev => [...prev, { 
      x: noPosition.x, 
      y: noPosition.y, 
      id: Date.now() 
    }]);
    
    const newPos = getSafePosition();
    setNoPosition(newPos);
    setYesSize(prev => Math.min(prev + 0.15, 3));
    play('buttonEscape');
  };

  const handleNoClick = (e) => {
    e.preventDefault();
    const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];
    setPopupText(randomMessage);
    setShowPopup(true);
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 500);
    
    setTimeout(() => {
      const newPos = getSafePosition();
      setNoPosition(newPos);
    }, 600);

    setTimeout(() => {
        setShowPopup(false);
    }, 2000);
    
    setYesSize(prev => Math.min(prev + 0.3, 3));
    play('screenShake');
    
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const handleYesClick = () => {
    play('sparkle');
    setShowGlitter(true);
    setNoButtonDissolving(true);
    setTimeout(() => {
      onAccept();
    }, 2000);
  };

  useEffect(() => {
    if (ghostTrail.length > 0) {
      const timer = setTimeout(() => {
        setGhostTrail(prev => prev.slice(1));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [ghostTrail]);

  // Generate background elements
  const [bgElements] = useState(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 40 + 20,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    type: Math.random() > 0.5 ? 'heart' : 'circle'
  })));

  return (
    <Container $shake={shakeScreen}>
      {/* Background Aura */}
      <BackgroundAura>
        {bgElements.map(el => (
          <FloatingEl 
            key={el.id} 
            $x={el.x} 
            $y={el.y} 
            $size={el.size} 
            $duration={el.duration} 
            $delay={el.delay}
          >
            {el.type === 'heart' ? '❤️' : ''}
          </FloatingEl>
        ))}
      </BackgroundAura>

      {/* Ghost trail from NO button movement */}
      {ghostTrail.map(ghost => (
        <GhostButton key={ghost.id} $x={ghost.x} $y={ghost.y}>
          NO
        </GhostButton>
      ))}

      {/* Main content */}
      <Content>
        <TitleContainer>
          <Title>
            Will you be my Valentine? <RedHeart>💖</RedHeart>
          </Title>
          <TitleShadow>
            Will you be my Valentine? 💖
          </TitleShadow>
        </TitleContainer>
        
        <ButtonContainer>
          <GlowContainer $scale={yesSize}>
            <YesButton
              onClick={handleYesClick}
              $scale={yesSize}
              $showGlitter={showGlitter}
            >
              YES! ✨
            </YesButton>
          </GlowContainer>

          {!noButtonDissolving && (
            <NoButton
              $x={noPosition.x}
              $y={noPosition.y}
              onMouseEnter={handleNoHover}
              onClick={handleNoClick}
              onTouchStart={handleNoClick}
              $dissolving={noButtonDissolving}
            >
              NO
            </NoButton>
          )}
        </ButtonContainer>
      </Content>

      <SpeechBubble $show={showPopup}>
        {popupText}
      </SpeechBubble>

      {showGlitter && <GlitterExplosion />}
    </Container>
  );
};

export default Phase1_Ask;
