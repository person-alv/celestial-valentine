================================================================================
SHADOW GARDEN: TECHNICAL IMPLEMENTATION DOCUMENTATION - PART 3 (FINAL)
================================================================================

TABLE OF CONTENTS - PART 3:
11. GSAP Animation System
12. Tutorial System
13. Loading Screens
14. Performance Optimization
15. Debug Mode Implementation
16. Testing Strategy
17. Deployment Guide
18. 3-Day Build Timeline

================================================================================
11. GSAP ANIMATION SYSTEM
================================================================================

--------------------------------------------------------------------------------
11.1 GSAP Setup and Presets
--------------------------------------------------------------------------------

File: src/utils/animations.js

```javascript
import gsap from 'gsap';

// GSAP Global Configuration
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false
});

// Animation Presets for Shadow Garden

export const animations = {
  // Tile animations
  tileMatch: (element) => {
    return gsap.to(element, {
      scale: 0,
      rotation: 360,
      opacity: 0,
      duration: 0.4,
      ease: 'back.in(1.7)'
    });
  },
  
  tileFall: (element, delay = 0) => {
    return gsap.fromTo(element,
      { y: -100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5,
        delay,
        ease: 'bounce.out'
      }
    );
  },
  
  tileSelect: (element) => {
    return gsap.to(element, {
      scale: 1.1,
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
      duration: 0.2,
      ease: 'power2.out'
    });
  },
  
  tileDeselect: (element) => {
    return gsap.to(element, {
      scale: 1,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      duration: 0.2,
      ease: 'power2.out'
    });
  },
  
  // UI animations
  systemWindowAppear: (element) => {
    return gsap.fromTo(element,
      { 
        opacity: 0, 
        y: -50,
        scale: 0.8
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }
    );
  },
  
  systemWindowDisappear: (element) => {
    return gsap.to(element, {
      opacity: 0,
      y: 50,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in'
    });
  },
  
  // Boss animations
  bossHit: (element) => {
    return gsap.timeline()
      .to(element, { x: -5, duration: 0.05 })
      .to(element, { x: 5, duration: 0.05 })
      .to(element, { x: -5, duration: 0.05 })
      .to(element, { x: 0, duration: 0.05 });
  },
  
  bossDefeat: (element) => {
    return gsap.timeline()
      .to(element, { 
        scale: 1.2, 
        rotation: -15,
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(element, {
        scale: 0,
        opacity: 0,
        rotation: 360,
        duration: 0.5,
        ease: 'power2.in'
      });
  },
  
  // Score animations
  scorePopup: (element, points) => {
    // Create floating score text
    const popup = document.createElement('div');
    popup.textContent = `+${points}`;
    popup.style.cssText = `
      position: fixed;
      font-family: 'Bangers', cursive;
      font-size: 32px;
      color: #FFD700;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
      pointer-events: none;
      z-index: 1000;
    `;
    
    const rect = element.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top}px`;
    
    document.body.appendChild(popup);
    
    return gsap.to(popup, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => popup.remove()
    });
  },
  
  // Combo animations
  comboShake: () => {
    const board = document.getElementById('game-board');
    return gsap.timeline()
      .to(board, { x: -3, duration: 0.05 })
      .to(board, { x: 3, duration: 0.05 })
      .to(board, { x: -3, duration: 0.05 })
      .to(board, { x: 3, duration: 0.05 })
      .to(board, { x: 0, duration: 0.05 });
  },
  
  comboFlash: () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 215, 0, 0.3);
      pointer-events: none;
      z-index: 99;
    `;
    document.body.appendChild(overlay);
    
    return gsap.fromTo(overlay,
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => overlay.remove()
      }
    );
  }
};

// Variable speed system for matches/power-ups
export const setAnimationSpeed = (multiplier = 1) => {
  gsap.globalTimeline.timeScale(multiplier);
};

// Slow-mo for big combos
export const triggerSlowMo = (duration = 1000) => {
  setAnimationSpeed(0.5);
  setTimeout(() => setAnimationSpeed(1), duration);
};

// Speed up for cascades
export const triggerSpeedUp = () => {
  setAnimationSpeed(1.5);
  setTimeout(() => setAnimationSpeed(1), 500);
};
```

