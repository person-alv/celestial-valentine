# Voice Notes — Music Room Archive

Place your voice recordings here. They play when Faith clicks the vinyl records in the Archive section of the Music Room.
If a file is missing, clicking that vinyl does nothing (no crash — Howler silently ignores a missing file).

---

## Naming Convention

| File name    | Title in the Archive       | Date shown    |
|--------------|----------------------------|---------------|
| `note_1.mp3` | "Our First Hello"          | Feb 2024      |
| `note_2.mp3` | "Midnight Thoughts"        | April 2024    |
| `note_3.mp3` | "Summer Dreams"            | July 2024     |
| `note_4.mp3` | "Autumn Whispers"          | Oct 2024      |
| `note_5.mp3` | "A Special Message"        | Valentine 2026|

Titles and dates are edited in `src/routes/MusicRoom.jsx` inside the `voiceNotes` array.

---

## Recording Tips

**Format:** MP3 (required).
**Duration:** 30–90 seconds per note works well in the UI. Longer is fine but there's no progress bar shown.
**Quality:** Record in a quiet room. 128 kbps is plenty — voice doesn't need high bitrate.

**Tools to record & export MP3:**
- **Audacity** (free, Windows/Mac/Linux) — record → File → Export → MP3
- **Voice Memos** (iOS) → share → convert with any online M4A→MP3 converter
- **GarageBand** (Mac/iOS) → export as MP3
- **Online recorder:** vocaroo.com — record in browser, download as MP3

---

## What to Say (Ideas)

Each note should feel like a memory capsule. Some prompts:
1. "The first time we talked about..." — describe the memory
2. "Late-night thoughts I wrote but never sent..."
3. "This song reminds me of our summer because..."
4. "Things I noticed about you in autumn..."
5. "Everything I want you to know, right now, this Valentine's..."

The notes play over the Music Room ambient track, so speak clearly but softly.
