# 🗺️ MASTER IMPLEMENTATION PLAN: CELESTIAL VALENTINE UPGRADE

## 🎯 Objective
Transform the standalone "Celestial Valentine" app into a multi-game "Hub" experience, featuring the original Valentine's game (migrated with zero logic changes) and a new, feature-rich "Shadow Garden" Match-3 RPG.

## 📅 Timeline: 3 Days (Part-Time)
*   **Day 1:** Phase 1 (Foundation) & Phase 2 (Game Engine)
*   **Day 2:** Phase 3 (Visuals/Audio) & Phase 4 (Advanced Mechanics)
*   **Day 3:** Phase 5 (Polish) & Testing/Deployment

## 🏗️ Phase Overview

### [PHASE 1: FOUNDATION & HUB](./01_PHASE_1_FOUNDATION.md)
*   **Goal:** Set up the "mother app" structure.
*   **Key Tasks:**
    *   Install dependencies (Redux Toolkit, Router, Tailwind, Howler, GSAP).
    *   Configure Redux Store & LocalStorage middleware.
    *   Refactor `App.js` into a routing container.
    *   Wrap existing Valentine's game into a `routes/ValentineGame.jsx` component.
    *   Build the "Cozy Bedroom" Hub interface.

### [PHASE 2: SHADOW GARDEN ENGINE](./02_PHASE_2_GAME_ENGINE.md)
*   **Goal:** Build the core playable Match-3 system.
*   **Key Tasks:**
    *   Create `shadowGardenSlice` in Redux.
    *   Implement `useMatch3` hook (grid generation, swapping, matching logic).
    *   Build basic Board and Tile components.
    *   Implement scoring and combo system.

### [PHASE 3: VISUALS & AUDIO](./03_PHASE_3_VISUALS_AUDIO.md)
*   **Goal:** Make it look and sound like a game.
*   **Key Tasks:**
    *   Integrate SVG/CSS placeholders for assets (Faith avatar, tiles, bosses).
    *   Set up `SoundManager` with Howler.js.
    *   Add background music and SFX.
    *   Implement GSAP animations for tile movements and UI interactions.

### [PHASE 4: ADVANCED MECHANICS](./04_PHASE_4_ADVANCED_MECHANICS.md)
*   **Goal:** Add the "RPG" and "Magic" elements.
*   **Key Tasks:**
    *   Implement Power-Up system (Six Eyes, Shadow Army, etc.).
    *   Build Boss battle logic (Health bars, defeat conditions).
    *   Create the "Domain Expansion" cinematic sequence (Canvas/CSS).
    *   Implement the "Mystery Doll Box" (RNG rewards).

### [PHASE 5: POLISH & DEPLOY](./05_PHASE_5_POLISH_DEPLOY.md)
*   **Goal:** Finalize for user delivery.
*   **Key Tasks:**
    *   Add Tutorial Overlay system.
    *   Create Loading Screens (contextual per game).
    *   Ensure Mobile Responsiveness (touch handling).
    *   Add Debug Mode.
    *   Final deployment check.

## 🛡️ Critical Constraints
1.  **Zero Changes to Valentine Logic:** The original game logic must remain untouched, only wrapped for routing.
2.  **State Management:** All state (including migrated Valentine progress) moves to Redux.
3.  **Assets:** Use high-quality SVG/CSS placeholders for now.
4.  **Animations:** Use GSAP + Canvas hybrid for performance and visual impact.

## 🚀 Getting Started
Begin with **Phase 1** to establish the architectural groundwork.
