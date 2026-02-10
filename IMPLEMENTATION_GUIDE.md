# 💖 Faith & Alvin: Celestial Valentine - Complete Implementation Guide

## 🎯 Project Overview

A multi-phase, interactive Valentine's experience built with React, featuring:
- Playful "Ask" interface with escaping buttons
- Dynamic countdown with evolving background
- Fireworks celebration
- Interactive constellation puzzle
- Romantic letter reveal

**Tech Stack:**
- React 18+ with Hooks
- CSS-in-JS (styled-components) or Tailwind CSS
- Local Storage for progress persistence
- Web Audio API for sound effects
- Canvas API for fireworks and star field

---

## 📁 Project Structure

```
celestial-valentine/
├── public/
│   ├── index.html
│   ├── sounds/
│   │   ├── README.md (sound requirements)
│   │   ├── .gitkeep
│   └── fonts/
│       └── (Google Fonts loaded via CDN)
├── src/
│   ├── App.js
│   ├── index.js
│   ├── styles/
│   │   ├── GlobalStyles.js
│   │   └── animations.js
│   ├── components/
│   │   ├── Phase1_Ask.jsx
│   │   ├── Phase2_Countdown.jsx
│   │   ├── Phase3_Fireworks.jsx
│   │   ├── Phase4_Constellations.jsx
│   │   ├── Phase5_Letter.jsx
│   │   └── shared/
│   │       ├── Button.jsx
│   │       ├── Sparkles.jsx
│   │       └── SoundManager.jsx
│   ├── hooks/
│   │   ├── useSound.js
│   │   ├── useLocalStorage.js
│   │   └── useCountdown.js
│   ├── utils/
│   │   ├── dateHelpers.js
│   │   ├── constellationData.js
│   │   └── constants.js
│   └── data/
│       ├── loveNotes.js (placeholders you'll fill)
│       └── finalLetter.js (placeholder you'll fill)
```

---

## 🎨 Design System

### Color Palette
```javascript
const colors = {
  // Primary - UI & Hearts
  blushPink: '#FFB6C1',
  rosePink: '#FF69B4',
  deepRose: '#FF1493',
  valentineRed: '#E63946',
  
  // Secondary - Night Sky
  midnightBlue: '#191970',
  royalPurple: '#7B2CBF',
  twilightViolet: '#9D4EDD',
  
  // Accents
  sparkleGold: '#FFD700',
  shimmergold: '#FFA500',
  pureWhite: '#FFFFFF',
  starWhite: '#F8F9FA',
  
  // Transparency overlays
  glassOverlay: 'rgba(255, 182, 193, 0.1)',
  darkOverlay: 'rgba(0, 0, 0, 0.3)'
};
```

### Typography
```javascript
const fonts = {
  ui: "'Quicksand', sans-serif",        // Buttons, UI elements
  comic: "'Bangers', cursive",           // Popup speech bubbles
  script: "'Dancing Script', cursive"    // Constellations & letter
};

// Google Fonts import in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Bangers&family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
```

### Animation Timings
```javascript
const timing = {
  // Phase 1 - Playful/Bouncy
  buttonEscape: '0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce
  screenShake: '0.1s ease-in-out',
  
  // Phase 2-5 - Smooth/Elegant
  heartbeat: '1s ease-in-out',
  fadeIn: '0.8s ease-out',
  shimmer: '1.5s ease-in-out',
  scrollUnroll: '2s ease-out'
};
```

---

## 🔧 Phase-by-Phase Implementation

---

## ✨ PHASE 1: The Playful Gauntlet

### Component: `Phase1_Ask.jsx`

#### State Management
```javascript
const [noPosition, setNoPosition] = useState({ x: 50, y: 50 });
const [yesSize, setYesSize] = useState(1);
const [ghostTrail, setGhostTrail] = useState([]);
const [showPopup, setShowPopup] = useState(false);
const [popupText, setPopupText] = useState('');
const [shakeScreen, setShakeScreen] = useState(false);
```

#### Desktop Logic: Button Chase
```javascript
const popupMessages = [
  "HEY! Wrong way!",
  "Stop that! You know you love me!",
  "Really? REALLY?? 😤",
  "Alvin is sad now...",
  "The YES button is RIGHT THERE!",
  "You're breaking my heart! 💔",
  "Fine, I'll just move again...",
  "This is getting ridiculous 😂"
];

const handleNoHover = () => {
  // Add current position to ghost trail
  setGhostTrail(prev => [...prev, { x: noPosition.x, y: noPosition.y, id: Date.now() }]);
  
  // Generate new random position (avoiding edges)
  const newX = Math.random() * 70 + 10; // 10-80%
  const newY = Math.random() * 70 + 10;
  
  setNoPosition({ x: newX, y: newY });
  
  // Grow YES button
  setYesSize(prev => Math.min(prev + 0.15, 3)); // Max 3x size
  
  playSound('buttonEscape');
};

const handleNoClick = (e) => {
  e.preventDefault();
  
  // Show random popup
  const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];
  setPopupText(randomMessage);
  setShowPopup(true);
  
  // Shake screen
  setShakeScreen(true);
  setTimeout(() => setShakeScreen(false), 500);
  
  // Teleport button after shake
  setTimeout(() => {
    const newX = Math.random() * 70 + 10;
    const newY = Math.random() * 70 + 10;
    setNoPosition({ x: newX, y: newY });
    setShowPopup(false);
  }, 600);
  
  // Grow YES
  setYesSize(prev => Math.min(prev + 0.3, 3));
  
  playSound('screenShake');
};
```

