# Level Music — Shadow Garden

Place your level background music files in this folder (`/public/sounds/shadow-garden/`).
If a file is missing, the game continues silently for that level — no crash.

---

## Naming Convention

| File name              | Level                           | Mood / Style                              |
|------------------------|---------------------------------|-------------------------------------------|
| `level1_morning.mp3`   | Level 1 — Garden of First Encounters | Upbeat, hopeful romantic piano          |
| `level2_twilight.mp3`  | Level 2 — Garden of Rhythm          | Smooth R&B instrumental or lo-fi beat   |
| `level3_cozy.mp3`      | Level 3 — Doll Collector's Sanctuary | Warm music box melody with soft drums  |
| `level4_battle.mp3`    | Level 4 — Domain of Legendary Powers | Epic orchestral (Solo Leveling style)  |
| `level5_finale.mp3`    | Level 5 — The Heart Domain           | Emotional sweeping climax (Your Name)  |
| `music_room_ambient.mp3` | Music Room / Heart Domain          | Very soft lo-fi piano, ambient          |

> `music_room_ambient.mp3` goes in the **parent** `/public/sounds/` folder, not here.

---

## Format & Requirements

**Format:** MP3 (required — Howler.js uses HTML5 audio, MP3 has the widest support).
**Bitrate:** 128–192 kbps is ideal. Higher is fine but increases load time.
**Duration:** Any length — the game loops all background music automatically.
**Volume:** Files are played at 40% volume by the game. Normalised audio sounds best; avoid heavy compression.

---

## Good Free Sources

- **Pixabay.com/music** — free, no attribution required
- **Freemusicarchive.org** — creative commons licensed tracks
- **Incompetech.com** (Kevin MacLeod) — free with attribution
- **YouTube Audio Library** — free for personal projects
- **Uppbeat.io** — free tier available

For the battle track: search "epic orchestral", "dark fantasy battle", "Solo Leveling OST style".
For the finale: search "emotional piano", "anime ending theme instrumental".
