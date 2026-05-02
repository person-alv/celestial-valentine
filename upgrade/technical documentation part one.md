# 🚀 **SHADOW GARDEN: COMPLETE TECHNICAL IMPLEMENTATION DOCUMENTATION**

---

## 📋 **TABLE OF CONTENTS**

1. [Project Architecture Overview](#architecture)
2. [File Structure & Organization](#file-structure)
3. [Technology Stack & Dependencies](#tech-stack)
4. [Hub Implementation Guide](#hub-implementation)
5. [Redux Toolkit State Management](#redux-setup)
6. [Shadow Garden Game Architecture](#game-architecture)
7. [Match-3 Engine Implementation](#match3-engine)
8. [Power-Up System](#powerup-system)
9. [Audio System with Howler.js](#audio-system)
10. [Visual Assets & Styling](#visual-assets)
11. [Animation System with GSAP](#animation-system)
12. [Tutorial System](#tutorial-system)
13. [Loading Screens](#loading-screens)
14. [Performance Optimization](#performance)
15. [Debug Mode](#debug-mode)
16. [Testing Strategy](#testing)
17. [Deployment Guide](#deployment)
18. [3-Day Build Timeline](#timeline)

---

<a name="architecture"></a>
# 🏗️ **1. PROJECT ARCHITECTURE OVERVIEW**

## **High-Level Structure**

```
The Hub is the mother application that launches child games.
Each game boots independently when selected from the laptop.
Games can exit back to Hub without losing progress.
```

### **Communication Flow:**

```
Hub (Parent)
  ├─> Launches Valentine's Game (iframe/route)
  ├─> Launches Shadow Garden (iframe/route)
  └─> Future games can be added easily

Each Game:
  ├─> Has "Exit to Hub" button
  ├─> Saves progress to localStorage
  ├─> Independent audio controls
  └─> Returns to Hub on exit
```

---

<a name="file-structure"></a>
# 📁 **2. FILE STRUCTURE & ORGANIZATION**

## **Complete Directory Structure:**

```
celestial-valentine/
├── public/
│   ├── index.html
│   ├── sounds/
│   │   ├── hub/
│   │   │   ├── README.md
│   │   │   └── hub_lofi.mp3
│   │   ├── valentine/
│   │   │   └── (existing valentine sounds)
│   │   └── shadow-garden/
│   │       ├── README.md (music guide)
│   │       ├── level1_morning.mp3
│   │       ├── level2_twilight.mp3
│   │       ├── level3_cozy.mp3
│   │       ├── level4_battle.mp3
│   │       ├── level5_finale.mp3
│   │       ├── music_room_ambient.mp3
│   │       ├── sfx/
│   │       │   ├── ui_click.mp3
│   │       │   ├── ui_hover.mp3
│   │       │   ├── match3.mp3
│   │       │   ├── match4.mp3
│   │       │   ├── match5.mp3
│   │       │   ├── combo.mp3
│   │       │   ├── powerup_gojo.mp3
│   │       │   ├── powerup_jinwoo.mp3
│   │       │   ├── powerup_toji.mp3
│   │       │   ├── powerup_megumi.mp3
│   │       │   ├── powerup_anos.mp3
│   │       │   ├── powerup_meliodas.mp3
│   │       │   ├── boss_hit.mp3
│   │       │   ├── boss_defeat.mp3
│   │       │   ├── level_complete.mp3
│   │       │   ├── unlock.mp3
│   │       │   └── domain_expansion.mp3
│   │       └── music/
│   └── assets/
│       ├── hub/
│       │   ├── bedroom-background.svg
│       │   ├── laptop.svg
│       │   ├── desk-lamp.svg
│       │   └── posters/
│       ├── valentine/
│       │   └── (existing assets)
│       └── shadow-garden/
│           ├── backgrounds/
│           │   ├── level1-bg.svg
│           │   ├── level2-bg.svg
│           │   ├── level3-bg.svg
│           │   ├── level4-bg.svg
│           │   └── level5-bg.svg
│           ├── tiles/
│           │   ├── cherry-blossom.svg
│           │   ├── shadow-orb.svg
│           │   ├── six-eyes.svg
│           │   ├── music-note.svg
│           │   ├── black-heart.svg
│           │   └── star-fragment.svg
│           ├── characters/
│           │   ├── faith-avatar.svg
│           │   ├── faith-happy.svg
│           │   ├── faith-excited.svg
│           │   ├── faith-love.svg
│           │   ├── faith-determined.svg
│           │   └── faith-victory.svg
│           ├── bosses/
│           │   ├── hesitation.svg
│           │   ├── silence.svg
│           │   ├── loneliness.svg
│           │   ├── distance.svg
│           │   └── final-trial.svg
│           └── dolls/
│               ├── gojo-chibi.svg
│               ├── jinwoo-chibi.svg
│               ├── toji-chibi.svg
│               ├── megumi-chibi.svg
│               └── faith-alvin-chibi.svg
│
├── src/
│   ├── index.js
│   ├── App.js (Hub container)
│   │
│   ├── store/
│   │   ├── index.js (Redux store config)
│   │   ├── slices/
│   │   │   ├── hubSlice.js
│   │   │   ├── shadowGardenSlice.js
│   │   │   └── valentineSlice.js (minimal, just for integration)
│   │   └── middleware/
│   │       └── localStorageMiddleware.js
│   │
│   ├── routes/
│   │   ├── Hub.jsx
│   │   ├── ValentineGame.jsx (wrapper for existing game)
│   │   └── ShadowGarden.jsx (main shadow garden container)
│   │
│   ├── components/
│   │   ├── hub/
│   │   │   ├── CozyBedroom.jsx
│   │   │   ├── Laptop.jsx
│   │   │   ├── GameIcon.jsx
│   │   │   ├── Poster.jsx
│   │   │   └── BedroomElements.jsx
│   │   │
│   │   ├── valentine/
│   │   │   └── (existing Phase components - DON'T TOUCH)
│   │   │
│   │   ├── shadow-garden/
│   │   │   ├── levels/
│   │   │   │   ├── Level1.jsx
│   │   │   │   ├── Level2.jsx
│   │   │   │   ├── Level3.jsx
│   │   │   │   ├── Level4.jsx
│   │   │   │   └── Level5.jsx
│   │   │   │
│   │   │   ├── game/
│   │   │   │   ├── Board.jsx
│   │   │   │   ├── Tile.jsx
│   │   │   │   ├── SpecialPiece.jsx
│   │   │   │   ├── PowerUpBar.jsx
│   │   │   │   ├── PowerUpIcon.jsx
│   │   │   │   ├── BossBar.jsx
│   │   │   │   ├── BossAvatar.jsx
│   │   │   │   ├── LoveMeter.jsx
│   │   │   │   ├── ScoreDisplay.jsx
│   │   │   │   ├── Timer.jsx
│   │   │   │   ├── ComboDisplay.jsx
│   │   │   │   └── MysteryDollBox.jsx
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── SystemWindow.jsx
│   │   │   │   ├── LoveNoteModal.jsx
│   │   │   │   ├── VictoryScreen.jsx
│   │   │   │   ├── FailureScreen.jsx
│   │   │   │   ├── PauseMenu.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   └── CollectionGallery.jsx
│   │   │   │
│   │   │   ├── tutorial/
│   │   │   │   ├── TutorialOverlay.jsx
│   │   │   │   ├── Tooltip.jsx
│   │   │   │   └── TutorialSteps.jsx
│   │   │   │
│   │   │   ├── music-room/
│   │   │   │   ├── MusicRoom.jsx
│   │   │   │   ├── RecordPlayer.jsx
│   │   │   │   ├── PhotoGallery.jsx
│   │   │   │   ├── DollShelf.jsx
│   │   │   │   ├── ComputerDesk.jsx
│   │   │   │   └── BedroomWindow.jsx
│   │   │   │
│   │   │   └── effects/
│   │   │       ├── DomainExpansion.jsx
│   │   │       ├── PowerUpEffect.jsx
│   │   │       ├── ParticleSystem.jsx
│   │   │       └── CanvasEffect.jsx
│   │   │
│   │   └── shared/
│   │       ├── LoadingScreen.jsx
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       └── AudioControl.jsx
│   │
│   ├── hooks/
│   │   ├── useSound.js (Howler.js wrapper)
│   │   ├── useLocalStorage.js
│   │   ├── useCountdown.js
│   │   ├── useMatch3.js (match-3 game logic)
│   │   ├── usePowerUp.js
│   │   ├── useGSAP.js (GSAP animation helper)
│   │   └── useTutorial.js
│   │
│   ├── utils/
│   │   ├── match3/
│   │   │   ├── board.js
│   │   │   ├── matching.js
│   │   │   ├── cascading.js
│   │   │   └── specialPieces.js
│   │   ├── powerups/
│   │   │   ├── sixEyes.js
│   │   │   ├── shadowArmy.js
│   │   │   ├── rulersAuthority.js
│   │   │   ├── invertedSpear.js
│   │   │   ├── tenShadows.js
│   │   │   ├── magicEyes.js
│   │   │   └── fullCounter.js
│   │   ├── constants.js
│   │   ├── animations.js (GSAP presets)
│   │   └── helpers.js
│   │
│   ├── data/
│   │   ├── shadow-garden/
│   │   │   ├── levels.js
│   │   │   ├── bosses.js
│   │   │   ├── powerups.js
│   │   │   ├── tiles.js
│   │   │   ├── loveNotes.js
│   │   │   └── tutorialSteps.js
│   │   └── valentine/
│   │       └── (existing data)
│   │
│   └── styles/
│       ├── GlobalStyles.js
│       ├── hubStyles.js
│       ├── shadowGardenStyles.js
│       └── animations.js
│
├── package.json
├── README.md
├── DEBUG_MODE.md (secret debug instructions)
└── .gitignore
```

---

<a name="tech-stack"></a>
# 🛠️ **3. TECHNOLOGY STACK & DEPENDENCIES**

## **package.json Updates:**

```json
{
  "name": "celestial-valentine",
  "version": "2.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-router-dom": "^6.22.0",
    "styled-components": "^6.1.8",
    "html2canvas": "^1.4.1",
    
    "@reduxjs/toolkit": "^2.2.1",
    "react-redux": "^9.1.0",
    
    "howler": "^2.2.4",
    
    "gsap": "^3.12.5",
    
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## **Install Commands:**

```bash
npm install react-router-dom @reduxjs/toolkit react-redux howler gsap
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
```

---

<a name="hub-implementation"></a>
# 🏠 **4. HUB IMPLEMENTATION GUIDE**

## **4.1 Main App.js Structure**

```jsx
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import GlobalStyles from './styles/GlobalStyles';

import Hub from './routes/Hub';
import ValentineGame from './routes/ValentineGame';
import ShadowGarden from './routes/ShadowGarden';
import LoadingScreen from './components/shared/LoadingScreen';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/valentine" element={<ValentineGame />} />
          <Route path="/shadow-garden" element={<ShadowGarden />} />
          <Route path="/shadow-garden/music-room" element={<ShadowGarden musicRoomMode />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
```

---

## **4.2 Hub Component (Cozy Bedroom)**

```jsx
// src/routes/Hub.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Howl } from 'howler';
import CozyBedroom from '../components/hub/CozyBedroom';
import Laptop from '../components/hub/Laptop';
import LoadingScreen from '../components/shared/LoadingScreen';

const Hub = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showLaptop, setShowLaptop] = useState(false);
  const [ambientMusic, setAmbientMusic] = useState(null);

  useEffect(() => {
    // Preload hub assets
    preloadHubAssets().then(() => {
      setIsLoading(false);
      
      // Start ambient lo-fi music
      const music = new Howl({
        src: ['/sounds/hub/hub_lofi.mp3'],
        loop: true,
        volume: 0.3,
        autoplay: true
      });
      setAmbientMusic(music);
    });

    return () => {
      if (ambientMusic) ambientMusic.stop();
    };
  }, []);

  const preloadHubAssets = async () => {
    // Preload background, laptop, posters, etc.
    const images = [
      '/assets/hub/bedroom-background.svg',
      '/assets/hub/laptop.svg',
      '/assets/hub/desk-lamp.svg',
      // ... other hub assets
    ];

    await Promise.all(
      images.map(src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      }))
    );
  };

  const handleLaptopClick = () => {
    setShowLaptop(true);
  };

  const handleGameSelect = (gameRoute) => {
    // Play system chime (Solo Leveling style)
    const chime = new Howl({
      src: ['/sounds/shadow-garden/sfx/system_chime.mp3'],
      volume: 0.7
    });
    chime.play();

    // Fade out ambient music
    if (ambientMusic) {
      ambientMusic.fade(0.3, 0, 500);
    }

    // Navigate after brief delay
    setTimeout(() => {
      navigate(gameRoute);
    }, 800);
  };

  if (isLoading) {
    return <LoadingScreen type="hub" />;
  }

  return (
    <HubContainer>
      <CozyBedroom onLaptopClick={handleLaptopClick} />
      {showLaptop && (
        <Laptop 
          onGameSelect={handleGameSelect}
          onClose={() => setShowLaptop(false)}
        />
      )}
    </HubContainer>
  );
};

const HubContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

export default Hub;
```

---

## **4.3 Laptop Component (Game Selector)**

```jsx
// src/components/hub/Laptop.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import GameIcon from './GameIcon';

const Laptop = ({ onGameSelect, onClose }) => {
  const [hoveredGame, setHoveredGame] = useState(null);

  const games = [
    {
      id: 'valentine',
      title: 'Written in the Stars',
      subtitle: 'A Celestial Valentine Journey',
      icon: '/assets/hub/valentine-icon.svg',
      route: '/valentine',
      gradient: 'linear-gradient(135deg, #191970 0%, #7B2CBF 100%)',
      status: 'completed' // or 'new', 'locked'
    },
    {
      id: 'shadow-garden',
      title: 'Shadow Garden',
      subtitle: "Faith's Level-Up Quest",
      icon: '/assets/hub/shadow-garden-icon.svg',
      route: '/shadow-garden',
      gradient: 'linear-gradient(135deg, #000000 0%, #7B2CBF 100%)',
      status: 'new'
    }
  ];

  return (
    <LaptopOverlay onClick={onClose}>
      <LaptopScreen onClick={(e) => e.stopPropagation()}>
        <ScreenHeader>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ScreenHeader>
        
        <GameGrid>
          {games.map(game => (
            <GameIcon
              key={game.id}
              game={game}
              isHovered={hoveredGame === game.id}
              onHover={() => setHoveredGame(game.id)}
              onLeave={() => setHoveredGame(null)}
              onClick={() => onGameSelect(game.route)}
            />
          ))}
        </GameGrid>

        <PreviewPanel>
          {hoveredGame && (
            <PreviewText>
              {games.find(g => g.id === hoveredGame)?.subtitle}
            </PreviewText>
          )}
        </PreviewPanel>
      </LaptopScreen>
    </LaptopOverlay>
  );
};

const LaptopOverlay = styled.div`
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

const LaptopScreen = styled.div`
  width: 90%;
  max-width: 1000px;
  height: 70vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  border: 3px solid #0f3460;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
  padding: 40px;
  animation: slideUp 0.5s ease-out;
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(100px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ScreenHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
`;

const CloseButton = styled.button`
  background: #e43f5a;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 28px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff6b6b;
    transform: scale(1.1);
  }
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
`;

const PreviewPanel = styled.div`
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Quicksand', sans-serif;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
`;

const PreviewText = styled.p`
  animation: fadeIn 0.3s ease-out;
`;

export default Laptop;
```

---

## **4.4 GameIcon Component**

```jsx
// src/components/hub/GameIcon.jsx
import React from 'react';
import styled from 'styled-components';

const GameIcon = ({ game, isHovered, onHover, onLeave, onClick }) => {
  return (
    <IconContainer
      gradient={game.gradient}
      isHovered={isHovered}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <IconImage src={game.icon} alt={game.title} />
      <IconTitle>{game.title}</IconTitle>
      {game.status === 'new' && <NewBadge>NEW!</NewBadge>}
      {game.status === 'locked' && <LockedOverlay>🔒</LockedOverlay>}
      <GlowEffect isHovered={isHovered} />
    </IconContainer>
  );
};

const IconContainer = styled.div`
  position: relative;
  background: ${props => props.gradient};
  border-radius: 20px;
  padding: 40px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: ${props => props.isHovered ? 'scale(1.05) translateY(-10px)' : 'scale(1)'};
  box-shadow: ${props => props.isHovered 
    ? '0 20px 60px rgba(255, 215, 0, 0.4)' 
    : '0 10px 30px rgba(0, 0, 0, 0.3)'};
  overflow: hidden;
  
  &:active {
    transform: scale(0.98);
  }
`;

const IconImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
`;

const IconTitle = styled.h3`
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  color: white;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const NewBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #FFD700;
  color: #000;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: 'Bangers', cursive;
  font-size: 18px;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  border-radius: 20px;
`;

const GlowEffect = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  opacity: ${props => props.isHovered ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

export default GameIcon;
```

---

<a name="redux-setup"></a>
# 🔄 **5. REDUX TOOLKIT STATE MANAGEMENT**

## **5.1 Store Configuration**

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import hubReducer from './slices/hubSlice';
import shadowGardenReducer from './slices/shadowGardenSlice';
import valentineReducer from './slices/valentineSlice';
import localStorageMiddleware from './middleware/localStorageMiddleware';

const store = configureStore({
  reducer: {
    hub: hubReducer,
    shadowGarden: shadowGardenReducer,
    valentine: valentineReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware)
});

export default store;
```

---

## **5.2 Shadow Garden Slice**

```javascript
// src/store/slices/shadowGardenSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Game Progress
  currentLevel: 1,
  completedLevels: [],
  
  // Power-Ups
  unlockedPowers: [0, 1], // Start with Six Eyes & Shadow Army
  powerUsages: {
    0: 3, // Six Eyes: 3 uses
    1: 3, // Shadow Army: 3 uses
    2: 0, // Ruler's Authority
    3: 0, // Inverted Spear
    4: 0, // Ten Shadows
    5: 0, // Magic Eyes
    6: 0  // Full Counter
  },
  
  // Stats (Moderate tracking)
  stats: {
    totalScore: 0,
    totalCombos: 0,
    playTime: 0,
    startTime: null,
    powerUseCount: {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    }
  },
  
  // Unlocks
  unlockedPhotos: [],
  unlockedDolls: [],
  unlockedVoiceNotes: [],
  viewedLoveNotes: [],
  
  // Music Room
  musicRoomUnlocked: false,
  
  // Tutorial
  tutorialCompleted: false,
  tutorialStep: 0,
  
  // Settings
  musicVolume: 0.7,
  sfxVolume: 1.0,
  musicMuted: false,
  sfxMuted: false,
  
  // Current Game State
  isPlaying: false,
  isPaused: false,
  currentLevelData: null
};

const shadowGardenSlice = createSlice({
  name: 'shadowGarden',
  initialState,
  reducers: {
    // Level Management
    setCurrentLevel: (state, action) => {
      state.currentLevel = action.payload;
    },
    
    completeLevel: (state, action) => {
      const level = action.payload;
      if (!state.completedLevels.includes(level)) {
        state.completedLevels.push(level);
      }
    },
    
    // Power-Up Management
    unlockPower: (state, action) => {
      const { powerId, uses } = action.payload;
      if (!state.unlockedPowers.includes(powerId)) {
        state.unlockedPowers.push(powerId);
        state.powerUsages[powerId] = uses;
      }
    },
    
    usePower: (state, action) => {
      const powerId = action.payload;
      if (state.powerUsages[powerId] > 0) {
        state.powerUsages[powerId] -= 1;
        state.stats.powerUseCount[powerId] += 1;
      }
    },
    
    refillPower: (state, action) => {
      const { powerId, amount } = action.payload;
      state.powerUsages[powerId] += amount;
    },
    
    // Stats
    addScore: (state, action) => {
      state.stats.totalScore += action.payload;
    },
    
    incrementCombo: (state) => {
      state.stats.totalCombos += 1;
    },
    
    startPlayTimer: (state) => {
      state.stats.startTime = Date.now();
    },
    
    updatePlayTime: (state) => {
      if (state.stats.startTime) {
        state.stats.playTime += Date.now() - state.stats.startTime;
        state.stats.startTime = Date.now();
      }
    },
    
    // Unlocks
    unlockPhoto: (state, action) => {
      const photoId = action.payload;
      if (!state.unlockedPhotos.includes(photoId)) {
        state.unlockedPhotos.push(photoId);
      }
    },
    
    unlockDoll: (state, action) => {
      const dollId = action.payload;
      if (!state.unlockedDolls.includes(dollId)) {
        state.unlockedDolls.push(dollId);
      }
    },
    
    unlockVoiceNote: (state, action) => {
      const noteId = action.payload;
      if (!state.unlockedVoiceNotes.includes(noteId)) {
        state.unlockedVoiceNotes.push(noteId);
      }
    },
    
    markLoveNoteViewed: (state, action) => {
      const noteId = action.payload;
      if (!state.viewedLoveNotes.includes(noteId)) {
        state.viewedLoveNotes.push(noteId);
      }
    },
    
    unlockMusicRoom: (state) => {
      state.musicRoomUnlocked = true;
    },
    
    // Tutorial
    completeTutorialStep: (state) => {
      state.tutorialStep += 1;
    },
    
    completeTutorial: (state) => {
      state.tutorialCompleted = true;
    },
    
    resetTutorial: (state) => {
      state.tutorialCompleted = false;
      state.tutorialStep = 0;
    },
    
    // Audio Settings
    setMusicVolume: (state, action) => {
      state.musicVolume = action.payload;
    },
    
    setSfxVolume: (state, action) => {
      state.sfxVolume = action.payload;
    },
    
    toggleMusicMute: (state) => {
      state.musicMuted = !state.musicMuted;
    },
    
    toggleSfxMute: (state) => {
      state.sfxMuted = !state.sfxMuted;
    },
    
    // Game State
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    
    setPaused: (state, action) => {
      state.isPaused = action.payload;
    },
    
    // Reset (for "New Game")
    resetProgress: (state) => {
      return initialState;
    }
  }
});

export const {
  setCurrentLevel,
  completeLevel,
  unlockPower,
  usePower,
  refillPower,
  addScore,
  incrementCombo,
  startPlayTimer,
  updatePlayTime,
  unlockPhoto,
  unlockDoll,
  unlockVoiceNote,
  markLoveNoteViewed,
  unlockMusicRoom,
  completeTutorialStep,
  completeTutorial,
  resetTutorial,
  setMusicVolume,
  setSfxVolume,
  toggleMusicMute,
  toggleSfxMute,
  setPlaying,
  setPaused,
  resetProgress
} = shadowGardenSlice.actions;

export default shadowGardenSlice.reducer;
```

---

## **5.3 LocalStorage Middleware**

```javascript
// src/store/middleware/localStorageMiddleware.js

const STORAGE_KEY_PREFIX = 'celestial_valentine_';

const localStorageMiddleware = store => next => action => {
  const result = next(action);
  
  // Save to localStorage after state updates
  const state = store.getState();
  
  // Save Shadow Garden state
  if (action.type?.startsWith('shadowGarden/')) {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}shadow_garden`,
      JSON.stringify(state.shadowGarden)
    );
  }
  
  // Save Valentine state (minimal)
  if (action.type?.startsWith('valentine/')) {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}valentine`,
      JSON.stringify(state.valentine)
    );
  }
  
  return result;
};

// Load from localStorage on app start
export const loadStateFromStorage = () => {
  try {
    const shadowGardenState = localStorage.getItem(`${STORAGE_KEY_PREFIX}shadow_garden`);
    const valentineState = localStorage.getItem(`${STORAGE_KEY_PREFIX}valentine`);
    
    return {
      shadowGarden: shadowGardenState ? JSON.parse(shadowGardenState) : undefined,
      valentine: valentineState ? JSON.parse(valentineState) : undefined
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return {};
  }
};

export default localStorageMiddleware;
```

**Update store/index.js to use preloaded state:**

```javascript
// src/store/index.js
import { loadStateFromStorage } from './middleware/localStorageMiddleware';

const preloadedState = loadStateFromStorage();

const store = configureStore({
  reducer: {
    hub: hubReducer,
    shadowGarden: shadowGardenReducer,
    valentine: valentineReducer
  },
  preloadedState, // Load saved state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware)
});
```

---

<a name="game-architecture"></a>
# 🎮 **6. SHADOW GARDEN GAME ARCHITECTURE**

## **6.1 Main Shadow Garden Container**

```jsx
// src/routes/ShadowGarden.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import LoadingScreen from '../components/shared/LoadingScreen';
import Tutorial from '../components/shadow-garden/tutorial/TutorialOverlay';
import Level1 from '../components/shadow-garden/levels/Level1';
import Level2 from '../components/shadow-garden/levels/Level2';
import Level3 from '../components/shadow-garden/levels/Level3';
import Level4 from '../components/shadow-garden/levels/Level4';
import Level5 from '../components/shadow-garden/levels/Level5';
import MusicRoom from '../components/shadow-garden/music-room/MusicRoom';
import PauseMenu from '../components/shadow-garden/ui/PauseMenu';
import AudioController from '../components/shared/AudioControl';

import { setPlaying, startPlayTimer, updatePlayTime } from '../store/slices/shadowGardenSlice';
import { initializeAudio, playLevelMusic } from '../hooks/useSound';

const ShadowGarden = ({ musicRoomMode = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const currentLevel = useSelector(state => state.shadowGarden.currentLevel);
  const tutorialCompleted = useSelector(state => state.shadowGarden.tutorialCompleted);
  const musicRoomUnlocked = useSelector(state => state.shadowGarden.musicRoomUnlocked);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Preload all Shadow Garden assets
    preloadAssets().then(() => {
      setIsLoading(false);
      
      // Initialize audio system
      initializeAudio('shadow-garden');
      
      // Start play timer
      dispatch(startPlayTimer());
      dispatch(setPlaying(true));
      
      // Show tutorial if first time
      if (!tutorialCompleted) {
        setShowTutorial(true);
      }
      
      // Play level music
      playLevelMusic(currentLevel);
    });

    // Update play time on unmount
    return () => {
      dispatch(updatePlayTime());
      dispatch(setPlaying(false));
    };
  }, []);

  const preloadAssets = async () => {
    // Preload all images, sounds, etc.
    const assets = [
      // Backgrounds
      '/assets/shadow-garden/backgrounds/level1-bg.svg',
      '/assets/shadow-garden/backgrounds/level2-bg.svg',
      '/assets/shadow-garden/backgrounds/level3-bg.svg',
      '/assets/shadow-garden/backgrounds/level4-bg.svg',
      '/assets/shadow-garden/backgrounds/level5-bg.svg',
      
      // Tiles
      '/assets/shadow-garden/tiles/cherry-blossom.svg',
      '/assets/shadow-garden/tiles/shadow-orb.svg',
      '/assets/shadow-garden/tiles/six-eyes.svg',
      '/assets/shadow-garden/tiles/music-note.svg',
      '/assets/shadow-garden/tiles/black-heart.svg',
      '/assets/shadow-garden/tiles/star-fragment.svg',
      
      // Characters
      '/assets/shadow-garden/characters/faith-avatar.svg',
      // ... all other assets
    ];

    await Promise.all(
      assets.map(src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      }))
    );
  };

  const handleExitToHub = () => {
    // Confirm exit
    if (window.confirm('Exit to Hub? Progress will be saved.')) {
      dispatch(updatePlayTime());
      navigate('/');
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  if (isLoading) {
    return <LoadingScreen type="shadow-garden" />;
  }

  if (musicRoomMode && musicRoomUnlocked) {
    return <MusicRoom onExit={() => navigate('/shadow-garden')} />;
  }

  return (
    <GameContainer>
      {/* Tutorial Overlay */}
      {showTutorial && (
        <Tutorial onComplete={() => setShowTutorial(false)} />
      )}

      {/* Current Level */}
      {currentLevel === 1 && <Level1 onPause={handlePause} />}
      {currentLevel === 2 && <Level2 onPause={handlePause} />}
      {currentLevel === 3 && <Level3 onPause={handlePause} />}
      {currentLevel === 4 && <Level4 onPause={handlePause} />}
      {currentLevel === 5 && <Level5 onPause={handlePause} />}

      {/* Pause Menu */}
      {isPaused && (
        <PauseMenu 
          onResume={handleResume}
          onExitToHub={handleExitToHub}
        />
      )}

      {/* Audio Controls */}
      <AudioController game="shadow-garden" />
    </GameContainer>
  );
};

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

export default ShadowGarden;
```

---

<a name="match3-engine"></a>
# 🧩 **7. MATCH-3 ENGINE IMPLEMENTATION**

## **7.1 Core Match-3 Hook (Hybrid Approach)**

```javascript
// src/hooks/useMatch3.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addScore, incrementCombo } from '../store/slices/shadowGardenSlice';
import { 
  generateBoard, 
  findMatches, 
  removeMatches, 
  cascadePieces,
  checkForSpecialPieces
} from '../utils/match3';

const TILE_TYPES = [
  { id: 0, type: 'cherry-blossom', color: '#FFB6C1', symbol: '🌸' },
  { id: 1, type: 'shadow-orb', color: '#000000', symbol: '⚫' },
  { id: 2, type: 'six-eyes', color: '#00BFFF', symbol: '💙' },
  { id: 3, type: 'music-note', color: '#FFD700', symbol: '🎵' },
  { id: 4, type: 'black-heart', color: '#4B0082', symbol: '🖤' },
  { id: 5, type: 'star-fragment', color: '#F8F9FA', symbol: '✨' }
];

const BOARD_SIZE = 8;

export const useMatch3 = (levelConfig) => {
  const dispatch = useDispatch();
  
  const [board, setBoard] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [score, setScore] = useState(0);

  // Initialize board
  useEffect(() => {
    const initialBoard = generateBoard(BOARD_SIZE, TILE_TYPES.length);
    setBoard(initialBoard);
  }, []);

  // Handle tile selection and swap
  const handleTileClick = useCallback((row, col) => {
    if (isProcessing) return;

    if (!selectedTile) {
      // First tile selected
      setSelectedTile({ row, col });
    } else {
      // Second tile selected - attempt swap
      const isAdjacent = Math.abs(selectedTile.row - row) + Math.abs(selectedTile.col - col) === 1;
      
      if (isAdjacent) {
        attemptSwap(selectedTile, { row, col });
      }
      
      setSelectedTile(null);
    }
  }, [selectedTile, isProcessing, board]);

  // Swap two tiles
  const attemptSwap = useCallback(async (tile1, tile2) => {
    setIsProcessing(true);

    // Create swapped board
    const newBoard = [...board];
    [newBoard[tile1.row][tile1.col], newBoard[tile2.row][tile2.col]] = 
    [newBoard[tile2.row][tile2.col], newBoard[tile1.row][tile1.col]];
    
    // Check if swap creates matches
    const matches = findMatches(newBoard);
    
    if (matches.length > 0) {
      // Valid swap
      setBoard(newBoard);
      await processMatches(newBoard, matches);
    } else {
      // Invalid swap - swap back
      setIsProcessing(false);
    }
  }, [board]);

  // Process matches and cascades
  const processMatches = useCallback(async (currentBoard, matches, currentCombo = 0) => {
    // Remove matched tiles
    const boardAfterRemoval = removeMatches(currentBoard, matches);
    
    // Calculate score
    const points = calculatePoints(matches, currentCombo);
    setScore(prev => prev + points);
    dispatch(addScore(points));
    
    // Check for special pieces (match 4, match 5, etc.)
    const specialPieces = checkForSpecialPieces(matches);
    boardAfterRemoval.specialPieces = [...(boardAfterRemoval.specialPieces || []), ...specialPieces];
    
    // Animate removal (wait for animation)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setBoard(boardAfterRemoval);
    
    // Cascade pieces down
    const boardAfterCascade = await cascadePieces(boardAfterRemoval, TILE_TYPES.length);
    
    // Animate cascade (wait for animation)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setBoard(boardAfterCascade);
    
    // Check for new matches (combos)
    const newMatches = findMatches(boardAfterCascade);
    
    if (newMatches.length > 0) {
      // Combo! Recursive call
      const newCombo = currentCombo + 1;
      setComboCount(newCombo);
      dispatch(incrementCombo());
      
      await processMatches(boardAfterCascade, newMatches, newCombo);
    } else {
      // No more matches - reset combo and processing
      setComboCount(0);
      setIsProcessing(false);
    }
  }, [dispatch]);

  // Calculate points based on match size and combo
  const calculatePoints = (matches, combo) => {
    let basePoints = 0;
    
    matches.forEach(match => {
      if (match.length === 3) basePoints += 100;
      else if (match.length === 4) basePoints += 300;
      else if (match.length >= 5) basePoints += 500;
    });
    
    // Combo multiplier
    const multiplier = 1 + (combo * 0.5);
    
    return Math.floor(basePoints * multiplier);
  };

  // Activate special piece
  const activateSpecialPiece = useCallback((row, col, type) => {
    // Implementation depends on special piece type
    // This will call specific power-up handlers
  }, [board]);

  return {
    board,
    selectedTile,
    isProcessing,
    comboCount,
    score,
    handleTileClick,
    activateSpecialPiece
  };
};
```

---

## **7.2 Match-3 Utility Functions**

```javascript
// src/utils/match3/board.js

export const generateBoard = (size, tileTypeCount) => {
  const board = [];
  
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      // Generate random tile, ensuring no immediate matches
      let tileType;
      do {
        tileType = Math.floor(Math.random() * tileTypeCount);
      } while (
        (col >= 2 && board[row][col-1] === tileType && board[row][col-2] === tileType) ||
        (row >= 2 && board[row-1][col] === tileType && board[row-2][col] === tileType)
      );
      
      board[row][col] = {
        type: tileType,
        isSpecial: false,
        specialType: null
      };
    }
  }
  
  return board;
};
```

```javascript
// src/utils/match3/matching.js

export const findMatches = (board) => {
  const matches = [];
  const size = board.length;
  
  // Check horizontal matches
  for (let row = 0; row < size; row++) {
    let matchStart = 0;
    for (let col = 1; col < size; col++) {
      if (board[row][col].type !== board[row][col-1].type) {
        if (col - matchStart >= 3) {
          matches.push(createMatch(row, matchStart, row, col - 1, 'horizontal'));
        }
        matchStart = col;
      }
    }
    if (size - matchStart >= 3) {
      matches.push(createMatch(row, matchStart, row, size - 1, 'horizontal'));
    }
  }
  
  // Check vertical matches
  for (let col = 0; col < size; col++) {
    let matchStart = 0;
    for (let row = 1; row < size; row++) {
      if (board[row][col].type !== board[row-1][col].type) {
        if (row - matchStart >= 3) {
          matches.push(createMatch(matchStart, col, row - 1, col, 'vertical'));
        }
        matchStart = row;
      }
    }
    if (size - matchStart >= 3) {
      matches.push(createMatch(matchStart, col, size - 1, col, 'vertical'));
    }
  }
  
  return matches.filter(match => match !== null);
};

const createMatch = (startRow, startCol, endRow, endCol, direction) => {
  const tiles = [];
  
  if (direction === 'horizontal') {
    for (let col = startCol; col <= endCol; col++) {
      tiles.push({ row: startRow, col });
    }
  } else {
    for (let row = startRow; row <= endRow; row++) {
      tiles.push({ row, col: startCol });
    }
  }
  
  return tiles.length >= 3 ? tiles : null;
};

export const removeMatches = (board, matches) => {
  const newBoard = JSON.parse(JSON.stringify(board)); // Deep clone
  
  matches.forEach(match => {
    match.forEach(tile => {
      newBoard[tile.row][tile.col] = null;
    });
  });
  
  return newBoard;
};
```

```javascript
// src/utils/match3/cascading.js

export const cascadePieces = async (board, tileTypeCount) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  const size = board.length;
  
  // Drop existing pieces
  for (let col = 0; col < size; col++) {
    let writeRow = size - 1;
    
    for (let row = size - 1; row >= 0; row--) {
      if (newBoard[row][col] !== null) {
        if (row !== writeRow) {
          newBoard[writeRow][col] = newBoard[row][col];
          newBoard[row][col] = null;
        }
        writeRow--;
      }
    }
    
    // Fill empty spaces from top
    for (let row = writeRow; row >= 0; row--) {
      newBoard[row][col] = {
        type: Math.floor(Math.random() * tileTypeCount),
        isSpecial: false,
        specialType: null
      };
    }
  }
  
  return newBoard;
};
```

```javascript
// src/utils/match3/specialPieces.js

export const checkForSpecialPieces = (matches) => {
  const specialPieces = [];
  
  matches.forEach(match => {
    if (match.length === 4) {
      // Create Striker Piece
      const centerTile = match[Math.floor(match.length / 2)];
      specialPieces.push({
        row: centerTile.row,
        col: centerTile.col,
        type: 'striker',
        direction: determineDirection(match)
      });
    } else if (match.length === 5) {
      // Check if L or T shape
      const isLorT = checkLorTShape(match);
      
      if (isLorT) {
        // Create Domain Piece
        const centerTile = findCenter(match);
        specialPieces.push({
          row: centerTile.row,
          col: centerTile.col,
          type: 'domain'
        });
      } else {
        // Straight line of 5 - Create Monarch Piece
        const centerTile = match[Math.floor(match.length / 2)];
        specialPieces.push({
          row: centerTile.row,
          col: centerTile.col,
          type: 'monarch'
        });
      }
    }
  });
  
  return specialPieces;
};

const determineDirection = (match) => {
  // Check if horizontal or vertical
  return match[0].row === match[1].row ? 'horizontal' : 'vertical';
};

const checkLorTShape = (match) => {
  // Implementation to detect L or T shapes
  // Returns true if match forms L or T
  // For simplicity, this is a placeholder
  return false;
};

const findCenter = (match) => {
  // Find the center tile of the match
  return match[Math.floor(match.length / 2)];
};
```

---

<a name="powerup-system"></a>
# ⚡ **8. POWER-UP SYSTEM**

## **8.1 Power-Up Hook**

```javascript
// src/hooks/usePowerUp.js
import { useDispatch, useSelector } from 'react-redux';
import { usePower, refillPower } from '../store/slices/shadowGardenSlice';
import { playSound } from './useSound';
import gsap from 'gsap';

// Import individual power-up effects
import { activateSixEyes } from '../utils/powerups/sixEyes';
import { activateShadowArmy } from '../utils/powerups/shadowArmy';
import { activateRulersAuthority } from '../utils/powerups/rulersAuthority';
import { activateInvertedSpear } from '../utils/powerups/invertedSpear';
import { activateTenShadows } from '../utils/powerups/tenShadows';
import { activateMagicEyes } from '../utils/powerups/magicEyes';
import { activateFullCounter } from '../utils/powerups/fullCounter';

export const usePowerUp = (board, setBoard, setScore) => {
  const dispatch = useDispatch();
  
  const powerUsages = useSelector(state => state.shadowGarden.powerUsages);
  const unlockedPowers = useSelector(state => state.shadowGarden.unlockedPowers);

  const activatePower = async (powerId, targetData = null) => {
    // Check if power is available
    if (!unlockedPowers.includes(powerId) || powerUsages[powerId] <= 0) {
      return;
    }

    // Dispatch usage
    dispatch(usePower(powerId));

    // Play power-specific sound
    playSound(`powerup_${getPowerName(powerId)}`);

    // Execute power effect based on ID
    switch(powerId) {
      case 0: // Six Eyes
        await activateSixEyes(board, setBoard, setScore, targetData);
        break;
      case 1: // Shadow Army
        await activateShadowArmy(board, setBoard, setScore);
        break;
      case 2: // Ruler's Authority
        await activateRulersAuthority(board, setBoard, targetData);
        break;
      case 3: // Inverted Spear
        await activateInvertedSpear(board, setBoard, setScore, targetData);
        break;
      case 4: // Ten Shadows
        await activateTenShadows(setScore);
        break;
      case 5: // Magic Eyes
        await activateMagicEyes(board, setBoard, setScore);
        break;
      case 6: // Full Counter
        await activateFullCounter(board, setBoard, setScore, targetData);
        break;
      default:
        break;
    }
  };

  const getPowerName = (powerId) => {
    const names = ['gojo', 'jinwoo', 'jinwoo', 'toji', 'megumi', 'anos', 'meliodas'];
    return names[powerId];
  };

  return { activatePower, powerUsages, unlockedPowers };
};
```

---

## **8.2 Individual Power-Up Implementations**

### **Six Eyes (State-Based)**

```javascript
// src/utils/powerups/sixEyes.js
import gsap from 'gsap';

export const activateSixEyes = async (board, setBoard, setScore, targetData) => {
  // Effect: Clear entire horizontal row
  
  const row = targetData?.row || Math.floor(Math.random() * board.length);
  
  // Visual: Blue flash effect
  const boardElement = document.getElementById('game-board');
  gsap.to(boardElement, {
    backgroundColor: '#00BFFF',
    duration: 0.1,
    yoyo: true,
    repeat: 1
  });
  
  // Animate tiles disappearing with blue explosion
  const tilesToRemove = [];
  for (let col = 0; col < board[row].length; col++) {
    tilesToRemove.push({ row, col });
    
    const tileElement = document.getElementById(`tile-${row}-${col}`);
    if (tileElement) {
      gsap.to(tileElement, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Create infinity symbol particle effect
          createInfinityParticles(tileElement.getBoundingClientRect());
        }
      });
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Update board
  const newBoard = [...board];
  for (let col = 0; col < newBoard[row].length; col++) {
    newBoard[row][col] = null;
  }
  setBoard(newBoard);
  
  // Calculate score (100 points per tile)
  const points = tilesToRemove.length * 100;
  setScore(prev => prev + points);
  
  // Cascade will happen automatically in main game loop
};

const createInfinityParticles = (rect) => {
  // Create visual infinity symbol particles
  // Implementation using canvas or DOM elements
};
```

### **Shadow Army (State-Based)**

```javascript
// src/utils/powerups/shadowArmy.js
import gsap from 'gsap';

export const activateShadowArmy = async (board, setBoard, setScore) => {
  // Effect: Summon shadows that destroy 8-12 random pieces
  
  // Darken screen
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100;
    pointer-events: none;
  `;
  document.body.appendChild(overlay);
  
  gsap.fromTo(overlay, 
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
  
  // Select 8-12 random tiles
  const shadowCount = Math.floor(Math.random() * 5) + 8; // 8-12
  const tilesToRemove = [];
  
  while (tilesToRemove.length < shadowCount) {
    const row = Math.floor(Math.random() * board.length);
    const col = Math.floor(Math.random() * board[0].length);
    
    if (!tilesToRemove.some(t => t.row === row && t.col === col) && board[row][col]) {
      tilesToRemove.push({ row, col });
    }
  }
  
  // Animate shadow wisps attacking each tile
  for (const tile of tilesToRemove) {
    const tileElement = document.getElementById(`tile-${tile.row}-${tile.col}`);
    if (tileElement) {
      // Create shadow wisp animation
      createShadowWisp(tileElement);
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Stagger attacks
      
      gsap.to(tileElement, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        filter: 'blur(5px)'
      });
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Remove overlay
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => overlay.remove()
  });
  
  // Update board
  const newBoard = [...board];
  tilesToRemove.forEach(tile => {
    newBoard[tile.row][tile.col] = null;
  });
  setBoard(newBoard);
  
  // Score
  const points = tilesToRemove.length * 150;
  setScore(prev => prev + points);
};

const createShadowWisp = (targetElement) => {
  // Create visual shadow wisp that travels to target
  const wisp = document.createElement('div');
  wisp.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, #9D4EDD 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 101;
  `;
  document.body.appendChild(wisp);
  
  const targetRect = targetElement.getBoundingClientRect();
  
  gsap.fromTo(wisp,
    { 
      x: window.innerWidth / 2,
      y: window.innerHeight,
      opacity: 0
    },
    {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => wisp.remove()
    }
  );
};
```

### **Ruler's Authority (Fully Interactive)**

```javascript
// src/utils/powerups/rulersAuthority.js
import gsap from 'gsap';

export const activateRulersAuthority = async (board, setBoard, targetData) => {
  // Effect: Freeze time, swap ANY two pieces
  // This requires user to select two tiles (handled by game component)
  
  if (!targetData || !targetData.tile1 || !targetData.tile2) {
    console.error('Ruler\'s Authority requires two tiles selected');
    return;
  }
  
  const { tile1, tile2 } = targetData;
  
  // Freeze time visual effect
  const freezeOverlay = document.createElement('div');
  freezeOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(123, 44, 191, 0.5) 0%, rgba(157, 78, 221, 0.5) 100%);
    z-index: 100;
    pointer-events: none;
  `;
  document.body.appendChild(freezeOverlay);
  
  // Apply grayscale to everything except selected tiles
  const gameBoard = document.getElementById('game-board');
  gsap.to(gameBoard, {
    filter: 'grayscale(100%)',
    duration: 0.3
  });
  
  // Highlight selected tiles
  const tile1Element = document.getElementById(`tile-${tile1.row}-${tile1.col}`);
  const tile2Element = document.getElementById(`tile-${tile2.row}-${tile2.col}`);
  
  gsap.to([tile1Element, tile2Element], {
    filter: 'grayscale(0%) brightness(150%)',
    scale: 1.2,
    duration: 0.3
  });
  
  // Purple hand appears
  createRulersHand(freezeOverlay);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Perform swap
  const newBoard = [...board];
  [newBoard[tile1.row][tile1.col], newBoard[tile2.row][tile2.col]] = 
  [newBoard[tile2.row][tile2.col], newBoard[tile1.row][tile1.col]];
  
  setBoard(newBoard);
  
  // Animate swap
  const tile1Rect = tile1Element.getBoundingClientRect();
  const tile2Rect = tile2Element.getBoundingClientRect();
  
  gsap.to(tile1Element, {
    x: tile2Rect.left - tile1Rect.left,
    y: tile2Rect.top - tile1Rect.top,
    duration: 0.5,
    ease: 'power2.inOut'
  });
  
  gsap.to(tile2Element, {
    x: tile1Rect.left - tile2Rect.left,
    y: tile1Rect.top - tile2Rect.top,
    duration: 0.5,
    ease: 'power2.inOut'
  });
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Unfreeze time
  gsap.to(gameBoard, {
    filter: 'grayscale(0%)',
    duration: 0.3
  });
  
  gsap.to(freezeOverlay, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => freezeOverlay.remove()
  });
  
  // Match checking happens in main game loop
};

const createRulersHand = (container) => {
  const hand = document.createElement('div');
  hand.style.cssText = `
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 120px;
    opacity: 0.7;
  `;
  hand.textContent = '✋';
  container.appendChild(hand);
  
  gsap.fromTo(hand,
    { y: -200, opacity: 0 },
    { y: 100, opacity: 0.7, duration: 1, ease: 'power2.out' }
  );
};
```

### **Inverted Spear (Interactive Targeting)**

```javascript
// src/utils/powerups/invertedSpear.js
import gsap from 'gsap';

export const activateInvertedSpear = async (board, setBoard, setScore, targetData) => {
  // Effect: Select one color, destroy ALL of that color
  
  if (!targetData || targetData.colorType === undefined) {
    console.error('Inverted Spear requires color selection');
    return;
  }
  
  const colorType = targetData.colorType;
  
  // Find all tiles of that color
  const tilesToRemove = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] && board[row][col].type === colorType) {
        tilesToRemove.push({ row, col });
      }
    }
  }
  
  // Visual: Green spear pierces from top
  const spear = document.createElement('div');
  spear.style.cssText = `
    position: fixed;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 100vh;
    background: linear-gradient(180deg, #00FF00 0%, transparent 100%);
    z-index: 102;
    pointer-events: none;
  `;
  document.body.appendChild(spear);
  
  gsap.to(spear, {
    y: window.innerHeight + 200,
    duration: 0.8,
    ease: 'power2.in',
    onComplete: () => spear.remove()
  });
  
  // Animate destruction of all tiles of that color
  for (const tile of tilesToRemove) {
    const tileElement = document.getElementById(`tile-${tile.row}-${tile.col}`);
    if (tileElement) {
      gsap.to(tileElement, {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 0.4,
        delay: 0.3,
        ease: 'power2.in'
      });
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Update board
  const newBoard = [...board];
  tilesToRemove.forEach(tile => {
    newBoard[tile.row][tile.col] = null;
  });
  setBoard(newBoard);
  
  // Score (200 per tile)
  const points = tilesToRemove.length * 200;
  setScore(prev => prev + points);
};
```

---