#### Mobile Logic: Tap & Teleport
```javascript
const handleNoTouchStart = (e) => {
  e.preventDefault();
  
  // Same popup and shake logic
  const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];
  setPopupText(randomMessage);
  setShowPopup(true);
  setShakeScreen(true);
  
  // Add haptic feedback if available
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
  
  setTimeout(() => {
    setShakeScreen(false);
    const newX = Math.random() * 70 + 10;
    const newY = Math.random() * 70 + 10;
    setNoPosition({ x: newX, y: newY });
    setShowPopup(false);
  }, 600);
  
  setYesSize(prev => Math.min(prev + 0.3, 3));
  playSound('screenShake');
};
```

#### YES Button Success
```javascript
const handleYesClick = () => {
  playSound('sparkle');
  
  // Trigger glitter explosion
  setShowGlitterExplosion(true);
  
  // Dissolve NO button
  setNoButtonDissolving(true);
  
  // Wait for animation, then transition
  setTimeout(() => {
    saveProgress({ phase: 2, acceptedDate: new Date() });
    // Transition to Phase 2
  }, 2000);
};
```

#### Styling
```jsx
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  ${props => props.shake && `
    animation: shake 0.5s ease-in-out;
  `}
  
  @keyframes shake {
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
  }
`;

const YesButton = styled.button`
  padding: 20px 60px;
  font-size: ${props => 24 * props.scale}px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transform: scale(${props => props.scale});
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
  
  &:hover {
    transform: scale(${props => props.scale * 1.1});
    box-shadow: 0 15px 40px rgba(255, 215, 0, 0.6);
  }
  
  ${props => props.showGlitter && `
    animation: glitterExplosion 1s ease-out forwards;
  `}
`;

const NoButton = styled.button`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
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
  
  ${props => props.dissolving && `
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
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  padding: 25px 80px;
  font-size: 28px;
  background: rgba(230, 57, 70, 0.3);
  border-radius: 50px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: fadeOut 0.8s ease-out forwards;
  
  @keyframes fadeOut {
    to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  }
`;

const SpeechBubble = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px 40px;
  border-radius: 20px;
  font-family: 'Bangers', cursive;
  font-size: 32px;
  color: #E63946;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid white;
  }
  
  @keyframes popIn {
    0% { transform: translate(-50%, -50%) scale(0); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }
`;
```

#### Glitter/Sparkle Effect
```jsx
const Sparkles = ({ trigger }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 50 + (Math.random() - 0.5) * 30,
        rotation: Math.random() * 360,
        scale: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 1 + 0.5
      }));
      setParticles(newParticles);
    }
  }, [trigger]);
  
  return (
    <SparkleContainer>
      {particles.map(particle => (
        <Sparkle
          key={particle.id}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animationDuration: `${particle.duration}s`
          }}
        >
          ✨
        </Sparkle>
      ))}
    </SparkleContainer>
  );
};

