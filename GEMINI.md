# Celestial Valentine - Project Context

## Project Overview

**Celestial Valentine** is a sophisticated, interactive React application designed as a digital Valentine's Day gift. It features a narrative-driven experience that progresses through five distinct "phases," guiding the user from a playful proposal to a heartfelt letter reveal.

### Key Features
*   **Interactive Narrative:** Users progress through locked phases that unlock based on time (Valentine's Day) and user interaction.
*   **Rich Media:** Utilizes `Canvas API` for fireworks/particles and `Web Audio API` for sound effects and background music.
*   **Persistence:** Uses `localStorage` to save the user's progress (completed constellations, phase status), allowing them to return later.
*   **Responsive Design:** Fully optimized for both desktop and mobile touch interfaces.

### Tech Stack
*   **Framework:** React 18
*   **Styling:** `styled-components` (CSS-in-JS)
*   **Build Tool:** `react-scripts` (Create React App)
*   **Utilities:** `html2canvas` (for screenshot functionality)

---

## Architecture & Phases

The application logic is primarily driven by `src/App.js`, which orchestrates the state machine for the following phases:

1.  **Phase 1: The Playful Ask** (`src/components/phases/Phase1_Ask.jsx`)
    *   A "NO" button that evades the mouse/touch.
    *   A "YES" button that triggers a celebration.
2.  **Phase 2: The Countdown** (`src/components/phases/Phase2_Countdown.jsx`)
    *   Displays a countdown timer to Feb 14, 2026.
    *   Dynamic background color changes based on days remaining.
3.  **Phase 3: The Fireworks** (`src/components/phases/Phase3_Fireworks.jsx`)
    *   Canvas-based particle system for heart-shaped fireworks.
4.  **Phase 4: The Constellations** (`src/components/phases/Phase4_Constellations.jsx`)
    *   A puzzle game where users connect stars to form letters.
    *   Spells out "Faith & Alvin ❤️".
    *   Randomly triggers "Love Notes" popups during gameplay.
5.  **Phase 5: The Love Letter** (`src/components/phases/Phase5_Letter.jsx`)
    *   A scrolling parchment effect with text that shimmers into view.
    *   Includes a screenshot feature.

---

## Building & Running

### Prerequisites
*   Node.js (v14+)
*   npm

### Commands

*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Start Development Server:**
    ```bash
    npm start
    ```
    Runs the app in development mode at `http://localhost:3000`.
*   **Build for Production:**
    ```bash
    npm run build
    ```
    Bundles the app into the `build/` folder.

---

## Development Conventions

### File Structure
*   **`src/data/`**: User-editable content.
    *   `loveNotes.js`: Array of strings for the constellation phase.
    *   `finalLetter.js`: The long-form text for the final phase.
*   **`src/hooks/`**: Custom React hooks.
    *   `useSound.js`: Manages audio context, muting, and SFX loading.
    *   `useLocalStorage.js`: Persists state to browser storage.
*   **`src/utils/`**: Shared logic.
    *   `constants.js`: Configuration (colors, fonts, target dates).
    *   `constellationData.js`: Coordinates for the star puzzles.

### Styling
*   All styling is done via **Styled Components**.
*   **Global Styles:** Defined in `src/styles/GlobalStyles.js`. This handles resets, scrollbar styling, and mobile touch behaviors.
*   **Theme:** Colors and fonts are centralized in `src/utils/constants.js` but manually imported where needed.

### Sound System
*   Sounds are located in `public/sounds/`.
*   The `SoundManager` class (singleton) handles audio playback to prevent overlapping/clipping issues.
*   **Requirement:** All 12 expected sound files must be present in `public/sounds/` for the app to function without console errors.

### Configuration
*   **Valentine's Date:** configured in `src/utils/constants.js` as `VALENTINE_DATE`.
