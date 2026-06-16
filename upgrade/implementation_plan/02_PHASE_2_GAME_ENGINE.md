# 🧩 PHASE 2: SHADOW GARDEN ENGINE (PRECISION)

## 🎯 Objectives
*   Implement the core Match-3 logic with the 6 specific GDD symbols.
*   Build the Special Piece detection system (Match 4/5).
*   Implement the dynamic Combo, Scoring, and Rhythm systems.

## 📝 Task List

### 2.1 Symbol & Board Definition
- [ ] **6 Symbol Types (GDD Constants):**
  1. `🌸 Cherry Blossom` (Pink)
  2. `⚫ Shadow Orb` (Black)
  3. `💙 Six Eyes Gem` (Electric Blue)
  4. `🎵 Musical Note` (Golden)
  5. `🖤 Black Heart` (Deep Purple)
  6. `✨ Star Fragment` (White/Silver)
- [ ] **Special Tile: `Doll Piece` (Level 3):** 3D rendered special pieces that give 2x points.
- [ ] **Tile Component:** Implement "Idle Breathing" (scale 1.0 <-> 1.05) via GSAP `repeat: -1`.

### 2.2 Core Logic (`useMatch3.js`)
- [ ] **Special Piece Detection:**
  *   **Match 4 (Line):** Create `Striker` (Electricity aura). Clears row/column.
  *   **Match 5 (L/T Shape):** Create `Domain` (Purple-black orb, 3x3 explosion).
  *   **Match 5+ (Straight):** Create `Monarch` (Crown symbol, clears all of one color).
- [ ] **Rhythm Bonus (Level 2):** 
  *   Matches synced with the background beat glow gold and give +50 points.
- [ ] **Combo System:**
  *   Counter increments on cascades.
  *   **Rewards:** 10+ Combo triggers temporary x2 Score Multiplier + "EXCELLENT!" popup.
- [ ] **Scoring:** 3-match = 100, 4-match = 300, 5-match = 500 (multiplied by combo).

### 2.3 Boss System (Integration)
- [ ] **Boss Stats:** Health bar based on current level (L1: 5k, L2: 8k, etc.).
- [ ] **Animations:**
  *   `onMatch`: Boss recoils/shakes.
  *   `onCombo`: Boss plays "panicked" animation + worry sweat.
  *   `onDefeat`: Health bar explodes, transition to victory.

### 2.4 Faith's Avatar Integration
- [ ] **States:** `IDLE`, `HAPPY` (Match), `EXCITED` (Combo), `DETERMINED` (Boss Low HP).
- [ ] **Reactions:** Blushing effect when system messages (Love Notes) arrive.

## ✅ Definition of Done
*   8x8 Board renders with all 6 GDD-accurate symbols.
*   Rhythm bonus triggers on beat-synced matches.
*   Special pieces (Striker, Domain, Monarch) function as intended.
*   Combo counter scales font-size and color (White -> Gold -> Purple).
*   Boss health depletes correctly on matches.
*   Faith's avatar reacts in real-time to matches.
