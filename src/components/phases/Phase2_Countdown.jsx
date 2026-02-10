import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useCountdown } from '../../hooks/useCountdown';
import { useSound } from '../../hooks/useSound';
import { VALENTINE_DATE, getCountdownBackgroundColor } from '../../utils/constants';

const Phase2_Countdown = ({ onComplete }) => {
  const { play } = useSound();
  const timeLeft = useCountdown(VALENTINE_DATE);
  const [floatingMessages, setFloatingMessages] = useState([]);
  
  // Teasing messages
  const teaseMessages = [
    "Patience is a virtue, beautiful ❤️",
    "Good things come to those who wait...",
    "Almost there, my love 💕",
    "Just a little longer...",
    "The stars are aligning for us ✨",
    "Worth the wait, I promise 😘",
    "Every second brings us closer 💫",
    "Missing you already... ❤️",
    "Can't wait to see you! 🥰",
    "You're so impatient! 😂"
  ];

  useEffect(() => {
    if (timeLeft.isComplete) {
      onComplete();
    }
  }, [timeLeft.isComplete, onComplete]);

  // Calculate dynamic colors
  const mainColor = getCountdownBackgroundColor(timeLeft.days);
  const backgroundGradient = `radial-gradient(circle at center, ${mainColor} 0%, #000000 100%)`;

  const [lastTouchTime, setLastTouchTime] = useState(0);

  const handleScreenTap = (e) => {
    // If this is a mouse event but it happened right after a touch event, ignore it
    if (e.type !== 'touchstart' && Date.now() - lastTouchTime < 500) {
      return;
    }

    if (e.type === 'touchstart') {
      setLastTouchTime(Date.now());
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    if (!clientX || !clientY) return;

    const x = (clientX - rect.left) / rect.width * 100;
    const y = (clientY - rect.top) / rect.height * 100;
    
    const message = teaseMessages[Math.floor(Math.random() * teaseMessages.length)];
    
    const newMessage = {
      id: Date.now() + Math.random(),
      x,
      y,
      text: message
    };
    
    setFloatingMessages(prev => [...prev, newMessage]);
    setTimeout(() => {
      setFloatingMessages(prev => prev.filter(m => m.id !== newMessage.id));
    }, 3000);
    
    play('tap');
  };

  return (
    <Container 
      $background={backgroundGradient}
      onMouseDown={handleScreenTap}
      onTouchStart={(e) => {
        handleScreenTap(e);
      }}
    >
      {floatingMessages.map(msg => (
        <FloatingMessage key={msg.id} x={msg.x} y={msg.y}>
          {msg.text}
        </FloatingMessage>
      ))}

      <Content>
        <Message>Counting down to our special day...</Message>
        
        <HeartContainer>
          {/* SVG Heart that changes color dynamically */}
          <HeartSvg viewBox="0 0 100 100" fill={mainColor}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path 
              d="M50,90 C50,90 10,60 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z" 
              filter="url(#glow)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
            />
            {/* Shine overlay */}
            <path 
              d="M30,20 C40,20 45,25 45,35 C40,30 35,25 30,20" 
              fill="url(#shine)" 
              opacity="0.6"
            />
          </HeartSvg>

          <TimerInner>
            <TimeUnit>
              <TimeValue>{String(timeLeft.days).padStart(2, '0')}</TimeValue>
              <TimeLabel>Days</TimeLabel>
            </TimeUnit>
            <Separator>:</Separator>
            <TimeUnit>
              <TimeValue>{String(timeLeft.hours).padStart(2, '0')}</TimeValue>
              <TimeLabel>Hrs</TimeLabel>
            </TimeUnit>
            <Separator>:</Separator>
            <TimeUnit>
              <TimeValue>{String(timeLeft.minutes).padStart(2, '0')}</TimeValue>
              <TimeLabel>Mins</TimeLabel>
            </TimeUnit>
            <Separator>:</Separator>
            <TimeUnit>
              <TimeValue>{String(timeLeft.seconds).padStart(2, '0')}</TimeValue>
              <TimeLabel>Secs</TimeLabel>
            </TimeUnit>
          </TimerInner>
        </HeartContainer>

        <HintText>Tap anywhere to pass the time ✨</HintText>
      </Content>
    </Container>
  );
};

// Styled Components

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.$background};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: background 2s ease-in-out;
  cursor: pointer;
`;

const Content = styled.div`
  text-align: center;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const heartbeat = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const HeartContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 20px auto;
  animation: ${heartbeat} 1s ease-in-out infinite; // Beating 1 per second
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const HeartSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
  transition: fill 2s ease-in-out;
`;

const TimerInner = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: relative;
  margin-top: -30px; // Center vertically in the heart shape

  @media (max-width: 768px) {
    gap: 8px;
    margin-top: -20px;
  }
`;

const Message = styled.h2`
  font-family: 'Dancing Script', cursive;
  font-size: 36px;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    font-size: 24px;
    padding: 0 20px;
  }
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimeValue = styled.div`
  font-family: 'Quicksand', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const TimeLabel = styled.div`
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 5px;
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const Separator = styled.div`
  font-size: 32px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const HintText = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  margin-top: 20px;
`;

const floatAway = keyframes`
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
  10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -150px) scale(0.5); }
`;

const FloatingMessage = styled.div`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  font-family: 'Dancing Script', cursive;
  font-size: 24px;
  color: white;
  pointer-events: none;
  animation: ${floatAway} 3s ease-out forwards;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  z-index: 20;
`;

export default Phase2_Countdown;