const Sparkle = styled.div`
  position: absolute;
  font-size: 24px;
  pointer-events: none;
  animation: sparkleFloat 1s ease-out forwards;
  
  @keyframes sparkleFloat {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(
        ${Math.random() * 200 - 100}px,
        ${Math.random() * 200 - 100}px
      ) scale(0);
    }
  }
`;
```

---

## ⏳ PHASE 2: The Heartbeat (Countdown)

### Component: `Phase2_Countdown.jsx`

#### Dynamic Background Color
```javascript
const getBackgroundColor = (daysUntilValentine) => {
  const totalDays = 4; // Feb 10-14
  const progress = Math.max(0, Math.min(1, (totalDays - daysUntilValentine) / totalDays));
  
  // Color stops: Midnight Blue -> Royal Purple -> Twilight Violet -> Valentine Red
  const colors = [
    { r: 25, g: 25, b: 112 },    // Midnight Blue
    { r: 123, g: 44, b: 191 },   // Royal Purple
    { r: 157, g: 78, b: 221 },   // Twilight Violet
    { r: 230, g: 57, b: 70 }     // Valentine Red
  ];
  
  const index = progress * (colors.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const fraction = index - lower;
  
  const r = Math.round(colors[lower].r + (colors[upper].r - colors[lower].r) * fraction);
  const g = Math.round(colors[lower].g + (colors[upper].g - colors[lower].g) * fraction);
  const b = Math.round(colors[lower].b + (colors[upper].b - colors[lower].b) * fraction);
  
  return `rgb(${r}, ${g}, ${b})`;
};
```

#### Countdown Logic
```javascript
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        clearInterval(interval);
        // Trigger Phase 3
        saveProgress({ phase: 3 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);
  
  return timeLeft;
};
```

#### Pulsing Heart
```javascript
const PulsingHeart = () => {
  return (
    <HeartContainer>
      <Heart>
        <svg viewBox="0 0 100 100" width="200" height="200">
          <path
            d="M50,90 C50,90 10,60 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z"
            fill="url(#heartGradient)"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1493" />
              <stop offset="100%" stopColor="#FF69B4" />
            </linearGradient>
          </defs>
        </svg>
      </Heart>
    </HeartContainer>
  );
};

const Heart = styled.div`
  animation: heartbeat 1s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(255, 20, 147, 0.8));
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
```

#### Interactive Tease Messages
```javascript
const teaseMessages = [
  "Patience is a virtue, beautiful ❤️",
  "Good things come to those who wait...",
  "Almost there, my love 💕",
  "Just a little longer...",
  "The stars are aligning for us ✨",
  "Worth the wait, I promise 😘",
  "Every second brings us closer 💫",
  "Missing you already... ❤️"
];

const [floatingMessages, setFloatingMessages] = useState([]);

const handleScreenTap = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX || e.touches[0].clientX) - rect.left) / rect.width * 100;
  const y = ((e.clientY || e.touches[0].clientY) - rect.top) / rect.height * 100;
  
  const message = teaseMessages[Math.floor(Math.random() * teaseMessages.length)];
  
  setFloatingMessages(prev => [...prev, {
    id: Date.now(),
    x,
    y,
    text: message
  }]);
  
  // Remove after animation
  setTimeout(() => {
    setFloatingMessages(prev => prev.filter(m => m.id !== Date.now()));
  }, 3000);
  
  playSound('tap');
};

const FloatingMessage = styled.div`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  font-family: 'Dancing Script', cursive;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
  pointer-events: none;
  animation: floatAway 3s ease-out forwards;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  
  @keyframes floatAway {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(0);
    }
    10% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -150px) scale(0.5);
    }
  }
`;
```

#### Timer Display
```jsx
const TimerDisplay = ({ days, hours, minutes, seconds }) => {
  return (
    <TimerContainer>
      <TimeUnit>
        <TimeValue>{String(days).padStart(2, '0')}</TimeValue>
        <TimeLabel>Days</TimeLabel>
      </TimeUnit>
      <Separator>:</Separator>
      <TimeUnit>
        <TimeValue>{String(hours).padStart(2, '0')}</TimeValue>
        <TimeLabel>Hours</TimeLabel>
      </TimeUnit>
      <Separator>:</Separator>
      <TimeUnit>
        <TimeValue>{String(minutes).padStart(2, '0')}</TimeValue>
        <TimeLabel>Minutes</TimeLabel>
      </TimeUnit>
      <Separator>:</Separator>
      <TimeUnit>
        <TimeValue>{String(seconds).padStart(2, '0')}</TimeValue>
        <TimeLabel>Seconds</TimeLabel>
      </TimeUnit>
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 40px;
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimeValue = styled.div`
  font-family: 'Quicksand', sans-serif;
  font-size: 64px;
  font-weight: 700;
  color: #FFD700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const TimeLabel = styled.div`
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 8px;
`;

const Separator = styled.div`
  font-size: 48px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
`;
```

---

## 🎆 PHASE 3: The Big Bang (Fireworks)

### Component: `Phase3_Fireworks.jsx`

#### Canvas-based Fireworks
```javascript
const FireworksCanvas = () => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let animationId;
    
    // Firework particle class
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.gravity = 0.1;
      }
      
      update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
      }
      
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Create heart-shaped firework
    const createHeartFirework = (x, y) => {
      const particles = [];
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        
        // Heart shape parametric equation
        const heartX = 16 * Math.pow(Math.sin(angle), 3);
        const heartY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
        
        const particle = new Particle(x, y, `hsl(${Math.random() * 60 + 320}, 100%, 70%)`);
        particle.velocity.x = heartX * 0.3;
        particle.velocity.y = heartY * 0.3;
        particles.push(particle);
      }
      
      return particles;
    };
    
    let allParticles = [];
    
    // Auto-launch fireworks
    const launchInterval = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.6;
      allParticles.push(...createHeartFirework(x, y));
      playSound('firework');
    }, 800);
    
    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(25, 25, 112, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      allParticles = allParticles.filter(p => p.alpha > 0);
      
      allParticles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(launchInterval);
    };
  }, []);
  
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // User-triggered glitter burst
    const glitter = [];
    for (let i = 0; i < 30; i++) {
      const particle = new Particle(x, y, '#FFD700');
      glitter.push(particle);
    }
    
    playSound('sparkle');
  };
  
  return <Canvas ref={canvasRef} onClick={handleCanvasClick} />;
};

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
```

