# 🏗️ PHASE 1: FOUNDATION & HUB (REFINED)

## 🎯 Objectives
*   Establish the project structure for the multi-game Hub.
*   Migrate existing Valentine logic to Redux with **100% data compatibility**.
*   Build the high-fidelity "Cozy Bedroom" Hub as per GDD specifications.

## 📝 Task List

### 1.1 Tech Stack & Environment
- [ ] **Dependency Injection:**
  ```bash
  npm install react-router-dom @reduxjs/toolkit react-redux howler gsap
  npm install -D tailwindcss autoprefixer postcss
  npx tailwindcss init -p
  ```
- [ ] **Tailwind Theme:** Define `sg-pink`, `sg-midnight`, `sg-purple`, `sg-gold` in `tailwind.config.js`.
- [ ] **Global CSS:** Add fonts (`Orbitron`, `Quicksand`, `Bangers`, `Dancing Script`, `Share Tech Mono`) via Google Fonts in `index.html`.

### 1.2 Redux Architecture (Precision State)
- [ ] **`valentineSlice`:** 
  *   Mirrors `STORAGE_KEYS.progress` exactly (`phase`, `acceptedDate`, `hasSeenFireworks`, `constellationsCompleted`, `viewedNotes`, `completionDate`).
  *   Action: `migrateFromLocalStorage` to seed state on first boot.
- [ ] **`hubSlice`:** Tracks `isLaptopZoomed`, `activePoster` (hover state), `ambientMuted`.
- [ ] **`shadowGardenSlice`:** Initial structure for `currentLevel`, `unlockedPowers` [0,1], `stats`.
- [ ] **Middleware:** `localStorageMiddleware.js` for automatic persistence of all slices.

### 1.3 The "Cozy Bedroom" Hub (GDD Specs)
- [ ] **Component: `Bedroom`**
  *   **Desk (Left):** With open Laptop (clickable).
  *   **Lamp:** Warm yellow glow effect using CSS `box-shadow`.
  *   **Posters:** 3 Interactive frames (Gojo, Given, Solo Leveling).
    *   *Effect:* Subtle breathing/glowing animations via GSAP.
  *   **Window:** Night sky with CSS-twinkling stars.
- [ ] **Component: `LaptopView`**
  *   **Animation:** GSAP zoom-in from Desk to full screen on click.
  *   **Interface:** Two App Icons side-by-side.
    *   *Icon 1:* "Written in the Stars" (Purple/Midnight, heart constellation). Status: `Completed`.
    *   *Icon 2:* "Shadow Garden" (Black rose, system frame). Status: `NEW!`.
- [ ] **Audio:** Play `hub_lofi.mp3` at 0.3 volume. Trigger **System Chime (Solo Leveling style)** on game launch.

### 1.4 Route Migration
- [ ] **`routes/ValentineGame.jsx`:**
  *   Wrap `src/components/phases/*` with the existing state machine logic.
  *   **Refactor:** Connect `App.js` logic to `valentineSlice` selectors/dispatch.
  *   **Exit:** Add a floating heart icon ("Exit to Hub") in the corner.

## ✅ Definition of Done
*   App boots to the lo-fi bedroom.
*   Posters "breathe" with glowing light.
*   Laptop zooms in smoothly to show two games.
*   Launching "Written in the Stars" loads Faith's *current* progress from her original playthrough.
*   System chime plays when entering a game.
*   Redux state updates are persisted correctly.
