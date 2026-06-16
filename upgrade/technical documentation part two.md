================================================================================
SHADOW GARDEN: TECHNICAL IMPLEMENTATION DOCUMENTATION - PART 2
================================================================================

TABLE OF CONTENTS - PART 2:
8.3  Remaining Power-Up Implementations (Ten Shadows, Magic Eyes, Full Counter)
9.   Audio System with Howler.js
10.  Visual Assets & Styling (Tailwind + styled-components)
11.  GSAP Animation System
12.  Tutorial System
13.  Loading Screens
14.  Performance Optimization
15.  Debug Mode Implementation
16.  Testing Strategy
17.  Deployment Guide
18.  3-Day Build Timeline

================================================================================
8.3 REMAINING POWER-UP IMPLEMENTATIONS
================================================================================

--------------------------------------------------------------------------------
TEN SHADOWS: DIVINE DOGS (State-Based with Passive Effect)
--------------------------------------------------------------------------------

File: src/utils/powerups/tenShadows.js

```javascript
import gsap from 'gsap';

export const activateTenShadows = async (setScore) => {
  // Effect: Doubles all points for 15 seconds
  
  // Visual: Divine dogs appear in corners
  const dogs = createDivineDogs();
  
  // Apply 2x multiplier effect (handled in main game logic)
  const multiplierDuration = 15000; // 15 seconds
  
  // Notify game of active multiplier
  window.shadowGardenMultiplier = 2;
  window.shadowGardenMultiplierEnd = Date.now() + multiplierDuration;
  
  // Countdown timer display
  const timerElement = createMultiplierTimer(multiplierDuration);
  
  // Visual feedback - blue aura on score display
  const scoreDisplay = document.getElementById('score-display');
  gsap.to(scoreDisplay, {
    textShadow: '0 0 20px #00BFFF',
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: -1 // Infinite while active
  });
  
  await new Promise(resolve => setTimeout(resolve, multiplierDuration));
  
  // Remove multiplier
  window.shadowGardenMultiplier = 1;
  delete window.shadowGardenMultiplierEnd;
  
  // Remove visuals
  dogs.remove();
  timerElement.remove();
  gsap.killTweensOf(scoreDisplay);
  gsap.to(scoreDisplay, {
    textShadow: 'none',
    scale: 1,
    duration: 0.3
  });
};

const createDivineDogs = () => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
  `;
  
  // Black dog (bottom-left)
  const blackDog = document.createElement('div');
  blackDog.innerHTML = '🐺'; // Use emoji or SVG
  blackDog.style.cssText = `
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 80px;
    filter: brightness(0.3) drop-shadow(0 0 10px blue);
  `;
  
  // White dog (bottom-right)
  const whiteDog = document.createElement('div');
  whiteDog.innerHTML = '🐺';
  whiteDog.style.cssText = `
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 80px;
    filter: brightness(2) drop-shadow(0 0 10px blue);
  `;
  
  container.appendChild(blackDog);
  container.appendChild(whiteDog);
  document.body.appendChild(container);
  
  // Animate dogs howling
  gsap.to([blackDog, whiteDog], {
    scale: 1.1,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut'
  });
  
  return container;
};

const createMultiplierTimer = (duration) => {
  const timer = document.createElement('div');
  timer.style.cssText = `
    position: fixed;
    top: 120px;
    right: 20px;
    background: rgba(0, 191, 255, 0.9);
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    font-family: 'Quicksand', sans-serif;
    font-size: 18px;
    font-weight: bold;
    z-index: 51;
  `;
  
  let remaining = duration / 1000;
  timer.textContent = `2x Points: ${remaining}s`;
  
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
    } else {
      timer.textContent = `2x Points: ${remaining}s`;
    }
  }, 1000);
  
  document.body.appendChild(timer);
  return timer;
};
```

--------------------------------------------------------------------------------
MAGIC EYES OF DESTRUCTION (State-Based)
--------------------------------------------------------------------------------

File: src/utils/powerups/magicEyes.js

```javascript
import gsap from 'gsap';

export const activateMagicEyes = async (board, setBoard, setScore) => {
  // Effect: Destroy 4 corner pieces + all adjacent pieces
  
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: board[0].length - 1 },
    { row: board.length - 1, col: 0 },
    { row: board.length - 1, col: board[0].length - 1 }
  ];
  
  // Find all tiles to destroy (corners + adjacent)
  const tilesToRemove = [];
  
  corners.forEach(corner => {
    // Add corner
    tilesToRemove.push(corner);
    
    // Add adjacent tiles
    const adjacents = [
      { row: corner.row - 1, col: corner.col },
      { row: corner.row + 1, col: corner.col },
      { row: corner.row, col: corner.col - 1 },
      { row: corner.row, col: corner.col + 1 },
      { row: corner.row - 1, col: corner.col - 1 },
      { row: corner.row - 1, col: corner.col + 1 },
      { row: corner.row + 1, col: corner.col - 1 },
      { row: corner.row + 1, col: corner.col + 1 }
    ];
    
    adjacents.forEach(adj => {
      if (adj.row >= 0 && adj.row < board.length && 
          adj.col >= 0 && adj.col < board[0].length) {
        if (!tilesToRemove.some(t => t.row === adj.row && t.col === adj.col)) {
          tilesToRemove.push(adj);
        }
      }
    });
  });
  
  // Visual: Crimson eyes appear
  const eyesOverlay = document.createElement('div');
  eyesOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(220, 20, 60, 0.3) 0%, transparent 70%);
    z-index: 100;
    pointer-events: none;
  `;
  document.body.appendChild(eyesOverlay);
  
  // Eyes appear at top
  const eyes = document.createElement('div');
  eyes.style.cssText = `
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 100px;
    opacity: 0;
  `;
  eyes.textContent = '👁️👁️';
  eyesOverlay.appendChild(eyes);
  
  gsap.to(eyes, {
    opacity: 1,
    duration: 0.5
  });
  
  // Red spiral pattern in eyes
  gsap.to(eyes, {
    rotation: 360,
    duration: 2,
    ease: 'none'
  });
  
  // Create crimson lightning connecting corners
  corners.forEach((corner, index) => {
    setTimeout(() => {
      createLightning(corner, corners[(index + 1) % 4]);
    }, index * 200);
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Destroy tiles from corners with red explosion
  for (const tile of tilesToRemove) {
    const tileElement = document.getElementById(`tile-${tile.row}-${tile.col}`);
    if (tileElement && board[tile.row] && board[tile.row][tile.col]) {
      gsap.to(tileElement, {
        scale: 0,
        filter: 'hue-rotate(320deg) brightness(200%)',
        duration: 0.3,
        delay: Math.random() * 0.3
      });
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Remove overlay
  gsap.to(eyesOverlay, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => eyesOverlay.remove()
  });
  
  // Update board
  const newBoard = [...board];
  tilesToRemove.forEach(tile => {
    if (newBoard[tile.row] && newBoard[tile.row][tile.col]) {
      newBoard[tile.row][tile.col] = null;
    }
  });
  setBoard(newBoard);
  
  // Score (250 per tile)
  const validTiles = tilesToRemove.filter(t => 
    board[t.row] && board[t.row][t.col]
  ).length;
  const points = validTiles * 250;
  setScore(prev => prev + points);
};

const createLightning = (from, to) => {
  const boardElement = document.getElementById('game-board');
  const boardRect = boardElement.getBoundingClientRect();
  
  const tileSize = boardRect.width / 8;
  
  const fromX = boardRect.left + (from.col * tileSize) + (tileSize / 2);
  const fromY = boardRect.top + (from.row * tileSize) + (tileSize / 2);
  const toX = boardRect.left + (to.col * tileSize) + (tileSize / 2);
  const toY = boardRect.top + (to.row * tileSize) + (tileSize / 2);
  
  const lightning = document.createElement('div');
  lightning.style.cssText = `
    position: fixed;
    background: crimson;
    height: 3px;
    transform-origin: left center;
    z-index: 101;
    box-shadow: 0 0 10px crimson;
  `;
  
  const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
  
  lightning.style.width = `${length}px`;
  lightning.style.left = `${fromX}px`;
  lightning.style.top = `${fromY}px`;
  lightning.style.transform = `rotate(${angle}deg)`;
  
  document.body.appendChild(lightning);
  
  gsap.fromTo(lightning,
    { opacity: 0, scaleX: 0 },
    { 
      opacity: 1, 
      scaleX: 1, 
      duration: 0.2,
      onComplete: () => {
        gsap.to(lightning, {
          opacity: 0,
          duration: 0.3,
          delay: 0.5,
          onComplete: () => lightning.remove()
        });
      }
    }
  );
};
```

--------------------------------------------------------------------------------
FULL COUNTER (Fully Interactive - Timing Based)
--------------------------------------------------------------------------------

File: src/utils/powerups/fullCounter.js