#### Greeting & Start Button
```jsx
const GreetingOverlay = ({ onStart }) => {
  return (
    <OverlayContainer>
      <Greeting>
        Happy Valentine's Day, Faith ❤️
      </Greeting>
      <StartButton onClick={onStart}>
        <ButtonText>START</ButtonText>
        <ButtonGlow />
      </StartButton>
    </OverlayContainer>
  );
};

const Greeting = styled.h1`
  font-family: 'Dancing Script', cursive;
  font-size: 72px;
  color: white;
  text-align: center;
  margin-bottom: 60px;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  animation: fadeInScale 2s ease-out;
  
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const StartButton = styled.button`
  position: relative;
  padding: 25px 80px;
  font-size: 32px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.6);
  animation: pulse 2s ease-in-out infinite;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 50px rgba(255, 215, 0, 0.8);
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 10px 40px rgba(255, 215, 0, 0.6);
    }
    50% {
      box-shadow: 0 10px 60px rgba(255, 215, 0, 1);
    }
  }
`;

const ButtonGlow = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  animation: rotate 3s linear infinite;
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
```

---

## ✨ PHASE 4: The Celestial Puzzle

### Component: `Phase4_Constellations.jsx`

#### Constellation Data Structure
```javascript
// utils/constellationData.js
export const constellations = [
  {
    char: 'F',
    stars: [
      { x: 20, y: 15 },
      { x: 20, y: 30 },
      { x: 20, y: 45 },
      { x: 20, y: 60 },
      { x: 35, y: 15 },
      { x: 35, y: 30 }
    ],
    connections: [[0,1], [1,2], [2,3], [0,4], [1,5]]
  },
  {
    char: 'a',
    stars: [
      { x: 45, y: 30 },
      { x: 45, y: 45 },
      { x: 45, y: 60 },
      { x: 60, y: 30 },
      { x: 60, y: 45 },
      { x: 60, y: 60 }
    ],
    connections: [[0,1], [1,2], [0,3], [1,4], [3,4], [4,5]]
  },
  // ... continue for all 12 characters in "Faith & Alvin ❤️"
  {
    char: '❤️',
    stars: [
      { x: 85, y: 25 },
      { x: 80, y: 35 },
      { x: 90, y: 35 },
      { x: 85, y: 45 }
    ],
    connections: [[0,1], [0,2], [1,3], [2,3]]
  }
];

