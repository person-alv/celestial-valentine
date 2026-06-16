# ⚡ PHASE 4: ADVANCED MECHANICS (PRECISION)

## 🎯 Objectives
*   Implement the 7 Legendary Powers with GDD-accurate visual triggers and technical precision.
*   Build the Domain Expansion cinematic.
*   Implement the Mystery Doll Box & Love Note system.

## 📝 Task List

### 4.1 The 7 Legendary Powers (GDD & Tech Doc Part 2 Alignment)
- [ ] **Power 1: Six Eyes (Gojo)** -> Visual: Electric blue eyes + hand sign. Effect: Clear entire horizontal row.
- [ ] **Power 2: Shadow Army (Jinwoo)** -> Visual: "Arise" gesture + shadow wisps. Effect: Summons 8-12 shadows to destroy random pieces.
- [ ] **Power 3: Ruler's Authority (Jinwoo)** -> Visual: Time freeze (10s) + Purple hand. Effect: **Free swap ANY two pieces** (ignoring adjacency).
- [ ] **Power 4: Inverted Spear (Toji)** -> Visual: Green spear drop. Effect: **Faith selects one color**; clears ALL pieces of that color.
- [ ] **Power 5: Ten Shadows (Megumi)** -> Visual: Divine Dogs silhouettes in corners + Blue aura on score. Effect: **Doubles points for 15s**.
- [ ] **Power 6: Magic Eyes (Anos)** -> Visual: Crimson spiral eyes + crimson lightning connecting corners. Effect: Destroys **4 corners AND all adjacent**.
- [ ] **Power 7: Full Counter (Meliodas)** -> Visual: Broken sword + gold swirl + "FULL COUNTER!" text. Effect: Reflects last move with **3x effectiveness**. *Constraint:* Must be used within **3s** of a match.

### 4.2 Mystery Doll Box (S-Rank Item)
- [ ] **Trigger:** "Request Gift" button with Alvin's Blessing animation.
- [ ] **RNG (33/33/33):**
  1. **Temp Power:** 1 immediate use of a locked power.
  2. **Alvin's Blessing:** Clear lowest scoring type + Alvin avatar wink ("I got you, babe").
  3. **Refill:** +1 use to an unlocked power.

### 4.3 Domain Expansion: "Infinite Love"
- [ ] **Trigger:** Love Meter (Level 5) reaches 100%.
- [ ] **5-Step Cinematic:**
  1. **Activation:** Faith avatar grows, eyes glow multi-color.
  2. **Proclamation:** Black screen, "DOMAIN EXPANSION: INFINITE LOVE" (Solo Leveling frame).
  3. **Transformation:** Swirling color vortex, levitating pieces.
  4. **Annihilation:** Hearts spiral through the Final Trial Boss.
  5. **Revelation:** Heart Domain opening, golden light.

### 4.4 Collection & System Messages
- [ ] **Love Notes:** 3 Solo Leveling-style windows sent by "Alvin ❤️" (L1 start, L3 mid, L5 start).
- [ ] **Gallery:** System to track Photos (5), Voice Notes (5), and Dolls (5).

## ✅ Definition of Done
*   All 7 powers have unique, high-impact animations and correct technical logic.
*   Mystery Box drops and gives correct random rewards.
*   Full Counter logic enforces the 3-second timing window.
*   Level 5 "Love Meter" fills correctly.
*   The "Infinite Love" cinematic plays at 60fps and leads Faith to the Music Room.