```javascript
import gsap from 'gsap';

export const activateFullCounter = async (board, setBoard, setScore, targetData) => {
  // Effect: Reflects last move with 3x effectiveness
  // Must be activated within 3 seconds of a match
  
  if (!targetData || !targetData.lastMatchData) {
    console.error('Full Counter requires recent match data');
    return;
  }
  
  const { lastMatchData } = targetData;
  const { matchedTiles, pointsEarned } = lastMatchData;
  
  // Visual: Meliodas broken sword appears
  const sword = document.createElement('div');
  sword.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 150px;
    z-index: 102;
    opacity: 0;
  `;
  sword.textContent = '⚔️';
  document.body.appendChild(sword);
  
  // Golden energy swirl
  const energyOverlay = document.createElement('div');
  energyOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
    z-index: 101;
    pointer-events: none;
  `;
  document.body.appendChild(energyOverlay);
  
  // Animate sword appearing
  gsap.to(sword, {
    opacity: 1,
    rotation: 360,
    duration: 0.5
  });
  
  // "FULL COUNTER!" text
  const text = document.createElement('div');
  text.style.cssText = `
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Bangers', cursive;
    font-size: 72px;
    color: #FFD700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    z-index: 103;
    opacity: 0;
  `;
  text.textContent = 'FULL COUNTER!';
  document.body.appendChild(text);
  
  gsap.to(text, {
    opacity: 1,
    scale: 1.2,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate 3x the effect of last match
  const tilesToRemove = matchedTiles.length * 3;
  
  // Select random tiles to destroy (3x as many)
  const randomTiles = [];
  while (randomTiles.length < tilesToRemove) {
    const row = Math.floor(Math.random() * board.length);
    const col = Math.floor(Math.random() * board[0].length);
    
    if (board[row][col] && !randomTiles.some(t => t.row === row && t.col === col)) {
      randomTiles.push({ row, col });
    }
  }
  
  // Destroy tiles with golden explosion
  for (const tile of randomTiles) {
    const tileElement = document.getElementById(`tile-${tile.row}-${tile.col}`);
    if (tileElement) {
      gsap.to(tileElement, {
        scale: 0,
        filter: 'brightness(300%) hue-rotate(45deg)',
        duration: 0.3,
        delay: Math.random() * 0.4
      });
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Remove visuals
  gsap.to([sword, text, energyOverlay], {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      sword.remove();
      text.remove();
      energyOverlay.remove();
    }
  });
  
  // Update board
  const newBoard = [...board];
  randomTiles.forEach(tile => {
    newBoard[tile.row][tile.col] = null;
  });
  setBoard(newBoard);
  
  // Score (3x original points)
  const points = pointsEarned * 3;
  setScore(prev => prev + points);
};
```

================================================================================
9. AUDIO SYSTEM WITH HOWLER.JS
================================================================================

--------------------------------------------------------------------------------
9.1 Audio Manager Hook
--------------------------------------------------------------------------------

File: src/hooks/useSound.js

```javascript
import { Howl, Howler } from 'howler';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setMusicVolume, 
  setSfxVolume, 
  toggleMusicMute, 
  toggleSfxMute 
} from '../store/slices/shadowGardenSlice';

// Global audio instances
let audioInstances = {
  music: {},
  sfx: {}
};

let currentMusic = null;

// Initialize audio system for a game
export const initializeAudio = (game) => {
  if (game === 'shadow-garden') {
    // Load all SFX
    const sfxFiles = [
      'ui_click',
      'ui_hover',
      'match3',
      'match4',
      'match5',
      'combo',
      'powerup_gojo',
      'powerup_jinwoo',
      'powerup_toji',
      'powerup_megumi',
      'powerup_anos',
      'powerup_meliodas',
      'boss_hit',
      'boss_defeat',
      'level_complete',
      'unlock',
      'domain_expansion',
      'system_chime'
    ];
    
    sfxFiles.forEach(sfx => {
      audioInstances.sfx[sfx] = new Howl({
        src: [`/sounds/shadow-garden/sfx/${sfx}.mp3`],
        preload: true,
        volume: 1.0
      });
    });
    
    // Music files (loaded on demand per level)
    const musicFiles = [
      'level1_morning',
      'level2_twilight',
      'level3_cozy',
      'level4_battle',
      'level5_finale',
      'music_room_ambient'
    ];
    
    musicFiles.forEach(music => {
      audioInstances.music[music] = new Howl({
        src: [`/sounds/shadow-garden/music/${music}.mp3`],
        loop: true,
        volume: 0.7,
        preload: false // Load on demand
      });
    });
  }
};

// Play sound effect
export const playSound = (soundName, volume = 1.0) => {
  const sound = audioInstances.sfx[soundName];
  if (sound) {
    sound.volume(volume);
    sound.play();
  } else {
    console.warn(`Sound '${soundName}' not found`);
  }
};

// Play level music with crossfade
export const playLevelMusic = async (level, fadeTime = 1000) => {
  const musicMap = {
    1: 'level1_morning',
    2: 'level2_twilight',
    3: 'level3_cozy',
    4: 'level4_battle',
    5: 'level5_finale'
  };
  
  const musicName = musicMap[level];
  if (!musicName) return;
  
  const newMusic = audioInstances.music[musicName];
  
  if (currentMusic && currentMusic !== newMusic) {
    // Crossfade from current to new
    currentMusic.fade(currentMusic.volume(), 0, fadeTime);
    
    setTimeout(() => {
      currentMusic.stop();
      currentMusic = newMusic;
      newMusic.play();
      newMusic.fade(0, 0.7, fadeTime);
    }, fadeTime);
  } else {
    // No current music, just play
    currentMusic = newMusic;
    newMusic.play();
    newMusic.volume(0.7);
  }
};

// Stop all music
export const stopMusic = (fadeTime = 500) => {
  if (currentMusic) {
    currentMusic.fade(currentMusic.volume(), 0, fadeTime);
    setTimeout(() => {
      currentMusic.stop();
      currentMusic = null;
    }, fadeTime);
  }
};

// React hook for audio controls
export const useAudio = () => {
  const dispatch = useDispatch();
  const musicVolume = useSelector(state => state.shadowGarden.musicVolume);
  const sfxVolume = useSelector(state => state.shadowGarden.sfxVolume);
  const musicMuted = useSelector(state => state.shadowGarden.musicMuted);
  const sfxMuted = useSelector(state => state.shadowGarden.sfxMuted);
  
  const setMusicVol = (volume) => {
    dispatch(setMusicVolume(volume));
    if (currentMusic) {
      currentMusic.volume(volume);
    }
  };
  
  const setSfxVol = (volume) => {
    dispatch(setSfxVolume(volume));
    Howler.volume(volume);
  };
  
  const toggleMusic = () => {
    dispatch(toggleMusicMute());
    if (currentMusic) {
      currentMusic.mute(!musicMuted);
    }
  };
  
  const toggleSfx = () => {
    dispatch(toggleSfxMute());
    Object.values(audioInstances.sfx).forEach(sound => {
      sound.mute(!sfxMuted);
    });
  };
  
  return {
    musicVolume,
    sfxVolume,
    musicMuted,
    sfxMuted,
    setMusicVolume: setMusicVol,
    setSfxVolume: setSfxVol,
    toggleMusicMute: toggleMusic,
    toggleSfxMute: toggleSfx,
    playSound,
    playLevelMusic,
    stopMusic
  };
};
```

--------------------------------------------------------------------------------
9.2 Audio Control UI Component
--------------------------------------------------------------------------------

File: src/components/shared/AudioControl.jsx

```javascript
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAudio } from '../../hooks/useSound';

const AudioControl = ({ game }) => {
  const [showControls, setShowControls] = useState(false);
  const {
    musicVolume,
    sfxVolume,
    musicMuted,
    sfxMuted,
    setMusicVolume,
    setSfxVolume,
    toggleMusicMute,
    toggleSfxMute
  } = useAudio();
  
  return (
    <ControlContainer>
      <ToggleButton onClick={() => setShowControls(!showControls)}>
        🎵
      </ToggleButton>
      
      {showControls && (
        <ControlPanel>
          <ControlGroup>
            <Label>Music</Label>
            <VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            />
            <MuteButton 
              onClick={toggleMusicMute}
              muted={musicMuted}
            >
              {musicMuted ? '🔇' : '🔊'}
            </MuteButton>
          </ControlGroup>
          
          <ControlGroup>
            <Label>SFX</Label>
            <VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            />
            <MuteButton 
              onClick={toggleSfxMute}
              muted={sfxMuted}
            >
              {sfxMuted ? '🔇' : '🔊'}
            </MuteButton>
          </ControlGroup>
        </ControlPanel>
      )}
    </ControlContainer>
  );
};

const ControlContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 200;
`;

const ToggleButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #FFD700;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.9);
  }
`;

const ControlPanel = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 10px;
  padding: 20px;
  min-width: 250px;
  border: 2px solid #FFD700;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  color: white;
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  min-width: 60px;
`;

const VolumeSlider = styled.input`
  flex: 1;
  accent-color: #FFD700;
`;

const MuteButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.muted ? '#E63946' : '#4CAF50'};
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export default AudioControl;
```

--------------------------------------------------------------------------------
9.3 Sound Files README
--------------------------------------------------------------------------------

File: public/sounds/shadow-garden/README.md

```markdown
# Shadow Garden Sound Files

Add the following sound files to their respective folders.

## Music Files (music/)

These should be royalty-free, loopable background tracks:

1. **level1_morning.mp3**
   - Vibe: Upbeat romantic piano, hopeful morning
   - Length: 2-3 minutes (seamless loop)
   - Reference: Your Name morning scenes

2. **level2_twilight.mp3**
   - Vibe: Smooth R&B instrumental, lo-fi beats
   - Length: 2-3 minutes (seamless loop)
   - Reference: Classic 90s slow jam instrumental

3. **level3_cozy.mp3**
   - Vibe: Warm music box melody, nostalgic lo-fi
   - Length: 2-3 minutes (seamless loop)
   - Reference: Animal Crossing room music

4. **level4_battle.mp3**
   - Vibe: Epic orchestral + electronic, intense
   - Length: 2-3 minutes (seamless loop)
   - Reference: JJK/Solo Leveling battle themes

5. **level5_finale.mp3**
   - Vibe: Emotional romantic orchestral, climactic
   - Length: 3-4 minutes (plays once, no loop needed)
   - Reference: Your Name/Weathering With You climax

6. **music_room_ambient.mp3**
   - Vibe: Soft lo-fi piano, very peaceful
   - Length: 3-5 minutes (seamless loop)
   - Volume: Quiet background only

## Sound Effects (sfx/)

Short, punchy sound effects:

- **ui_click.mp3** - Button click (0.1s)
- **ui_hover.mp3** - Button hover (0.1s)
- **match3.mp3** - 3-match chime (0.3s)
- **match4.mp3** - 4-match chime, slightly higher (0.3s)
- **match5.mp3** - 5-match grand chime (0.5s)
- **combo.mp3** - Combo sound, ascending notes (0.5s)
- **powerup_gojo.mp3** - Electric whoosh (0.7s)
- **powerup_jinwoo.mp3** - Shadow whispers (0.8s)
- **powerup_toji.mp3** - Sharp slash (0.5s)
- **powerup_megumi.mp3** - Wolf howl + energy (0.8s)
- **powerup_anos.mp3** - Demonic energy surge (0.7s)
- **powerup_meliodas.mp3** - Sword clash + explosion (0.8s)
- **boss_hit.mp3** - Impact thud (0.3s)
- **boss_defeat.mp3** - Defeat sound (1.0s)
- **level_complete.mp3** - Victory fanfare (2.0s)
- **unlock.mp3** - Success chime (0.5s)
- **domain_expansion.mp3** - Epic bass drop + reverb (3.0s)
- **system_chime.mp3** - Solo Leveling notification sound (0.5s)