--------------------------------------------------------------------------------
11.2 Domain Expansion Sequence (Canvas + GSAP Hybrid)
--------------------------------------------------------------------------------

File: src/components/shadow-garden/effects/DomainExpansion.jsx

```javascript
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { playSound } from '../../../hooks/useSound';

const DomainExpansion = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    playExpansionSequence();
  }, []);
  
  const playExpansionSequence = async () => {
    const container = containerRef.current;
    
    // Step 1: Faith's Avatar grows (0-3s)
    const avatar = document.getElementById('faith-avatar');
    if (avatar) {
      gsap.to(avatar, {
        scale: 3,
        x: window.innerWidth / 2 - avatar.getBoundingClientRect().left,
        y: window.innerHeight / 2 - avatar.getBoundingClientRect().top,
        duration: 1,
        ease: 'power2.out'
      });
      
      // Eyes glow with all power colors
      gsap.to(avatar, {
        filter: 'drop-shadow(0 0 30px #00BFFF) drop-shadow(0 0 30px #9D4EDD) drop-shadow(0 0 30px #FFD700)',
        duration: 1,
        delay: 0.5
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Black screen + proclamation (3-5s)
    const blackScreen = document.createElement('div');
    blackScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    `;
    
    const text = document.createElement('div');
    text.style.cssText = `
      font-family: 'Bangers', cursive;
      font-size: 72px;
      color: white;
      text-align: center;
      opacity: 0;
    `;
    text.innerHTML = `
      <div style="margin-bottom: 20px;">DOMAIN EXPANSION:</div>
      <div style="font-size: 96px; background: linear-gradient(90deg, #FFB6C1, #FFD700, #9D4EDD); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">INFINITE LOVE</div>
    `;
    blackScreen.appendChild(text);
    document.body.appendChild(blackScreen);
    
    gsap.to(text, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    });
    
    // Play domain expansion sound
    playSound('domain_expansion');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Color explosion (5-10s)
    gsap.to(blackScreen, {
      background: 'radial-gradient(circle, #FF1493 0%, #7B2CBF 50%, #000000 100%)',
      duration: 1
    });
    
    // Start canvas animation
    startCanvasAnimation(canvasRef.current);
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 4: Pierce through boss (10-15s)
    const heartSpiral = createHeartSpiral();
    gsap.to(heartSpiral, {
      scale: 5,
      rotation: 720,
      duration: 3,
      ease: 'power2.inOut'
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 5: White flash and reveal (15-20s)
    gsap.to(blackScreen, {
      background: 'white',
      duration: 0.5
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fade to new scene
    gsap.to(blackScreen, {
      opacity: 0,
      duration: 2,
      onComplete: () => {
        blackScreen.remove();
        onComplete();
      }
    });
  };
  
  const startCanvasAnimation = (canvas) => {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle system for swirling colors
    const particles = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        color: ['#FFB6C1', '#FFD700', '#9D4EDD', '#FF1493'][Math.floor(Math.random() * 4)],
        size: Math.random() * 5 + 2
      });
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Spiral towards center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        p.vx += dx * 0.0001;
        p.vy += dy * 0.0001;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  const createHeartSpiral = () => {
    const spiral = document.createElement('div');
    spiral.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 100px;
      z-index: 1001;
    `;
    spiral.textContent = '💖';
    document.body.appendChild(spiral);
    return spiral;
  };
  
  return (
    <Container ref={containerRef}>
      <Canvas ref={canvasRef} />
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default DomainExpansion;
```

================================================================================
12. TUTORIAL SYSTEM
================================================================================

--------------------------------------------------------------------------------
12.1 Tutorial Data Structure
--------------------------------------------------------------------------------

File: src/data/shadow-garden/tutorialSteps.js

```javascript
export const tutorialSteps = [
  {
    id: 'welcome',
    type: 'modal',
    title: 'Welcome, Hunter Faith!',
    content: `You've been chosen to embark on a legendary quest through the Shadow Garden. Match sacred symbols, unlock legendary powers, and defeat the forces that stand between you and the Heart Domain.`,
    showAvatar: true,
    buttons: ['Let\'s Go!']
  },
  
  {
    id: 'board-intro',
    type: 'tooltip',
    target: '#game-board',
    position: 'center',
    title: 'The Match-3 Board',
    content: 'Swap adjacent symbols to match 3 or more of the same kind. Create combos by triggering chain reactions!',
    highlight: true,
    buttons: ['Next']
  },
  
  {
    id: 'first-match',
    type: 'interactive',
    requirement: 'make_match',
    title: 'Make Your First Match',
    content: 'Try it! Tap two adjacent symbols to swap them and create a match of 3 or more.',
    highlight: true,
    waitForAction: true
  },
  
  {
    id: 'special-pieces',
    type: 'tooltip',
    target: null,
    position: 'center',
    title: 'Special Pieces',
    content: `Match 4 symbols to create a Striker piece that clears an entire row or column!
    
Match 5 in a line to create a Monarch piece that clears all of one color!`,
    buttons: ['Got it!']
  },
  
  {
    id: 'power-ups',
    type: 'tooltip',
    target: '#power-up-bar',
    position: 'left',
    title: 'Legendary Powers',
    content: 'You start with Six Eyes and Shadow Army. Tap these icons to unleash devastating abilities! More powers unlock as you progress.',
    highlight: true,
    buttons: ['Show me!']
  },
  
  {
    id: 'use-power',
    type: 'interactive',
    requirement: 'use_power',
    title: 'Use a Power-Up',
    content: 'Try activating one of your starting powers! Tap the Six Eyes or Shadow Army icon.',
    highlight: true,
    waitForAction: true
  },
  
  {
    id: 'boss',
    type: 'tooltip',
    target: '#boss-bar',
    position: 'bottom',
    title: 'Defeat the Boss',
    content: 'Each level has a boss protecting it. Make matches to damage the boss and reach your score goal!',
    highlight: true,
    buttons: ['Understood']
  },
  
  {
    id: 'doll-box',
    type: 'tooltip',
    target: '#doll-box-button',
    position: 'left',
    title: 'Mystery Doll Box',
    content: 'Once per level, you can request a mystery gift! It might give you a power-up refill, a temporary new power, or Alvin\'s Blessing.',
    highlight: true,
    buttons: ['Nice!']
  },
  
  {
    id: 'tutorial-complete',
    type: 'modal',
    title: 'You\'re Ready!',
    content: `You now know the basics! Remember:
    
✨ Match symbols to defeat bosses
⚡ Use legendary powers strategically
🎁 Request the Mystery Doll Box when needed
💖 Fill the Love Meter in the final level

Good luck, Hunter Faith! The Shadow Garden awaits.`,
    showAvatar: true,
    buttons: ['Begin My Quest!']
  }
];
```

--------------------------------------------------------------------------------
12.2 Tutorial Overlay Component
--------------------------------------------------------------------------------

File: src/components/shadow-garden/tutorial/TutorialOverlay.jsx

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import gsap from 'gsap';
import { completeTutorial, completeTutorialStep } from '../../../store/slices/shadowGardenSlice';
import { tutorialSteps } from '../../../data/shadow-garden/tutorialSteps';
import Tooltip from './Tooltip';

const TutorialOverlay = ({ onComplete }) => {
  const dispatch = useDispatch();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [waitingForAction, setWaitingForAction] = useState(false);
  
  const currentStep = tutorialSteps[currentStepIndex];
  
  useEffect(() => {
    // Highlight target element if specified
    if (currentStep.highlight && currentStep.target) {
      highlightElement(currentStep.target);
    }
    
    // Set up action listener for interactive steps
    if (currentStep.type === 'interactive') {
      setWaitingForAction(true);
      setupActionListener(currentStep.requirement);
    }
  }, [currentStepIndex]);
  
  const highlightElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      // Create highlight overlay
      const highlight = document.createElement('div');
      highlight.id = 'tutorial-highlight';
      highlight.style.cssText = `
        position: fixed;
        border: 3px solid #FFD700;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        pointer-events: none;
        z-index: 1000;
      `;
      
      const rect = element.getBoundingClientRect();
      highlight.style.left = `${rect.left - 5}px`;
      highlight.style.top = `${rect.top - 5}px`;
      highlight.style.width = `${rect.width + 10}px`;
      highlight.style.height = `${rect.height + 10}px`;
      
      document.body.appendChild(highlight);
      
      // Pulse animation
      gsap.to(highlight, {
        boxShadow: '0 0 40px rgba(255, 215, 0, 1)',
        duration: 0.5,
        yoyo: true,
        repeat: -1
      });
    }
  };
  
  const removeHighlight = () => {
    const highlight = document.getElementById('tutorial-highlight');
    if (highlight) {
      gsap.to(highlight, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => highlight.remove()
      });
    }
  };
  
  const setupActionListener = (requirement) => {
    // Set up event listener based on requirement
    const handler = (e) => {
      if (requirement === 'make_match' && e.detail?.type === 'match') {
        handleActionCompleted();
      } else if (requirement === 'use_power' && e.detail?.type === 'power_used') {
        handleActionCompleted();
      }
    };
    
    window.addEventListener('tutorial-action', handler);
    
    return () => window.removeEventListener('tutorial-action', handler);
  };
  
  const handleActionCompleted = () => {
    setWaitingForAction(false);
    setTimeout(() => handleNext(), 500);
  };
  
  const handleNext = () => {
    removeHighlight();
    dispatch(completeTutorialStep());
    
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Tutorial complete
      dispatch(completeTutorial());
      onComplete();
    }
  };
  
  const handleSkip = () => {
    removeHighlight();
    dispatch(completeTutorial());
    onComplete();
  };
  
  if (currentStep.type === 'modal') {
    return (
      <ModalOverlay>
        <ModalContent>
          {currentStep.showAvatar && (
            <Avatar src="/assets/shadow-garden/characters/faith-avatar.svg" />
          )}
          <Title>{currentStep.title}</Title>
          <Content>{currentStep.content}</Content>
          <ButtonContainer>
            {currentStep.buttons.map((btnText, i) => (
              <Button key={i} onClick={handleNext}>
                {btnText}
              </Button>
            ))}
          </ButtonContainer>
          {currentStepIndex > 0 && (
            <SkipButton onClick={handleSkip}>Skip Tutorial</SkipButton>
          )}
        </ModalContent>
      </ModalOverlay>
    );
  }
  
  if (currentStep.type === 'tooltip') {
    return (
      <>
        <DimOverlay />
        <Tooltip
          target={currentStep.target}
          position={currentStep.position}
          title={currentStep.title}
          content={currentStep.content}
          buttons={currentStep.buttons}
          onButtonClick={handleNext}
          onSkip={handleSkip}
        />
      </>
    );
  }
  
  if (currentStep.type === 'interactive') {
    return (
      <>
        <DimOverlay />
        <Tooltip
          target={currentStep.target}
          position={currentStep.position}
          title={currentStep.title}
          content={currentStep.content}
          waiting={waitingForAction}
          onSkip={handleSkip}
        />
      </>
    );
  }
  
  return null;
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #191970 0%, #7B2CBF 100%);
  border: 3px solid #FFD700;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  text-align: center;
  animation: slideUp 0.5s ease-out;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
`;

const Title = styled.h2`
  font-family: 'Bangers', cursive;
  font-size: 36px;
  color: #FFD700;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const Content = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  color: white;
  line-height: 1.6;
  margin-bottom: 30px;
  white-space: pre-line;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 15px 40px;
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
  }
`;

const SkipButton = styled.button`
  margin-top: 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const DimOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1999;
  pointer-events: none;
`;

export default TutorialOverlay;
```

