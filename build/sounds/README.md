# Sound Files Guide

Place the following sound files in this directory (`public/sounds/`).

## Required Files:

### 1. **buttonEscape.mp3**
- **Type**: Short, playful "whoosh" or "zip" sound
- **Duration**: ~0.3 seconds
- **Use**: When the NO button escapes from cursor/finger
- **Suggested search**: "cartoon whoosh", "fast zip sound"

### 2. **screenShake.mp3**
- **Type**: Comic "crash", "bonk", or "thud" sound
- **Duration**: ~0.5 seconds
- **Use**: When NO button is clicked and screen shakes
- **Suggested search**: "cartoon crash", "comic bonk"

### 3. **sparkle.mp3**
- **Type**: Magical chime, twinkle, or sparkle
- **Duration**: ~1 second
- **Use**: YES button success, glitter effects
- **Suggested search**: "magic sparkle", "fairy twinkle"

### 4. **tap.mp3**
- **Type**: Soft "tap", "plop", or gentle click
- **Duration**: ~0.2 seconds
- **Use**: Screen taps during countdown phase
- **Suggested search**: "soft tap", "water drop"

### 5. **firework.mp3**
- **Type**: Firework explosion with crackle
- **Duration**: ~2 seconds
- **Use**: When fireworks launch on Valentine's Day
- **Suggested search**: "firework explosion", "firework boom"

### 6. **starSelect.mp3**
- **Type**: Gentle "ding", celestial tone, or soft bell
- **Duration**: ~0.5 seconds
- **Use**: When starting to draw a constellation
- **Suggested search**: "soft ding", "celestial chime"

### 7. **starConnect.mp3**
- **Type**: Satisfying "click", "snap", or connection sound
- **Duration**: ~0.4 seconds
- **Use**: When successfully connecting two stars
- **Suggested search**: "click sound", "snap sound"

### 8. **error.mp3**
- **Type**: Soft negative tone or "wrong" sound
- **Duration**: ~0.3 seconds
- **Use**: When attempting invalid constellation connection
- **Suggested search**: "soft error", "wrong buzzer"

### 9. **shimmer.mp3**
- **Type**: Magical shimmer, sparkle cascade
- **Duration**: ~1.5 seconds
- **Use**: When each sentence appears on the scroll
- **Suggested search**: "magic shimmer", "sparkle cascade"

### 10. **scroll.mp3**
- **Type**: Parchment unrolling, paper unfurling
- **Duration**: ~2 seconds
- **Use**: When the final love letter scroll reveals
- **Suggested search**: "paper unroll", "scroll unfurl"

### 11. **success.mp3**
- **Type**: Victory chime, achievement fanfare
- **Duration**: ~2 seconds
- **Use**: When a constellation is completed
- **Suggested search**: "victory chime", "success fanfare"

### 12. **background-romantic.mp3**
- **Type**: Soft, romantic instrumental music
- **Must be**: Loopable (seamless loop)
- **Duration**: 2-5 minutes
- **Volume**: Will play at 30%
- **Use**: Plays continuously throughout entire experience
- **Suggested search**: "romantic piano loop", "soft love instrumental"

---

## Recommended Free Sound Sources:

1. **Freesound.org**
   - Requires free account
   - Search by tags
   - Check license (most are CC0/Public Domain)

2. **Zapsplat.com**
   - Free sound effects
   - Good for UI sounds and whooshes

3. **Pixabay.com (Audio Section)**
   - Free music and sound effects
   - No attribution required
   - Great for background music

4. **Uppbeat.io**
   - Free music for creators
   - Requires attribution
   - Excellent romantic instrumentals

5. **Mixkit.co**
   - Free sound effects and music
   - High quality, no attribution

---

## File Requirements:

- **Format**: MP3 (most compatible) or OGG
- **Bitrate**: 128kbps minimum, 192kbps recommended
- **Ensure all files are properly licensed for personal use**
- **Test each sound before adding to ensure it matches the vibe**

---

## Testing Checklist:

- [ ] All 12 files present in `/public/sounds/` directory
- [ ] All files are named exactly as listed above (case-sensitive)
- [ ] Background music loops seamlessly without gaps
- [ ] Sound effects are appropriate length (not too long/short)
- [ ] Volume levels are balanced (none too loud or quiet)
- [ ] Files work in both Chrome and Safari

---

## Optional: Create Placeholder Files

If you want to test the app before adding real sounds, you can create silent placeholder files:

```bash
# In the sounds directory, run:
for file in buttonEscape screenShake sparkle tap firework starSelect starConnect error shimmer scroll success background-romantic; do
  touch ${file}.mp3
done
```

This will allow the app to run without errors, but you won't hear any sounds until you replace them with actual audio files.