## Recommended Sources:

- **Epidemic Sound** (subscription, high quality)
- **Artlist** (subscription, excellent for background music)
- **YouTube Audio Library** (free, royalty-free)
- **Incompetech** (free, Creative Commons)
- **Freesound.org** (free sound effects)
- **Zapsplat** (free sound effects)

## File Requirements:

- Format: MP3 (128kbps minimum, 192kbps recommended)
- Ensure seamless loops for music (fade in/out at same point)
- Volume normalize all SFX to similar levels
- Test each sound before adding

## Native HTML5 Audio Fallbacks:

If a sound file is missing, the app will log a warning but continue working.
You can test the app with placeholder/empty MP3 files initially.
```

================================================================================
10. VISUAL ASSETS & STYLING
================================================================================

--------------------------------------------------------------------------------
10.1 Tailwind Configuration
--------------------------------------------------------------------------------

File: tailwind.config.js

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shadow Garden color palette
        'sg-pink': '#FFB6C1',
        'sg-rose': '#FF69B4',
        'sg-deep-rose': '#FF1493',
        'sg-red': '#E63946',
        'sg-midnight': '#191970',
        'sg-purple': '#7B2CBF',
        'sg-violet': '#9D4EDD',
        'sg-gold': '#FFD700',
        'sg-gold-light': '#FFA500',
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        bangers: ['Bangers', 'cursive'],
        dancing: ['Dancing Script', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 215, 0, 1)' },
        },
      },
    },
  },
  plugins: [],
}
```

--------------------------------------------------------------------------------
10.2 Combining Tailwind with styled-components
--------------------------------------------------------------------------------

Best Practice Pattern:

```javascript
// Use Tailwind for:
// - Layout (flex, grid, spacing)
// - Responsive breakpoints
// - Common utilities (text-center, rounded, etc.)

// Use styled-components for:
// - Complex animations
// - Dynamic styling based on props
// - Component-specific styles
// - GSAP animation targets

// Example: Board Component

import styled from 'styled-components';

const Board = ({ tiles }) => {
  return (
    <BoardContainer className="grid grid-cols-8 gap-2 p-4 max-w-2xl mx-auto">
      {tiles.map((tile, index) => (
        <Tile 
          key={index}
          tileType={tile.type}
          isSelected={tile.selected}
          className="w-full aspect-square rounded-lg"
        />
      ))}
    </BoardContainer>
  );
};

// Tailwind handles grid layout
// styled-components handles tile-specific styling
const Tile = styled.div`
  background: ${props => getTileColor(props.tileType)};
  transform: scale(${props => props.isSelected ? 1.1 : 1});
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: ${props => props.isSelected 
    ? '0 0 20px rgba(255, 215, 0, 0.8)' 
    : '0 4px 10px rgba(0, 0, 0, 0.2)'};
  
  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
`;

const getTileColor = (type) => {
  const colors = {
    0: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
    1: 'linear-gradient(135deg, #000000 0%, #4B0082 100%)',
    2: 'linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)',
    3: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    4: 'linear-gradient(135deg, #4B0082 0%, #8B008B 100%)',
    5: 'linear-gradient(135deg, #F8F9FA 0%, #E0E0E0 100%)',
  };
  return colors[type] || colors[0];
};
```

--------------------------------------------------------------------------------
10.3 SVG Tile Assets
--------------------------------------------------------------------------------

Since you chose SVG icons (Option B), here's how to structure them:

File: src/components/shadow-garden/game/TileIcon.jsx

```javascript
import React from 'react';

const TILE_SVGS = {
  'cherry-blossom': (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cherry-gradient">
          <stop offset="0%" stopColor="#FFB6C1" />
          <stop offset="100%" stopColor="#FF69B4" />
        </radialGradient>
      </defs>
      {/* Cherry blossom petals */}
      <circle cx="50" cy="30" r="12" fill="url(#cherry-gradient)" />
      <circle cx="70" cy="50" r="12" fill="url(#cherry-gradient)" />
      <circle cx="50" cy="70" r="12" fill="url(#cherry-gradient)" />
      <circle cx="30" cy="50" r="12" fill="url(#cherry-gradient)" />
      <circle cx="50" cy="50" r="8" fill="#FFD700" />
    </svg>
  ),
  
  'shadow-orb': (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shadow-gradient">
          <stop offset="0%" stopColor="#4B0082" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#shadow-gradient)" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="#9D4EDD" strokeWidth="2" opacity="0.5" />
    </svg>
  ),
  
  'six-eyes': (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="eyes-gradient">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#00BFFF" />
        </radialGradient>
      </defs>
      <circle cx="35" cy="50" r="18" fill="url(#eyes-gradient)" />
      <circle cx="65" cy="50" r="18" fill="url(#eyes-gradient)" />
      <circle cx="35" cy="50" r="8" fill="#000" />
      <circle cx="65" cy="50" r="8" fill="#000" />
      <circle cx="35" cy="50" r="3" fill="#FFF" />
      <circle cx="65" cy="50" r="3" fill="#FFF" />
    </svg>
  ),
  
  'music-note': (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="note-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="75" rx="15" ry="12" fill="url(#note-gradient)" />
      <rect x="42" y="30" width="6" height="45" fill="url(#note-gradient)" />
      <path d="M 48 30 Q 70 25 70 45" fill="none" stroke="url(#note-gradient)" strokeWidth="6" />
      <ellipse cx="70" cy="50" rx="12" ry="10" fill="url(#note-gradient)" />
    </svg>
  ),
  
  'black-heart': (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B008B" />
          <stop offset="100%" stopColor="#4B0082" />
        </linearGradient>
      </defs>
      <path d="M 50,90 C 25,70 10,55 10,40 C 10,25 20,15 30,15 C 40,15 45,20 50,30 C 55,20 60,15 70,15 C 80,15 90,25 90,40 C 90,55 75,70 50,90 Z" 
        fill="url(#heart-gradient)" 
        stroke="#9D4EDD" 
        strokeWidth="2"
      />
    </svg>
  ),
  
  'star-fragment': (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="star-gradient">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8F9FA" />
        </radialGradient>
      </defs>
      <polygon points="50,10 61,35 88,40 69,58 73,85 50,73 27,85 31,58 12,40 39,35" 
        fill="url(#star-gradient)" 
        stroke="#FFD700" 
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="8" fill="#FFD700" />
    </svg>
  )
};

const TileIcon = ({ type, size = 100 }) => {
  const iconKey = Object.keys(TILE_SVGS)[type];
  
  return (
    <div style={{ width: size, height: size }}>
      {TILE_SVGS[iconKey] || TILE_SVGS['cherry-blossom']}
    </div>
  );
};

export default TileIcon;
```

--------------------------------------------------------------------------------
10.4 Background Gradients (CSS)
--------------------------------------------------------------------------------

File: src/styles/shadowGardenStyles.js

```javascript
import styled from 'styled-components';

// Level backgrounds using CSS gradients

export const Level1Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, 
    #FFE5EC 0%,
    #FFC2D4 30%,
    #FFB6C1 60%,
    #FF69B4 100%
  );
  position: relative;
  overflow: hidden;
  
  /* Floating cherry blossom petals */
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle, #FFB6C1 2px, transparent 2px);
    background-size: 50px 50px;
    animation: float 20s linear infinite;
    opacity: 0.3;
  }
  
  @keyframes float {
    0% { transform: translateY(0); }
    100% { transform: translateY(-100%); }
  }
`;

export const Level2Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg,
    #FF6B6B 0%,
    #EE5A6F 20%,
    #9D4EDD 50%,
    #7B2CBF 80%,
    #4B0082 100%
  );
  position: relative;
  overflow: hidden;
  
  /* Vinyl record pattern */
  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 20px solid rgba(0, 0, 0, 0.2);
    top: 20%;
    right: -100px;
    opacity: 0.3;
  }
`;

export const Level3Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg,
    #F4E8D0 0%,
    #E8D7B8 30%,
    #FFB6C1 60%,
    #FF69B4 100%
  );
  position: relative;
  overflow: hidden;
`;