// Generate portrait (mirrored/inverted version for puzzle)
export const generatePortrait = (constellation) => {
  // Mirror horizontally and add slight rotation
  return constellation.stars.map(star => ({
    x: 100 - star.x + (Math.random() * 10 - 5),
    y: star.y + (Math.random() * 10 - 5)
  }));
};
```

#### Star Field Generation
```javascript
const StarField = () => {
  const [backgroundStars, setBackgroundStars] = useState([]);
  
  useEffect(() => {
    // Generate 200 random stars for atmosphere
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      twinkleDelay: Math.random() * 3
    }));
    setBackgroundStars(stars);
  }, []);
  
  return (
    <StarContainer>
      {backgroundStars.map((star, i) => (
        <Star
          key={i}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.twinkleDelay}s`
          }}
        />
      ))}
    </StarContainer>
  );
};

const Star = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation: twinkle 3s ease-in-out infinite;
  
  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;
```

#### Drawing Mechanic
```javascript
const ConstellationDrawing = ({ constellation, onComplete }) => {
  const [drawnConnections, setDrawnConnections] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [connectedStars, setConnectedStars] = useState(new Set());
  
  const handleStarDragStart = (starIndex) => {
    setCurrentPath({ from: starIndex, points: [constellation.stars[starIndex]] });
    playSound('starSelect');
  };
  
  const handleDrag = (e) => {
    if (!currentPath) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX || e.touches[0].clientX) - rect.left) / rect.width * 100;
    const y = ((e.clientY || e.touches[0].clientY) - rect.top) / rect.height * 100;
    
    setCurrentPath(prev => ({
      ...prev,
      points: [...prev.points, { x, y }]
    }));
  };
  
  const handleStarDragEnd = (starIndex) => {
    if (!currentPath) return;
    
    const from = currentPath.from;
    const to = starIndex;
    
    // Check if this connection is valid
    const isValid = constellation.connections.some(
      conn => (conn[0] === from && conn[1] === to) || (conn[1] === from && conn[0] === to)
    );
    
    if (isValid && from !== to) {
      setDrawnConnections(prev => [...prev, [from, to]]);
      setConnectedStars(prev => new Set([...prev, from, to]));
      playSound('starConnect');
      
      // Check if constellation is complete
      if (drawnConnections.length + 1 === constellation.connections.length) {
        setTimeout(() => {
          onComplete(constellation.char);
        }, 500);
      }
    } else {
      playSound('error');
    }
    
    setCurrentPath(null);
  };
  
  return (
    <DrawingCanvas>
      {/* SVG for drawing lines */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* Drawn connections */}
        {drawnConnections.map(([from, to], i) => (
          <line
            key={i}
            x1={`${constellation.stars[from].x}%`}
            y1={`${constellation.stars[from].y}%`}
            x2={`${constellation.stars[to].x}%`}
            y2={`${constellation.stars[to].y}%`}
            stroke="#FFD700"
            strokeWidth="3"
            opacity="0.8"
          />
        ))}
        
        {/* Current drawing path */}
        {currentPath && (
          <polyline
            points={currentPath.points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(255, 215, 0, 0.5)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>
      
      {/* Interactive stars */}
      {constellation.stars.map((star, i) => (
        <ConstellationStar
          key={i}
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
          connected={connectedStars.has(i)}
          onMouseDown={() => handleStarDragStart(i)}
          onMouseUp={() => handleStarDragEnd(i)}
          onTouchStart={() => handleStarDragStart(i)}
          onTouchEnd={() => handleStarDragEnd(i)}
        />
      ))}
    </DrawingCanvas>
  );
};

const ConstellationStar = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: ${props => props.connected ? '#FFD700' : 'white'};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 0 ${props => props.connected ? '15px' : '8px'} ${props => props.connected ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.6)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.3);
    box-shadow: 0 0 20px rgba(255, 215, 0, 1);
  }
`;
```

#### Portrait Guide
```jsx
const PortraitGuide = ({ portrait, constellation }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  return (
    <GuideContainer minimized={isMinimized}>
      <GuideTitle>Connect the stars to match this pattern</GuideTitle>
      <PortraitCanvas>
        <svg viewBox="0 0 100 100" width="150" height="150">
          {/* Draw portrait dots */}
          {portrait.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r="2"
              fill="rgba(255, 255, 255, 0.6)"
            />
          ))}
          
          {/* Draw connections */}
          {constellation.connections.map(([from, to], i) => (
            <line
              key={i}
              x1={portrait[from].x}
              y1={portrait[from].y}
              x2={portrait[to].x}
              y2={portrait[to].y}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </PortraitCanvas>
      <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
        {isMinimized ? '👁️' : '➖'}
      </MinimizeButton>
    </GuideContainer>
  );
};

const GuideContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: ${props => props.minimized ? '10px' : '20px'};
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 100;
`;
```

#### Love Note Popup
```javascript
// data/loveNotes.js
export const loveNotes = [
  "PLACEHOLDER_NOTE_1: Write something sweet about how she makes you feel...",
  "PLACEHOLDER_NOTE_2: Recall a favorite memory together...",
  "PLACEHOLDER_NOTE_3: Tell her what you love most about her...",
  "PLACEHOLDER_NOTE_4: Share a dream you have for your future...",
  "PLACEHOLDER_NOTE_5: Describe the moment you knew she was special...",
  "PLACEHOLDER_NOTE_6: Express gratitude for something she did...",
  "PLACEHOLDER_NOTE_7: Write about your favorite thing she does..."
];

const LoveNoteModal = ({ note, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <NoteCard onClick={(e) => e.stopPropagation()}>
        <NoteContent>{note}</NoteContent>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </NoteCard>
    </ModalOverlay>
  );
};

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
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
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
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const NoteContent = styled.p`
  font-family: 'Dancing Script', cursive;
  font-size: 28px;
  color: white;
  line-height: 1.6;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
```

#### Game Progress Display
```jsx
const ProgressBar = ({ completed, total }) => {
  return (
    <ProgressContainer>
      <ProgressText>{completed} of {total} constellations discovered</ProgressText>
      <ProgressBarOuter>
        <ProgressBarInner width={(completed / total) * 100} />
      </ProgressBarOuter>
      <CompletedPhrase>
        {completedLetters.map((letter, i) => (
          <Letter key={i} className={letter.completed ? 'completed' : ''}>
            {letter.completed ? letter.char : '★'}
          </Letter>
        ))}
      </CompletedPhrase>
    </ProgressContainer>
  );
};

const CompletedPhrase = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
  font-family: 'Dancing Script', cursive;
  font-size: 36px;
`;

const Letter = styled.span`
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.5s ease;
  
  &.completed {
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    animation: letterReveal 0.8s ease-out;
  }
  
  @keyframes letterReveal {
    0% {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.5) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
`;
```

---

## 📜 PHASE 5: The Eternal Scroll

### Component: `Phase5_Letter.jsx`

#### Scroll Unrolling Animation
```jsx
const ScrollReveal = ({ letterContent }) => {
  const [isUnrolling, setIsUnrolling] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    playSound('scroll');
    
    // Unroll animation duration
    setTimeout(() => {
      setIsUnrolling(false);
      setShowContent(true);
    }, 2000);
  }, []);
  
  return (
    <ScrollContainer>
      <ParchmentScroll unrolling={isUnrolling}>
        <ScrollTop />
        <ScrollBody>
          {showContent && <MagicWriting content={letterContent} />}
        </ScrollBody>
        <ScrollBottom />
      </ParchmentScroll>
    </ScrollContainer>
  );
};

const ParchmentScroll = styled.div`
  width: 90%;
  max-width: 800px;
  background: linear-gradient(180deg, #F4E8D0 0%, #E8D7B8 100%);
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  animation: ${props => props.unrolling ? 'unroll 2s ease-out forwards' : 'none'};
  
  @keyframes unroll {
    0% {
      max-height: 0;
      transform: scaleY(0);
      transform-origin: top;
    }
    100% {
      max-height: 2000px;
      transform: scaleY(1);
    }
  }
`;

const ScrollTop = styled.div`
  width: 100%;
  height: 40px;
  background: linear-gradient(180deg, #8B4513 0%, #A0522D 100%);
  border-radius: 10px 10px 0 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 10px;
    background: #654321;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
  }
`;

const ScrollBody = styled.div`
  padding: 60px 40px;
  min-height: 400px;
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const ScrollBottom = styled(ScrollTop)`
  border-radius: 0 0 10px 10px;
`;
```

#### Magic Writing Effect
```jsx
const MagicWriting = ({ content }) => {
  const [visibleSentences, setVisibleSentences] = useState([]);
  const sentences = content.split('. ').filter(s => s.trim());
  
  useEffect(() => {
    sentences.forEach((sentence, index) => {
      setTimeout(() => {
        setVisibleSentences(prev => [...prev, sentence]);
        playSound('shimmer');
      }, index * 1500);
    });
  }, []);
  
  return (
    <LetterContent>
      {visibleSentences.map((sentence, i) => (
        <Sentence key={i}>
          {sentence}.
        </Sentence>
      ))}
    </LetterContent>
  );
};

const LetterContent = styled.div`
  font-family: 'Dancing Script', cursive;
  font-size: 24px;
  line-height: 1.8;
  color: #2C1810;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Sentence = styled.p`
  margin-bottom: 20px;
  animation: shimmerIn 1.5s ease-out;
  
  @keyframes shimmerIn {
    0% {
      opacity: 0;
      background: linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%);
      background-size: 200% 100%;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
    50% {
      background-position: -200% 0;
    }
    100% {
      opacity: 1;
      color: #2C1810;
    }
  }
`;
```

#### Action Buttons
```jsx
const ActionButtons = ({ onPlayAgain, onScreenshot }) => {
  return (
    <ButtonContainer>
      <ActionButton onClick={onPlayAgain} color="primary">
        Play Again ✨
      </ActionButton>
      <ActionButton onClick={onScreenshot} color="secondary">
        Screenshot My Love 📸
      </ActionButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
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
  
  ${props => props.color === 'primary' ? `
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
`;
```

#### Screenshot Functionality
```javascript
const handleScreenshot = async () => {
  try {
    const element = document.getElementById('scroll-container');
    const canvas = await html2canvas(element, {
      backgroundColor: '#191970',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = 'faith-alvin-valentine.png';
    link.href = canvas.toDataURL();
    link.click();
    
    playSound('success');
  } catch (error) {
    console.error('Screenshot failed:', error);
  }
};
```

---

## 🔊 Sound Management System

### Component: `SoundManager.jsx`

```javascript
class SoundManager {
  constructor() {
    this.sounds = {};
    this.backgroundMusic = null;
    this.isMuted = false;
  }
  
  loadSound(name, path) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    this.sounds[name] = audio;
  }
  
  play(name, loop = false) {
    if (this.isMuted) return;
    
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.loop = loop;
      sound.play().catch(e => console.log('Sound play failed:', e));
    }
  }
  
  playBackground(path, volume = 0.3) {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
    
    this.backgroundMusic = new Audio(path);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = volume;
    
    if (!this.isMuted) {
      this.backgroundMusic.play().catch(e => console.log('Background music failed:', e));
    }
  }
  
  stopBackground() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      Object.values(this.sounds).forEach(sound => sound.pause());
      if (this.backgroundMusic) this.backgroundMusic.pause();
    } else {
      if (this.backgroundMusic) this.backgroundMusic.play();
    }
  }
}

export const soundManager = new SoundManager();

// Hook for easy access
export const useSound = () => {
  const play = (name) => soundManager.play(name);
  return { play };
};
```

### Sound Files Required (public/sounds/README.md)

```markdown
# Sound Files Guide

Place the following sound files in this directory:

## Required Files:

1. **buttonEscape.mp3**
   - Type: Short, playful "whoosh" or "zip" sound
   - Duration: ~0.3s
   - Use: When NO button escapes

2. **screenShake.mp3**
   - Type: Comic "crash" or "bonk" sound
   - Duration: ~0.5s
   - Use: When NO button is clicked

3. **sparkle.mp3**
   - Type: Magical chime or twinkle
   - Duration: ~1s
   - Use: YES button success, glitter effects

4. **tap.mp3**
   - Type: Soft "tap" or "plop"
   - Duration: ~0.2s
   - Use: Screen taps during countdown

5. **firework.mp3**
   - Type: Firework explosion
   - Duration: ~2s
   - Use: Fireworks launch

6. **starSelect.mp3**
   - Type: Gentle "ding" or celestial tone
   - Duration: ~0.5s
   - Use: Starting constellation draw

7. **starConnect.mp3**
   - Type: Satisfying "click" or connection sound
   - Duration: ~0.4s
   - Use: Successful star connection

8. **error.mp3**
   - Type: Soft negative tone
   - Duration: ~0.3s
   - Use: Invalid connection attempt

9. **shimmer.mp3**
   - Type: Magical shimmer/sparkle
   - Duration: ~1.5s
   - Use: Text appearing on scroll

10. **scroll.mp3**
    - Type: Parchment unrolling sound
    - Duration: ~2s
    - Use: Scroll reveal

11. **success.mp3**
    - Type: Victory chime
    - Duration: ~2s
    - Use: Constellation complete

## Background Music:

12. **background-romantic.mp3**
    - Type: Soft, romantic instrumental
    - Duration: Loopable
    - Volume: 30%
    - Use: Plays throughout entire experience

## Recommended Sources:
- Freesound.org
- Zapsplat.com
- Pixabay (audio section)
- Uppbeat.io (for background music)

## File Requirements:
- Format: MP3 or OGG
- Bitrate: 128kbps minimum
- Ensure files are properly licensed for personal use
```

---

## 💾 Local Storage & Progress Persistence

### Hook: `useLocalStorage.js`

```javascript
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
};
```

### Progress State Structure

```javascript
const gameProgress = {
  phase: 1, // Current phase (1-5)
  acceptedDate: null, // When YES was clicked
  constellationsCompleted: [], // Array of completed constellation indices
  notesViewed: [], // Array of viewed note indices
  currentConstellation: 0, // Index of current puzzle
  hasSeenFireworks: false,
  completionDate: null
};

// Save progress
const saveProgress = (updates) => {
  const current = JSON.parse(localStorage.getItem('valentine_progress') || '{}');
  const updated = { ...current, ...updates };
  localStorage.setItem('valentine_progress', JSON.stringify(updated));
};

// Load progress
const loadProgress = () => {
  return JSON.parse(localStorage.getItem('valentine_progress') || '{}');
};

// Clear progress (for Play Again)
const clearProgress = () => {
  localStorage.removeItem('valentine_progress');
};
```

---

## 🎮 Main App Logic & Phase Management

### Component: `App.js`

```javascript
import React, { useState, useEffect } from 'react';
import Phase1_Ask from './components/Phase1_Ask';
import Phase2_Countdown from './components/Phase2_Countdown';
import Phase3_Fireworks from './components/Phase3_Fireworks';
import Phase4_Constellations from './components/Phase4_Constellations';
import Phase5_Letter from './components/Phase5_Letter';
import { soundManager } from './components/shared/SoundManager';
import GlobalStyles from './styles/GlobalStyles';

const VALENTINE_DATE = new Date('2026-02-14T00:00:00');

function App() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [progress, setProgress] = useState({});
  
  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem('valentine_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setProgress(data);
      
      // Determine current phase based on saved data and date
      if (data.completionDate) {
        setCurrentPhase(5);
      } else if (data.phase === 4 && data.constellationsCompleted?.length > 0) {
        setCurrentPhase(4);
      } else if (data.acceptedDate) {
        const now = new Date();
        if (now >= VALENTINE_DATE) {
          setCurrentPhase(data.hasSeenFireworks ? 4 : 3);
        } else {
          setCurrentPhase(2);
        }
      } else {
        setCurrentPhase(1);
      }
    }
    
    // Load sounds
    soundManager.loadSound('buttonEscape', '/sounds/buttonEscape.mp3');
    soundManager.loadSound('screenShake', '/sounds/screenShake.mp3');
    soundManager.loadSound('sparkle', '/sounds/sparkle.mp3');
    soundManager.loadSound('tap', '/sounds/tap.mp3');
    soundManager.loadSound('firework', '/sounds/firework.mp3');
    soundManager.loadSound('starSelect', '/sounds/starSelect.mp3');
    soundManager.loadSound('starConnect', '/sounds/starConnect.mp3');
    soundManager.loadSound('error', '/sounds/error.mp3');
    soundManager.loadSound('shimmer', '/sounds/shimmer.mp3');
    soundManager.loadSound('scroll', '/sounds/scroll.mp3');
    soundManager.loadSound('success', '/sounds/success.mp3');
    
    // Start background music
    soundManager.playBackground('/sounds/background-romantic.mp3', 0.3);
  }, []);
  
  const updateProgress = (updates) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    localStorage.setItem('valentine_progress', JSON.stringify(newProgress));
  };
  
  const handlePhaseTransition = (nextPhase, data = {}) => {
    updateProgress({ ...data, phase: nextPhase });
    setCurrentPhase(nextPhase);
  };
  
  return (
    <>
      <GlobalStyles />
      
      {currentPhase === 1 && (
        <Phase1_Ask
          onAccept={() => handlePhaseTransition(2, { acceptedDate: new Date() })}
        />
      )}
      
      {currentPhase === 2 && (
        <Phase2_Countdown
          targetDate={VALENTINE_DATE}
          onComplete={() => handlePhaseTransition(3)}
        />
      )}
      
      {currentPhase === 3 && (
        <Phase3_Fireworks
          onStart={() => handlePhaseTransition(4, { hasSeenFireworks: true })}
        />
      )}
      
      {currentPhase === 4 && (
        <Phase4_Constellations
          progress={progress}
          onComplete={(data) => handlePhaseTransition(5, { completionDate: new Date(), ...data })}
          onProgress={updateProgress}
        />
      )}
      
      {currentPhase === 5 && (
        <Phase5_Letter
          onPlayAgain={() => {
            localStorage.removeItem('valentine_progress');
            window.location.reload();
          }}
        />
      )}
    </>
  );
}

export default App;
```

---

## 🎨 Global Styles

### File: `styles/GlobalStyles.js`

```javascript
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Quicksand', sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  /* Prevent pull-to-refresh on mobile */
  body {
    overscroll-behavior-y: contain;
  }
  
  /* Custom scrollbar for scroll phase */
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.5);
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.8);
  }
  
  /* Disable text selection on interactive elements */
  button, .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  /* Smooth transitions */
  * {
    transition-timing-function: ease-in-out;
  }
`;

export default GlobalStyles;
```

---

## 📱 Responsive Design Considerations

```javascript
// utils/constants.js
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1440px'
};

export const isMobile = () => window.innerWidth < 768;
export const isTouch = () => 'ontouchstart' in window;

// Hook for responsive behavior
export const useResponsive = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile());
  
  useEffect(() => {
    const handleResize = () => setIsMobileDevice(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { isMobile: isMobileDevice, isTouch: isTouch() };
};
```

---

## 🚀 Deployment Checklist

### Pre-deployment:
1. ✅ Fill in all love notes in `data/loveNotes.js`
2. ✅ Write final letter in `data/finalLetter.js`
3. ✅ Add all sound files to `/public/sounds/`
4. ✅ Test on actual mobile device
5. ✅ Test on different browsers (Chrome, Safari, Firefox)
6. ✅ Verify date logic with system date changes
7. ✅ Check local storage persistence
8. ✅ Optimize images and sounds for web

### Recommended Hosting:
- **Vercel** (recommended): Easy React deployment, free tier
- **Netlify**: Alternative with drag-and-drop
- **GitHub Pages**: Free but requires additional setup

### Deployment Commands (Vercel):
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🧪 Testing Scenarios

1. **Phase 1 - Ask**
   - Desktop: Hover over NO, verify movement
   - Mobile: Tap NO, verify popup and teleport
   - Click YES, verify glitter and transition

2. **Phase 2 - Countdown**
   - Set system date to Feb 10-13, verify background color changes
   - Tap screen, verify floating messages appear
   - Verify timer counts down correctly

3. **Phase 3 - Fireworks**
   - Verify auto-launching fireworks
   - Click canvas, verify user glitter bursts
   - Click START, verify transition

4. **Phase 4 - Constellations**
   - Draw incorrect connections, verify error sound
   - Complete constellation, verify transformation
   - Verify 7 random notes appear
   - Complete all 12, verify transition

5. **Phase 5 - Letter**
   - Verify scroll unrolls smoothly
   - Verify text appears with shimmer effect
   - Test screenshot functionality
   - Click Play Again, verify reset

---

## 📋 Final Implementation Timeline

**Days 1-2**: Core Setup
- Create React app
- Set up project structure
- Implement Phase 1

**Days 3-4**: Countdown & Fireworks
- Implement Phase 2
- Implement Phase 3
- Add sound system

**Days 5-6**: Game Logic
- Implement Phase 4
- Create constellation data
- Add note system

**Day 7**: Final Touch
- Implement Phase 5
- Polish animations
- Add sounds

**Days 8-9**: Testing & Content
- Write love notes
- Write final letter
- Test all phases
- Fix bugs

**Day 10**: Deploy & Share
- Final testing
- Deploy to Vercel
- Send link to Faith!

---

This is your complete blueprint. Every phase is detailed, every animation specified, every interaction mapped out. Ready to build something magical! 💖✨
