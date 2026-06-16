# Wall Poster Images — Hub Bedroom

Drop your poster images here and the three wall posters in the Hub bedroom will display them.
If a file is missing or fails to load, that poster falls back to its emoji icon + label — all three work independently.

---

## Naming Convention

| File name          | Poster          | Fallback      | Accent colour |
|--------------------|-----------------|---------------|---------------|
| `poster_gojo.jpg`  | Gojo Satoru     | 👁️  GOJO      | #00BFFF (blue)|
| `poster_given.jpg` | Given (anime)   | 🎸  GIVEN     | #FFB6C1 (pink)|
| `poster_solo.jpg`  | Solo Leveling   | 🗡️  SOLO      | #FFD700 (gold)|

You can replace any one poster without touching the others.

---

## Recommended Format & Size

**Format:** JPG (preferred for artwork/photos) or PNG.
JPG gives the best file size for illustration or scanned art. PNG is fine for digital art with flat colours.

**Aspect ratio:** 2:3 portrait (e.g. 400 × 600 px).
The poster frame is displayed at 128 × 192 px in the room and zooms to ~384 × 576 px when double-clicked.
A 400 × 600 px source renders crisply at both sizes.
If your image is a different ratio it will be `object-fit: cover` — keep the main subject centred.

**File size:** Keep under 300 KB each. Poster images are loaded at page load.

---

## Where to Get Poster Art

- Search Pinterest / Zerochan / DeviantArt for fan-made anime posters
- Official key visual art from the anime's website (for personal use)
- Etsy sellers who make printable anime posters (often high-res)
- Create your own in Canva using a "Movie Poster" template (400 × 600 px)

**For Gojo:** Search "Gojo Satoru poster art", "JJK minimalist poster"
**For Given:** Search "Given anime poster", "Given manga art"
**For Solo Leveling:** Search "Sung Jinwoo poster", "Solo Leveling key visual"

---

## PNG Extension for PNG Files

If you prefer PNG, just use `.png` — update the `src` field in the `POSTERS` array at the top of `src/routes/Hub.jsx` to match the extension you used.