export const Level4Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg,
    #0a0a2e 0%,
    #16213e 30%,
    #1a1a3e 60%,
    #000000 100%
  );
  position: relative;
  overflow: hidden;
  
  /* Lightning effect */
  animation: lightning 10s infinite;
  
  @keyframes lightning {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  /* Storm clouds */
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(ellipse at 20% 30%, rgba(123, 44, 191, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, rgba(157, 78, 221, 0.3) 0%, transparent 50%);
    animation: storm 15s ease-in-out infinite;
  }
  
  @keyframes storm {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
`;

export const Level5Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: 
    radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 30% 40%, rgba(255, 182, 193, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 70% 60%, rgba(255, 215, 0, 0.2) 0%, transparent 40%),
    linear-gradient(180deg, #0a0a2e 0%, #16213e 50%, #1a1a3e 100%);
  position: relative;
  overflow: hidden;
  animation: cosmic 30s ease-in-out infinite;
  
  @keyframes cosmic {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  /* Stars */
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle, white 1px, transparent 1px),
      radial-gradient(circle, white 1px, transparent 1px);
    background-size: 50px 50px, 80px 80px;
    background-position: 0 0, 40px 40px;
    animation: twinkle 5s ease-in-out infinite;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

the rest of the sections
00:49
Creating comprehensive technical documentation for remaining sections

text
# 🚀 SHADOW GARDEN - TECHNICAL IMPLEMENTATION DOCUMENTATION
# PART 2: REMAINING SECTIONS

===============================================================================
TABLE OF CONTENTS - PART 2
===============================================================================

8.3  Remaining Power-Up Implementations
9.   Audio System with Howler.js
10.  Visual Assets & Styling (Tailwind + styled-components)
11.  GSAP Animation System
12.  Tutorial System Implementation
13.  Loading Screens
14.  Performance Optimization
15.  Debug Mode Implementation
16.  Testing Strategy
17.  Deployment Guide
18.  3-Day Build Timeline

===============================================================================
8.3 REMAINING POWER-UP IMPLEMENTATIONS
===============================================================================

---
TEN SHADOWS: DIVINE DOGS (State-Based - Score Multiplier)
---

// src/utils/powerups/tenShadows.js
import gsap from 'gsap';

export const activateTenShadows = async (setScore) => {
  // Effect: Double all points for 15 seconds
  // No board manipulation, just affects scoring
  
  // Create divine dogs visual
  const dogsContainer = document.createElement('div');
  dogsContainer.style.cssText = `
    position: fixed;
    top: 50px;
    right: 50px;
    z-index: 200;
    display: flex;
    gap: 20px;
  `;
  
  // Black dog
  const blackDog = createDog('#000000');
  // White dog  
  const whiteDog = createDog('#FFFFFF');
  
  dogsContainer.appendChild(blackDog);
  dogsContainer.appendChild(whiteDog);
  document.body.appendChild(dogsContainer);
  
  // Howl animation
  gsap.fromTo(dogsContainer,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
  );
  
  // Blue cursed energy aura
  const aura = document.createElement('div');
  aura.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 80% 10%, rgba(0, 100, 255, 0.2) 0%, transparent 50%);
    pointer-events: none;
    z-index: 199;
  `;
  document.body.appendChild(aura);
  
  // Activate score multiplier (handled in main game component via flag)
  window.tenShadowsActive = true;
  window.tenShadowsStartTime = Date.now();
  
  // Timer display
  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'ten-shadows-timer';
  timerDisplay.style.cssText = `
    position: fixed;
    top: 120px;
    right: 50px;
    font-family: 'Quicksand', sans-serif;
    font-size: 24px;
    color: #00BFFF;
    font-weight: bold;
    z-index: 201;
    text-shadow: 0 0 10px rgba(0, 100, 255, 0.8);
  `;
  document.body.appendChild(timerDisplay);
  
  // Countdown timer
  const updateTimer = () => {
    if (!window.tenShadowsActive) return;
    
    const elapsed = Date.now() - window.tenShadowsStartTime;
    const remaining = Math.max(0, 15 - Math.floor(elapsed / 1000));
    
    timerDisplay.textContent = `2x POINTS: ${remaining}s`;
    
    if (remaining > 0) {
      requestAnimationFrame(updateTimer);
    } else {
      // End effect
      window.tenShadowsActive = false;
      
      gsap.to([dogsContainer, aura, timerDisplay], {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          dogsContainer.remove();
          aura.remove();
          timerDisplay.remove();
        }
      });
    }
  };
  
  updateTimer();
};

const createDog = (color) => {
  const dog = document.createElement('div');
  dog.style.cssText = `
    width: 60px;
    height: 60px;
    background: ${color};
    border: 3px solid #00BFFF;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    position: relative;
    box-shadow: 0 0 20px ${color === '#000000' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'};
  `;
  
  // Ears
  const ear1 = document.createElement('div');
  ear1.style.cssText = `
    position: absolute;
    width: 20px;
    height: 30px;
    background: ${color};
    border: 2px solid #00BFFF;
    border-radius: 50%;
    top: -10px;
    left: 5px;
  `;
  
  const ear2 = ear1.cloneNode();
  ear2.style.left = 'auto';
  ear2.style.right = '5px';
  
  dog.appendChild(ear1);
  dog.appendChild(ear2);
  
  return dog;
};

// NOTE: The actual 2x score multiplier is applied in the main game component
// When calculating points, check: if (window.tenShadowsActive) points *= 2;

---
MAGIC EYES OF DESTRUCTION (State-Based)
---

// src/utils/powerups/magicEyes.js
import gsap from 'gsap';

export const activateMagicEyes = async (board, setBoard, setScore) => {
  // Effect: Destroy 4 corner pieces AND all adjacent pieces
  
  const size = board.length;
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: size - 1 },
    { row: size - 1, col: 0 },
    { row: size - 1, col: size - 1 }
  ];
  
  const tilesToRemove = [];
  
  // Add corners and adjacent tiles
  corners.forEach(corner => {
    tilesToRemove.push(corner);
    
    // Adjacent tiles
    const adjacent = [
      { row: corner.row - 1, col: corner.col },
      { row: corner.row + 1, col: corner.col },
      { row: corner.row, col: corner.col - 1 },
      { row: corner.row, col: corner.col + 1 },
      { row: corner.row - 1, col: corner.col - 1 },
      { row: corner.row - 1, col: corner.col + 1 },
      { row: corner.row + 1, col: corner.col - 1 },
      { row: corner.row + 1, col: corner.col + 1 }
    ];
    
    adjacent.forEach(tile => {
      if (tile.row >= 0 && tile.row < size && tile.col >= 0 && tile.col < size) {
        if (!tilesToRemove.some(t => t.row === tile.row && t.col === tile.col)) {
          tilesToRemove.push(tile);
        }
      }
    });
  });
  
  // Crimson eyes effect
  const eyesOverlay = document.createElement('div');
  eyesOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 0, 0, 0.3) 0%, transparent 70%);
    z-index: 100;
    pointer-events: none;
  `;
  document.body.appendChild(eyesOverlay);
  
  // Crimson spiral eyes appear
  const eye1 = createCrimsonEye();
  const eye2 = createCrimsonEye();
  
  eye1.style.left = '35%';
  eye1.style.top = '30%';
  eye2.style.left = '65%';
  eye2.style.top = '30%';
  
  document.body.appendChild(eye1);
  document.body.appendChild(eye2);
  
  gsap.fromTo([eye1, eye2],
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5 }
  );
  
  // Magic circles appear at corners
  corners.forEach((corner, index) => {
    const circle = createMagicCircle();
    const tileElement = document.getElementById(`tile-${corner.row}-${corner.col}`);
    
    if (tileElement) {
      const rect = tileElement.getBoundingClientRect();
      circle.style.left = rect.left + 'px';
      circle.style.top = rect.top + 'px';
      document.body.appendChild(circle);
      
      gsap.fromTo(circle,
        { scale: 0, rotation: 0 },
        { 
          scale: 1, 
          rotation: 360, 
          duration: 0.8,
          delay: index * 0.1,
          onComplete: () => circle.remove()
        }
      );
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Crimson lightning connects the corners
  createCrimsonLightning(corners);
  
  // Destroy tiles with explosion effect
  for (const tile of tilesToRemove) {
    const tileElement = document.getElementById(`tile-${tile.row}-${tile.col}`);
    if (tileElement && board[tile.row][tile.col]) {
      gsap.to(tileElement, {
        scale: 0,
        opacity: 0,
        filter: 'hue-rotate(360deg)',
        duration: 0.4,
        ease: 'power2.in'
      });
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Remove overlays
  gsap.to([eyesOverlay, eye1, eye2], {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      eyesOverlay.remove();
      eye1.remove();
      eye2.remove();
    }
  });
  
  // Update board
  const newBoard = [...board];
  tilesToRemove.forEach(tile => {
    if (newBoard[tile.row][tile.col]) {
      newBoard[tile.row][tile.col] = null;
    }
  });
  setBoard(newBoard);
  
  // Score (150 per tile)
  const points = tilesToRemove.filter(tile => board[tile.row][tile.col]).length * 150;
  setScore(prev => prev + points);
};

const createCrimsonEye = () => {
  const eye = document.createElement('div');
  eye.style.cssText = `
    position: fixed;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, #FF0000 20%, #8B0000 50%, transparent 70%);
    border-radius: 50%;
    z-index: 101;
    pointer-events: none;
  `;
  
  // Spiral pattern
  const spiral = document.createElement('div');
  spiral.style.cssText = `
    position: absolute;
    width: 100%;
    height: 100%;
    background: conic-gradient(from 0deg, transparent, #FF6666, transparent);
    border-radius: 50%;
    animation: spin 2s linear infinite;
  `;
  
  eye.appendChild(spiral);
  
  return eye;
};

const createMagicCircle = () => {
  const circle = document.createElement('div');
  circle.style.cssText = `
    position: fixed;
    width: 80px;
    height: 80px;
    border: 3px solid #FF0000;
    border-radius: 50%;
    z-index: 101;
    pointer-events: none;
    box-shadow: 0 0 20px #FF0000;
  `;
  
  // Inner circles
  for (let i = 1; i <= 2; i++) {
    const inner = document.createElement('div');
    inner.style.cssText = `
      position: absolute;
      width: ${80 - (i * 20)}px;
      height: ${80 - (i * 20)}px;
      border: 2px solid #FF0000;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;
    circle.appendChild(inner);
  }
  
  return circle;
};

const createCrimsonLightning = (corners) => {
  // Create SVG lightning between corners
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    pointer-events: none;
  `;
  
  // Connect corners with lightning
  const connections = [
    [0, 1], [1, 3], [3, 2], [2, 0]
  ];
  
  connections.forEach(([from, to]) => {
    const fromTile = document.getElementById(`tile-${corners[from].row}-${corners[from].col}`);
    const toTile = document.getElementById(`tile-${corners[to].row}-${corners[to].col}`);
    
    if (fromTile && toTile) {
      const fromRect = fromTile.getBoundingClientRect();
      const toRect = toTile.getBoundingClientRect();
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromRect.left + fromRect.width / 2);
      line.setAttribute('y1', fromRect.top + fromRect.height / 2);
      line.setAttribute('x2', toRect.left + toRect.width / 2);
      line.setAttribute('y2', toRect.top + toRect.height / 2);
      line.setAttribute('stroke', '#FF0000');
      line.setAttribute('stroke-width', '3');
      line.style.filter = 'drop-shadow(0 0 10px #FF0000)';
      
      svg.appendChild(line);
    }
  });
  
  document.body.appendChild(svg);
  
  gsap.fromTo(svg,
    { opacity: 0 },
    { 
      opacity: 1, 
      duration: 0.2,
      onComplete: () => {
        setTimeout(() => {
          gsap.to(svg, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => svg.remove()
          });
        }, 400);
      }
    }
  );
};

---
FULL COUNTER (Fully Interactive - Requires Timing)
---

// src/utils/powerups/fullCounter.js
import gsap from 'gsap';

export const activateFullCounter = async (board, setBoard, setScore, targetData) => {
  // Effect: Reflect the LAST move with 3x effectiveness
  // Must be activated within 3 seconds of last match
  
  if (!targetData || !targetData.lastMatch) {
    console.error('Full Counter requires recent match data');
    return;
  }
  
  const lastMatch = targetData.lastMatch;
  const lastMatchTime = targetData.lastMatchTime;
  const currentTime = Date.now();
  
  // Check if within 3 seconds
  if (currentTime - lastMatchTime > 3000) {
    // Too late!
    alert('Too slow! Full Counter must be used within 3 seconds of a match.');
    return;
  }
  
  // Meliodas's broken sword appears
  const sword = document.createElement('div');
  sword.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 120px;
    z-index: 102;
    pointer-events: none;
  `;
  sword.textContent = '🗡️';
  document.body.appendChild(sword);
  
  gsap.fromTo(sword,
    { scale: 0, rotation: -180 },
    { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }
  );
  
  // Golden energy swirls
  const energyOverlay = document.createElement('div');
  energyOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
    z-index: 101;
    pointer-events: none;
  `;
  document.body.appendChild(energyOverlay);
  
  // "FULL COUNTER!" text
  const counterText = document.createElement('div');
  counterText.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Bangers', cursive;
    font-size: 72px;
    color: #FFD700;
    text-shadow: 0 0 20px #FFA500;
    z-index: 103;
    pointer-events: none;
  `;
  counterText.textContent = 'FULL COUNTER!';
  document.body.appendChild(counterText);
  
  gsap.fromTo(counterText,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
  );
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Calculate 3x effectiveness
  // If last match cleared 10 pieces, Full Counter clears 30 random pieces
  const originalClearCount = lastMatch.tilesCleared || 0;
  const counterClearCount = originalClearCount * 3;
  
  // Select random tiles to clear
  const tilesToRemove = [];
  let attempts = 0;
  
  while (tilesToRemove.length < counterClearCount && attempts < counterClearCount * 3) {
    const row = Math.floor(Math.random() * board.length);
    const col = Math.floor(Math.random() * board[0].length);
    
    if (board[row][col] && !tilesToRemove.some(t => t.row === row && t.col === col)) {
      tilesToRemove.push({ row, col });
    }
    attempts++;
  }
  
  // Golden explosion effect on each tile
  for (const tile of tilesToRemove) {
    const tileElement = document.getElementById(`tile-${tile.row}-${tile.col}`);
    if (tileElement) {
      // Golden flash
      gsap.to(tileElement, {
        backgroundColor: '#FFD700',
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
      
      gsap.to(tileElement, {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 20)); // Stagger
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Remove overlays
  gsap.to([sword, energyOverlay, counterText], {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      sword.remove();
      energyOverlay.remove();
      counterText.remove();
    }
  });
  
  // Update board
  const newBoard = [...board];
  tilesToRemove.forEach(tile => {
    newBoard[tile.row][tile.col] = null;
  });
  setBoard(newBoard);
  
  // Score (300 per tile - it's the ultimate power!)
  const points = tilesToRemove.length * 300;
  setScore(prev => prev + points);
};

// NOTE: In the main game component, store last match data:
// lastMatch: { tilesCleared: number, time: timestamp }
// When player makes a match, update this data
// Full Counter can only be used within 3 seconds of this data


===============================================================================
9. AUDIO SYSTEM WITH HOWLER.JS
===============================================================================

---
AUDIO MANAGER SETUP
---

// src/hooks/useSound.js
import { Howl, Howler } from 'howler';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setMusicVolume, 
  setSfxVolume,
  toggleMusicMute,
  toggleSfxMute
} from '../store/slices/shadowGardenSlice';

// Audio registry
const audioRegistry = {
  music: {},
  sfx: {}
};

// Current playing music track
let currentMusic = null;

---
INITIALIZE AUDIO SYSTEM
---

export const initializeAudio = (game) => {
  if (game === 'shadow-garden') {
    // Preload all Shadow Garden audio
    
    // Music tracks
    audioRegistry.music.level1 = new Howl({
      src: ['/sounds/shadow-garden/music/level1_morning.mp3'],
      loop: true,
      volume: 0.7,
      preload: true
    });
    
    audioRegistry.music.level2 = new Howl({
      src: ['/sounds/shadow-garden/music/level2_twilight.mp3'],
      loop: true,
      volume: 0.7,
      preload: true
    });
    
    audioRegistry.music.level3 = new Howl({
      src: ['/sounds/shadow-garden/music/level3_cozy.mp3'],
      loop: true,
      volume: 0.7,
      preload: true
    });
    
    audioRegistry.music.level4 = new Howl({
      src: ['/sounds/shadow-garden/music/level4_battle.mp3'],
      loop: true,
      volume: 0.7,
      preload: true
    });
    
    audioRegistry.music.level5 = new Howl({
      src: ['/sounds/shadow-garden/music/level5_finale.mp3'],
      loop: false, // Plays once
      volume: 0.7,
      preload: true
    });
    
    audioRegistry.music.musicRoom = new Howl({
      src: ['/sounds/shadow-garden/music/music_room_ambient.mp3'],
      loop: true,
      volume: 0.3,
      preload: true
    });
    
    // SFX
    const sfxFiles = [
      'ui_click',
      'ui_hover',
      'match3',
      'match4',
      'match5',
      'combo',
      'powerup_gojo',
      'powerup_jinwoo',
      'powerup_toji',
      'powerup_megumi',
      'powerup_anos',
      'powerup_meliodas',
      'boss_hit',
      'boss_defeat',
      'level_complete',
      'unlock',
      'domain_expansion',
      'system_chime'
    ];
    
    sfxFiles.forEach(sfxName => {
      audioRegistry.sfx[sfxName] = new Howl({
        src: [`/sounds/shadow-garden/sfx/${sfxName}.mp3`],
        volume: 1.0,
        preload: true
      });
    });
  }
  
  // Similar setup for Valentine's game and Hub
  // ...
};

---
PLAY LEVEL MUSIC WITH CROSSFADE
---

export const playLevelMusic = (level, fadeDuration = 1000) => {
  const trackName = `level${level}`;
  const newTrack = audioRegistry.music[trackName];
  
  if (!newTrack) {
    console.error(`Music track for level ${level} not found`);
    return;
  }
  
  // Crossfade from current to new
  if (currentMusic && currentMusic !== newTrack) {
    // Fade out current
    currentMusic.fade(currentMusic.volume(), 0, fadeDuration);
    
    // Stop after fade
    setTimeout(() => {
      currentMusic.stop();
    }, fadeDuration);
  }
  
  // Fade in new track
  newTrack.volume(0);
  newTrack.play();
  newTrack.fade(0, 0.7, fadeDuration);
  
  currentMusic = newTrack;
};

---
PLAY SOUND EFFECT
---

export const playSound = (soundName) => {
  const sound = audioRegistry.sfx[soundName];
  
  if (sound) {
    sound.play();
  } else {
    console.warn(`Sound ${soundName} not found`);
  }
};

---
STOP ALL AUDIO
---

export const stopAllAudio = () => {
  if (currentMusic) {
    currentMusic.stop();
  }
  
  Object.values(audioRegistry.sfx).forEach(sound => sound.stop());
};

---
AUDIO CONTROL COMPONENT (UI)
---

// src/components/shared/AudioControl.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { 
  setMusicVolume, 
  setSfxVolume,
  toggleMusicMute,
  toggleSfxMute
} from '../../store/slices/shadowGardenSlice';
import { Howler } from 'howler';

const AudioControl = ({ game }) => {
  const dispatch = useDispatch();
  
  const musicVolume = useSelector(state => state[game].musicVolume);
  const sfxVolume = useSelector(state => state[game].sfxVolume);
  const musicMuted = useSelector(state => state[game].musicMuted);
  const sfxMuted = useSelector(state => state[game].sfxMuted);
  
  const [showControls, setShowControls] = React.useState(false);

  const handleMusicVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    dispatch(setMusicVolume(volume));
    
    // Apply to Howler music
    if (currentMusic) {
      currentMusic.volume(musicMuted ? 0 : volume);
    }
  };

  const handleSfxVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    dispatch(setSfxVolume(volume));
    
    // Apply globally to all SFX
    Object.values(audioRegistry.sfx).forEach(sound => {
      sound.volume(sfxMuted ? 0 : volume);
    });
  };

  const handleToggleMusicMute = () => {
    dispatch(toggleMusicMute());
    
    if (currentMusic) {
      currentMusic.volume(musicMuted ? musicVolume : 0);
    }
  };

  const handleToggleSfxMute = () => {
    dispatch(toggleSfxMute());
    
    Object.values(audioRegistry.sfx).forEach(sound => {
      sound.volume(sfxMuted ? sfxVolume : 0);
    });
  };

  return (
    <ControlContainer>
      <ToggleButton onClick={() => setShowControls(!showControls)}>
        🔊
      </ToggleButton>
      
      {showControls && (
        <ControlPanel>
          <ControlRow>
            <Label>Music</Label>
            <MuteButton onClick={handleToggleMusicMute}>
              {musicMuted ? '🔇' : '🔊'}
            </MuteButton>
            <Slider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={handleMusicVolumeChange}
              disabled={musicMuted}
            />
          </ControlRow>
          
          <ControlRow>
            <Label>SFX</Label>
            <MuteButton onClick={handleToggleSfxMute}>
              {sfxMuted ? '🔇' : '🔊'}
            </MuteButton>
            <Slider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={handleSfxVolumeChange}
              disabled={sfxMuted}
            />
          </ControlRow>
        </ControlPanel>
      )}
    </ControlContainer>
  );
};

const ControlContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ToggleButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #FFD700;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
`;

const ControlPanel = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #FFD700;
  border-radius: 10px;
  padding: 20px;
  min-width: 250px;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-family: 'Quicksand', sans-serif;
  color: white;
  font-size: 16px;
  min-width: 50px;
`;

const MuteButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const Slider = styled.input`
  flex: 1;
  
  &:disabled {
    opacity: 0.3;
  }
`;

export default AudioControl;

---
SOUND FILES README
---

// public/sounds/shadow-garden/README.md

# Shadow Garden - Sound Files Guide

Add the following music and sound effect files to this folder.

## MUSIC TRACKS (public/sounds/shadow-garden/music/)

### level1_morning.mp3
- **Vibe:** Upbeat romantic piano with soft strings, hopeful
- **Length:** 2-3 minutes (loopable)
- **Reference:** Your Name morning scenes
- **Tempo:** Moderate, energizing without being intense
- **Mood:** Fresh start, optimistic

### level2_twilight.mp3
- **Vibe:** Smooth R&B instrumental, lo-fi romantic beat
- **Length:** 2-3 minutes (loopable)
- **Reference:** Classic 90s R&B slow jam instrumental
- **Tempo:** Slow-medium, groove-based
- **Mood:** Nostalgic, dreamy, romantic

### level3_cozy.mp3
- **Vibe:** Warm music box melody, lo-fi beats, nostalgic
- **Length:** 2-3 minutes (loopable)
- **Reference:** Animal Crossing cozy room music + lo-fi hip hop
- **Tempo:** Slow, relaxed, comforting
- **Mood:** Intimate, personal, safe

### level4_battle.mp3
- **Vibe:** Epic orchestral + electronic, heroic intensity
- **Length:** 2-3 minutes (loopable)
- **Reference:** JJK/Solo Leveling battle themes
- **Tempo:** Fast, driving, adrenaline-pumping
- **Mood:** Epic, challenging, triumphant

### level5_finale.mp3
- **Vibe:** Emotional romantic orchestral, sweeping
- **Length:** 3-4 minutes (plays once, no loop)
- **Reference:** Your Name/Weathering With You climax
- **Tempo:** Starts slow, builds to triumphant, ends peaceful
- **Mood:** Climactic, emotional, transcendent

### music_room_ambient.mp3
- **Vibe:** Soft lo-fi piano, peaceful background
- **Length:** 3-5 minutes (loopable)
- **Volume:** Very quiet, background only
- **Mood:** Relaxing, contemplative

## SOUND EFFECTS (public/sounds/shadow-garden/sfx/)

All SFX should be short (0.2-2 seconds), punchy, and clear.

### UI Sounds
- **ui_click.mp3** - Satisfying button click (like mechanical keyboard)
- **ui_hover.mp3** - Soft tick or chime on hover
- **system_chime.mp3** - Solo Leveling system notification sound

### Match-3 Sounds
- **match3.mp3** - Soft pleasant chime (C note)
- **match4.mp3** - Medium chime (E note), slightly deeper
- **match5.mp3** - Grand chime (G note), most satisfying
- **combo.mp3** - Ascending musical scale for combos

### Power-Up Sounds
- **powerup_gojo.mp3** - Electric whoosh + reverb (Gojo's Infinity)
- **powerup_jinwoo.mp3** - Shadow whispers + deep bass
- **powerup_toji.mp3** - Sword slash + piercing sound
- **powerup_megumi.mp3** - Wolf howl + energy surge
- **powerup_anos.mp3** - Demonic energy + explosion
- **powerup_meliodas.mp3** - Sword clash + heroic fanfare

### Game Sounds
- **boss_hit.mp3** - Thud + creature whimper
- **boss_defeat.mp3** - Defeated cry fading away
- **level_complete.mp3** - Victory fanfare (2-3 seconds)
- **unlock.mp3** - Success chime with sparkle
- **domain_expansion.mp3** - Deep bass drop + reverb echo

## RECOMMENDED SOURCES

- **Epidemic Sound** - Premium royalty-free music library
- **Artlist** - High-quality music and SFX
- **YouTube Audio Library** - Free royalty-free music
- **Freesound.org** - Community sound effects
- **Zapsplat.com** - Free SFX downloads
- **Incompetech** - Creative Commons music by Kevin MacLeod

## FILE REQUIREMENTS

- **Format:** MP3 (best compatibility)
- **Bitrate:** 128kbps minimum, 192kbps recommended for music
- **Sample Rate:** 44.1kHz
- **Normalization:** Ensure consistent volume across all files
- **Loops:** Music tracks must loop seamlessly (fade in/out at exact points)

## TESTING CHECKLIST

- [ ] All 6 music tracks present and named correctly
- [ ] All 17 SFX files present and named correctly
- [ ] Music tracks loop without gaps or clicks
- [ ] Sound effects are appropriate length (not too long)
- [ ] Volume levels are consistent across all files
- [ ] Files play in both Chrome and Safari

---


===============================================================================
10. VISUAL ASSETS & STYLING (TAILWIND + STYLED-COMPONENTS)
===============================================================================

---
TAILWIND CONFIGURATION
---

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shadow Garden Theme
        'sg-midnight': '#191970',
        'sg-royal': '#7B2CBF',
        'sg-twilight': '#9D4EDD',
        'sg-gold': '#FFD700',
        'sg-shimmer': '#FFA500',
        'sg-pink': '#FFB6C1',
        'sg-rose': '#FF69B4',
        'sg-deep-rose': '#FF1493',
        'sg-red': '#E63946',
        
        // UI colors
        'system-blue': '#00BFFF',
        'shadow-purple': '#7B2CBF',
      },
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'bangers': ['Bangers', 'cursive'],
        'dancing': ['Dancing Script', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 215, 0, 1)',
            filter: 'brightness(1.2)'
          },
        },
      },
    },
  },
  plugins: [],
}

---
STYLED-COMPONENTS + TAILWIND HYBRID
---

// Example: Level container with both
import styled from 'styled-components';

const LevelContainer = styled.div.attrs({
  className: 'w-full h-screen overflow-hidden relative'
})`
  background: linear-gradient(180deg, #191970 0%, #0a0a2e 100%);
  
  /* Styled-components for complex animations */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, 
      rgba(255, 215, 0, 0.1) 0%, 
      transparent 50%
    );
    opacity: 0;
    transition: opacity 1s ease;
  }
  
  &.active::before {
    opacity: 1;
  }
`;

// Use Tailwind for layout, styled-components for animations
<LevelContainer className="flex items-center justify-center">
  {/* content */}
</LevelContainer>

---
SVG TILE ASSETS (EXAMPLE)
---

// public/assets/shadow-garden/tiles/cherry-blossom.svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="petal-gradient" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#FFB6C1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Center -->
  <circle cx="50" cy="50" r="8" fill="#FFD700"/>
  
  <!-- Petals (5 petals) -->
  <ellipse cx="50" cy="25" rx="12" ry="18" fill="url(#petal-gradient)" 
           transform="rotate(0 50 50)"/>
  <ellipse cx="50" cy="25" rx="12" ry="18" fill="url(#petal-gradient)" 
           transform="rotate(72 50 50)"/>
  <ellipse cx="50" cy="25" rx="12" ry="18" fill="url(#petal-gradient)" 
           transform="rotate(144 50 50)"/>
  <ellipse cx="50" cy="25" rx="12" ry="18" fill="url(#petal-gradient)" 
           transform="rotate(216 50 50)"/>
  <ellipse cx="50" cy="25" rx="12" ry="18" fill="url(#petal-gradient)" 
           transform="rotate(288 50 50)"/>
</svg>

// Similar SVG files for:
// - shadow-orb.svg (black sphere with purple glow)
// - six-eyes.svg (electric blue gem with eye pattern)
// - music-note.svg (golden musical note)
// - black-heart.svg (gothic heart with purple edges)
// - star-fragment.svg (white sparkle star)

---
CHARACTER SPRITE APPROACH
---

RECOMMENDATION: Use Character Creator Tool (Option A from questions)

Suggested tool: Picrew or VRoid for anime avatars

For Faith's avatar states:
1. Create base character design in Picrew
2. Export different expressions:
   - faith-avatar.svg (neutral/idle)
   - faith-happy.svg (smile, sparkles)
   - faith-excited.svg (wide eyes, energy aura)
   - faith-love.svg (blush, hearts)
   - faith-determined.svg (serious, power stance)
   - faith-victory.svg (anime freeze frame pose)

3. For boss sprites - use simple SVG illustrations:
   - Round shapes with facial expressions
   - Add glow effects via CSS filters
   - Example: Hesitation = gray blob with worried eyes

---
BACKGROUND GRADIENTS (CSS)
---

// src/styles/shadowGardenStyles.js
export const levelBackgrounds = {
  level1: `
    background: linear-gradient(180deg, #FFB6C1 0%, #87CEEB 100%);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255, 192, 203, 0.3) 0%, transparent 50%);
    }
  `,
  
  level2: `
    background: linear-gradient(180deg, #FF6B35 0%, #7B2CBF 100%);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 100px,
        rgba(255, 215, 0, 0.05) 100px,
        rgba(255, 215, 0, 0.05) 200px
      );
    }
  `,
  
  level3: `
    background: linear-gradient(180deg, #F4E8D0 0%, #E8D7B8 100%);
    
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(
        circle,
        rgba(139, 69, 19, 0.1) 1px,
        transparent 1px
      );
      background-size: 50px 50px;
    }
  `,
  
  level4: `
    background: linear-gradient(180deg, #000000 0%, #4B0082 100%);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(45deg, transparent 48%, rgba(123, 44, 191, 0.3) 50%, transparent 52%),
        linear-gradient(-45deg, transparent 48%, rgba(123, 44, 191, 0.3) 50%, transparent 52%);
      background-size: 100px 100px;
      animation: pulse 3s ease-in-out infinite;
    }
  `,
  
  level5: `
    background: radial-gradient(ellipse at center, 
      #7B2CBF 0%, 
      #191970 50%, 
      #000000 100%
    );
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      width: 200%;
      height: 200%;
      top: -50%;
      left: -50%;
      background-image: 
        radial-gradient(circle, white 1px, transparent 1px);
      background-size: 50px 50px;
      animation: rotate 120s linear infinite;
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `
};


===============================================================================
11. GSAP ANIMATION SYSTEM
===============================================================================

---
GSAP SETUP & PRESETS
---

// src/utils/animations.js
import gsap from 'gsap';

// GSAP defaults
gsap.defaults({
  ease: 'power2.out',
  duration: 0.5
});

---
ANIMATION PRESETS
---

export const animations = {
  // Tile animations
  tileMatch: (element) => {
    return gsap.to(element, {
      scale: 0,
      rotation: 360,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    });
  },
  
  tileDrop: (element, delay = 0) => {
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
  
  tileSwap: (element1, element2) => {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    const tl = gsap.timeline();
    
    tl.to(element1, {
      x: rect2.left - rect1.left,
      y: rect2.top - rect1.top,
      duration: 0.3,
      ease: 'power2.inOut'
    }, 0);
    
    tl.to(element2, {
      x: rect1.left - rect2.left,
      y: rect1.top - rect2.top,
      duration: 0.3,
      ease: 'power2.inOut'
    }, 0);
    
    return tl;
  },
  
  // UI animations
  systemWindowIn: (element) => {
    return gsap.fromTo(element,
      { 
        y: -100,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }
    );
  },
  
  systemWindowOut: (element) => {
    return gsap.to(element, {
      y: -100,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in'
    });
  },
  
  fadeIn: (element, duration = 0.5) => {
    return gsap.fromTo(element,
      { opacity: 0 },
      { opacity: 1, duration }
    );
  },
  
  fadeOut: (element, duration = 0.5) => {
    return gsap.to(element, {
      opacity: 0,
      duration
    });
  },
  
  // Special effects
  screenFlash: (color = '#FFFFFF', duration = 0.2) => {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${color};
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(flash);
    
    gsap.fromTo(flash,
      { opacity: 0.7 },
      {
        opacity: 0,
        duration,
        onComplete: () => flash.remove()
      }
    );
  },
  
  screenShake: (intensity = 10, duration = 0.5) => {
    const container = document.getElementById('game-board');
    
    return gsap.to(container, {
      x: `+=${intensity}`,
      y: `+=${intensity}`,
      yoyo: true,
      repeat: 5,
      duration: duration / 6,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.set(container, { x: 0, y: 0 });
      }
    });
  },
  
  // Domain Expansion sequence
  domainExpansion: () => {
    const tl = gsap.timeline();
    
    // 1. Screen goes black
    const blackScreen = document.createElement('div');
    blackScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(blackScreen);
    
    tl.fromTo(blackScreen,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
    
    // 2. "DOMAIN EXPANSION" text appears
    const text = document.createElement('div');
    text.style.cssText = `
      position: fixed;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Bangers', cursive;
      font-size: 72px;
      color: #FFD700;
      text-shadow: 0 0 40px #FFA500;
      z-index: 10001;
      text-align: center;
      white-space: nowrap;
    `;
    text.innerHTML = 'DOMAIN EXPANSION:<br/>INFINITE LOVE';
    document.body.appendChild(text);
    
    tl.fromTo(text,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power4.out' },
      '+=0.5'
    );
    
    // 3. Color explosion
    tl.to(blackScreen, {
      background: 'linear-gradient(135deg, #FF1493 0%, #FFD700 50%, #9D4EDD 100%)',
      duration: 1
    }, '+=0.5');
    
    // 4. Fade out
    tl.to([blackScreen, text], {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        blackScreen.remove();
        text.remove();
      }
    }, '+=1');
    
    return tl;
  },
  
  // Particle burst
  particleBurst: (x, y, color = '#FFD700', count = 30) => {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        background: ${color};
        border-radius: 50%;
        z-index: 1000;
        pointer-events: none;
      `;
      document.body.appendChild(particle);
      particles.push(particle);
      
      const angle = (Math.PI * 2 * i) / count;
      const distance = Math.random() * 100 + 50;
      
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        duration: Math.random() * 0.5 + 0.5,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }
};

---
GSAP HOOK FOR EASY USE
---

// src/hooks/useGSAP.js
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { animations } from '../utils/animations';

export const useGSAP = () => {
  const contextRef = useRef(null);
  
  useEffect(() => {
    contextRef.current = gsap.context(() => {});
    
    return () => contextRef.current.revert();
  }, []);
  
  return {
    gsap,
    animations,
    context: contextRef.current
  };
};

---
VARIABLE SPEED ANIMATION SYSTEM
---

// Cascade speed varies based on combo
export const getCascadeSpeed = (comboCount) => {
  if (comboCount === 0) return 0.5; // Normal speed
  if (comboCount <= 3) return 0.4;  // Slightly faster
  if (comboCount <= 6) return 0.3;  // Faster
  return 0.2;  // Maximum speed for 7+ combos
};

// Power-up animations slower for dramatic effect
export const getPowerUpSpeed = (powerId) => {
  const speeds = {
    0: 1.0,  // Six Eyes - dramatic
    1: 1.2,  // Shadow Army - slightly faster
    2: 2.0,  // Ruler's Authority - slow time
    3: 0.8,  // Inverted Spear - quick
    4: 1.0,  // Ten Shadows - normal
    5: 1.5,  // Magic Eyes - dramatic
    6: 0.6   // Full Counter - fast reflection
  };
  
  return speeds[powerId] || 1.0;
};

// Use in animations:
gsap.to(element, {
  ...animationProps,
  duration: baseDuration * getCascadeSpeed(comboCount)
});


===============================================================================
12. TUTORIAL SYSTEM IMPLEMENTATION
===============================================================================

---
TUTORIAL DATA
---

// src/data/shadow-garden/tutorialSteps.js
export const tutorialSteps = [
  {
    id: 'welcome',
    type: 'modal',
    title: 'Welcome, Hunter Faith!',
    content: `You have been chosen to journey through 5 mystical Garden Realms. 
    
    Match sacred symbols, wield legendary powers, and defeat the bosses that stand between you and the Heart Domain.
    
    Are you ready?`,
    highlight: null,
    position: 'center',
    actions: [
      { text: 'Let\'s Go!', next: 'board-intro' },
      { text: 'Skip Tutorial', next: 'skip' }
    ]
  },
  
  {
    id: 'board-intro',
    type: 'tooltip',
    title: 'The Game Board',
    content: `This is where you'll match symbols. Swap two adjacent pieces to create matches of 3 or more!`,
    highlight: '#game-board',
    position: 'bottom',
    actions: [
      { text: 'Got it', next: 'swap-demo' }
    ]
  },
  
  {
    id: 'swap-demo',
    type: 'interactive',
    title: 'Make Your First Match',
    content: `Try swapping two pieces to make a match of 3! Just tap one piece, then tap an adjacent piece.`,
    highlight: '#game-board',
    position: 'top',
    waitFor: 'first-match',
    actions: [
      { text: 'Skip', next: 'power-intro' }
    ]
  },
  
  {
    id: 'power-intro',
    type: 'tooltip',
    title: 'Legendary Powers',
    content: `These are your power-ups! Each is inspired by legendary anime characters. You start with two unlocked. Click one to activate it!`,
    highlight: '#power-bar',
    position: 'left',
    actions: [
      { text: 'Next', next: 'boss-intro' }
    ]
  },
  
  {
    id: 'boss-intro',
    type: 'tooltip',
    title: 'The Boss',
    content: `This is Hesitation, your first opponent. Make matches to damage it and reduce its health!`,
    highlight: '#boss-bar',
    position: 'bottom',
    actions: [
      { text: 'Next', next: 'score-intro' }
    ]
  },
  
  {
    id: 'score-intro',
    type: 'tooltip',
    title: 'Your Score',
    content: `Reach the target score to defeat the boss and complete the level!`,
    highlight: '#score-display',
    position: 'bottom',
    actions: [
      { text: 'Next', next: 'special-pieces' }
    ]
  },
  
  {
    id: 'special-pieces',
    type: 'modal',
    title: 'Special Pieces',
    content: `Match 4 pieces in a row to create a Striker (clears a line)
    
    Match 5 in an L or T shape to create a Domain piece (clears 3x3)
    
    Match 5 in a straight line to create a Monarch piece (clears all of one color)`,
    highlight: null,
    position: 'center',
    actions: [
      { text: 'Awesome!', next: 'mystery-box' }
    ]
  },
  
  {
    id: 'mystery-box',
    type: 'tooltip',
    title: 'Mystery Doll Box',
    content: `Need help? Click this once per level to get a random power-up or blessing!`,
    highlight: '#mystery-box',
    position: 'top',
    actions: [
      { text: 'Got it!', next: 'final-tip' }
    ]
  },
  
  {
    id: 'final-tip',
    type: 'modal',
    title: 'One Last Thing...',
    content: `Remember: this journey was made with love just for you.
    
    Take your time, enjoy the experience, and know that every detail was crafted with you in mind.
    
    Now go show these bosses what the Shadow Monarch is made of! ✨`,
    highlight: null,
    position: 'center',
    actions: [
      { text: 'Let\'s Do This! 💪', next: 'complete' }
    ]
  }
];

---
TUTORIAL OVERLAY COMPONENT
---

// src/components/shadow-garden/tutorial/TutorialOverlay.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import gsap from 'gsap';
import { completeTutorial } from '../../../store/slices/shadowGardenSlice';
import { tutorialSteps } from '../../../data/shadow-garden/tutorialSteps';
import Tooltip from './Tooltip';

const TutorialOverlay = ({ onComplete }) => {
  const dispatch = useDispatch();
  const [currentStepId, setCurrentStepId] = useState('welcome');
  const [highlightedElement, setHighlightedElement] = useState(null);
  
  const currentStep = tutorialSteps.find(step => step.id === currentStepId);
  
  useEffect(() => {
    if (currentStep?.highlight) {
      const element = document.querySelector(currentStep.highlight);
      setHighlightedElement(element);
      
      if (element) {
        // Create highlight effect
        element.style.position = 'relative';
        element.style.zIndex = '10001';
        
        gsap.to(element, {
          boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.8)',
          duration: 0.5,
          yoyo: true,
          repeat: -1
        });
      }
    } else {
      if (highlightedElement) {
        gsap.killTweensOf(highlightedElement);
        highlightedElement.style.boxShadow = '';
        highlightedElement.style.zIndex = '';
      }
      setHighlightedElement(null);
    }
  }, [currentStep]);
  
  const handleAction = (action) => {
    if (action.next === 'skip' || action.next === 'complete') {
      dispatch(completeTutorial());
      onComplete();
    } else {
      setCurrentStepId(action.next);
    }
  };
  
  // For interactive steps, wait for specific events
  useEffect(() => {
    if (currentStep?.type === 'interactive' && currentStep?.waitFor) {
      const handleEvent = (e) => {
        if (e.detail === currentStep.waitFor) {
          // Auto-advance after the waited event
          setTimeout(() => {
            const nextAction = currentStep.actions.find(a => a.text !== 'Skip');
            if (nextAction) handleAction(nextAction);
          }, 500);
        }
      };
      
      window.addEventListener('tutorial-event', handleEvent);
      return () => window.removeEventListener('tutorial-event', handleEvent);
    }
  }, [currentStep]);
  
  if (!currentStep) return null;
  
  return (
    <>
      <Overlay onClick={() => {}} />
      
      {currentStep.type === 'modal' ? (
        <ModalContainer>
          <Modal>
            <ModalTitle>{currentStep.title}</ModalTitle>
            <ModalContent>{currentStep.content}</ModalContent>
            <ActionButtons>
              {currentStep.actions.map(action => (
                <ActionButton 
                  key={action.text}
                  onClick={() => handleAction(action)}
                >
                  {action.text}
                </ActionButton>
              ))}
            </ActionButtons>
          </Modal>
        </ModalContainer>
      ) : (
        <Tooltip
          step={currentStep}
          onAction={handleAction}
        />
      )}
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10002;
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 3px solid #FFD700;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.5s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h2`
  font-family: 'Bangers', cursive;
  font-size: 48px;
  color: #FFD700;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
`;

const ModalContent = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  color: white;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 30px;
  white-space: pre-line;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 15px 40px;
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.6);
  }
`;

export default TutorialOverlay;

---
TOOLTIP COMPONENT
---

// src/components/shadow-garden/tutorial/Tooltip.jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Tooltip = ({ step, onAction }) => {
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    if (step.highlight && tooltipRef.current) {
      const targetElement = document.querySelector(step.highlight);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltip = tooltipRef.current;
        
        // Position tooltip based on step.position
        switch(step.position) {
          case 'top':
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 20) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            break;
          case 'bottom':
            tooltip.style.top = (rect.bottom + 20) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            break;
          case 'left':
            tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + 'px';
            tooltip.style.left = (rect.left - tooltip.offsetWidth - 20) + 'px';
            break;
          case 'right':
            tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + 'px';
            tooltip.style.left = (rect.right + 20) + 'px';
            break;
          default:
            break;
        }
      }
    }
  }, [step]);
  
  return (
    <TooltipContainer ref={tooltipRef}>
      <TooltipArrow position={step.position} />
      <TooltipTitle>{step.title}</TooltipTitle>
      <TooltipContent>{step.content}</TooltipContent>
      <TooltipActions>
        {step.actions.map(action => (
          <TooltipButton 
            key={action.text}
            onClick={() => onAction(action)}
          >
            {action.text}
          </TooltipButton>
        ))}
      </TooltipActions>
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #FFD700;
  border-radius: 15px;
  padding: 20px;
  max-width: 350px;
  z-index: 10002;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const TooltipArrow = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  
  ${props => {
    switch(props.position) {
      case 'top':
        return `
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px 10px 0 10px;
          border-color: #FFD700 transparent transparent transparent;
        `;
      case 'bottom':
        return `
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 0 10px 10px 10px;
          border-color: transparent transparent #FFD700 transparent;
        `;
      case 'left':
        return `
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 10px 0 10px 10px;
          border-color: transparent transparent transparent #FFD700;
        `;
      case 'right':
        return `
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 10px 10px 10px 0;
          border-color: transparent #FFD700 transparent transparent;
        `;
      default:
        return '';
    }
  }}
`;

const TooltipTitle = styled.h3`
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  color: #FFD700;
  margin-bottom: 10px;
`;

const TooltipContent = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  color: white;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const TooltipActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const TooltipButton = styled.button`
  padding: 8px 20px;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  font-weight: 600;
  background: #FFD700;
  border: none;
  border-radius: 20px;
  color: #000;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #FFA500;
    transform: scale(1.05);
  }
`;

export default Tooltip;

---
TRIGGERING TUTORIAL EVENTS
---

// In main game component, dispatch events for tutorial tracking:

// When user makes first match:
window.dispatchEvent(new CustomEvent('tutorial-event', { 
  detail: 'first-match' 
}));

// When user uses first power:
window.dispatchEvent(new CustomEvent('tutorial-event', { 
  detail: 'first-power' 
}));


===============================================================================
13. LOADING SCREENS
===============================================================================

---
HUB LOADING SCREEN
---

// src/components/shared/LoadingScreen.jsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingScreen = ({ type }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  if (type === 'hub') {
    return (
      <HubLoadingContainer>
        <LoadingText>Loading Cozy Bedroom...</LoadingText>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      </HubLoadingContainer>
    );
  }
  
  if (type === 'shadow-garden') {
    return (
      <ShadowGardenLoadingContainer>
        <SystemWindow>
          <SystemHeader>SYSTEM LOADING...</SystemHeader>
          <SystemBody>
            <LoadingIcon>⚔️</LoadingIcon>
            <SystemText>Initializing Hunter System</SystemText>
            <SystemText>Loading Garden Realms</SystemText>
            <SystemText>Calibrating Legendary Powers</SystemText>
            <ProgressBar>
              <ProgressFill progress={progress} glow />
            </ProgressBar>
            <SystemProgress>{Math.floor(progress)}%</SystemProgress>
          </SystemBody>
        </SystemWindow>
      </ShadowGardenLoadingContainer>
    );
  }
  
  // Default loading
  return (
    <DefaultLoadingContainer>
      <Spinner />
      <LoadingText>Loading...</LoadingText>
    </DefaultLoadingContainer>
  );
};

// Styled Components

const HubLoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
`;

const ShadowGardenLoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #000000 0%, #191970 100%);
`;

const DefaultLoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const SystemWindow = styled.div`
  background: rgba(0, 20, 40, 0.95);
  border: 3px solid #00BFFF;
  border-radius: 10px;
  padding: 0;
  min-width: 500px;
  box-shadow: 0 0 40px rgba(0, 191, 255, 0.5);
  
  @media (max-width: 768px) {
    min-width: 90%;
  }
`;

const SystemHeader = styled.div`
  background: linear-gradient(90deg, #00BFFF 0%, #0080FF 100%);
  padding: 15px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 18px;
  color: white;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
`;

const SystemBody = styled.div`
  padding: 40px;
  text-align: center;
`;

const LoadingIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const SystemText = styled.div`
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  color: #00BFFF;
  margin-bottom: 10px;
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: calc(var(--index) * 0.3s);
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  &:nth-child(2) { --index: 0; }
  &:nth-child(3) { --index: 1; }
  &:nth-child(4) { --index: 2; }
`;

const LoadingText = styled.div`
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  color: white;
  margin-bottom: 30px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 20px;
`;

const ProgressFill = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: ${props => props.glow 
    ? 'linear-gradient(90deg, #00BFFF 0%, #FFD700 100%)'
    : 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)'
  };
  transition: width 0.3s ease;
  ${props => props.glow && `
    box-shadow: 0 0 10px #00BFFF;
  `}
`;

const SystemProgress = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 24px;
  color: #FFD700;
  margin-top: 15px;
  text-shadow: 0 0 10px #FFD700;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #FFD700;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

export default LoadingScreen;


===============================================================================
14. PERFORMANCE OPTIMIZATION
===============================================================================

---
PRELOADING STRATEGY
---

// Preload per-game assets
const preloadAssets = async (assetList) => {
  const promises = assetList.map(asset => {
    if (asset.endsWith('.mp3')) {
      // Audio preloading handled by Howler
      return Promise.resolve();
    } else {
      // Image preloading
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = asset;
      });
    }
  });
  
  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Asset preload failed:', error);
  }
};

---
PERFORMANCE PRIORITIES (Balanced Approach)
---

1. TARGET: 60fps on modern devices, 30fps minimum on older devices
2. STRATEGY: Adaptive quality based on device detection

// Detect device performance tier
const getPerformanceTier = () => {
  const memory = navigator.deviceMemory || 4; // GB
  const cores = navigator.hardwareConcurrency || 2;
  
  if (memory >= 8 && cores >= 4) return 'high';
  if (memory >= 4 && cores >= 2) return 'medium';
  return 'low';
};

// Adjust settings based on tier
const performanceSettings = {
  high: {
    particleCount: 50,
    enableGlow: true,
    enableShadows: true,
    animationQuality: 'high'
  },
  medium: {
    particleCount: 30,
    enableGlow: true,
    enableShadows: false,
    animationQuality: 'medium'
  },
  low: {
    particleCount: 15,
    enableGlow: false,
    enableShadows: false,
    animationQuality: 'low'
  }
};

const tier = getPerformanceTier();
const settings = performanceSettings[tier];

// Use settings in particle effects:
if (settings.enableGlow) {
  element.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
}

---
OPTIMIZE GSAP ANIMATIONS
---

// Use will-change CSS property for animated elements
const animatedElement = styled.div`
  will-change: transform, opacity;
`;

// Kill GSAP tweens when unmounting
useEffect(() => {
  return () => {
    gsap.killTweensOf(elementRef.current);
  };
}, []);

// Use GSAP ticker for game loop instead of requestAnimationFrame
gsap.ticker.add((time, deltaTime) => {
  // Update game logic
  // deltaTime is in seconds
});

---

