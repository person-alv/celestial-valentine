# Tile Images — Shadow Garden

Drop your tile images here and the game will use them automatically.
If a file is missing or fails to load, the tile falls back to its emoji symbol — the game always keeps working.

---

## Naming Convention

| File name   | Tile            | Fallback emoji |
|-------------|-----------------|----------------|
| `tile_0.png` | Cherry Blossom  | 🌸             |
| `tile_1.png` | Shadow Orb      | ⚫             |
| `tile_2.png` | Six Eyes Gem    | 💙             |
| `tile_3.png` | Musical Note    | 🎵             |
| `tile_4.png` | Black Heart     | 🖤             |
| `tile_5.png` | Star Fragment   | ✨             |

You do not need to provide all 6. Any file you leave out stays as its emoji.

---

## Recommended Format & Size

**Format:** PNG with a transparent background (preferred), SVG, or WebP.
Avoid JPG — the white/coloured background will show inside the tile border.

**Size:** 128 × 128 px source size.
The game renders tiles at roughly 40–50 px on screen, but a 128 px source looks crisp on high-DPI / retina displays. Staying square is important — the tile container is always 1:1.

**Why PNG over SVG?**
PNGs from icon packs (Flaticon, Icons8, Game-icons.net) are ready to drop in immediately.
SVGs also work if you prefer them — just name the file `tile_0.png` and browsers will render it fine as long as the actual content is valid PNG or SVG.

If you use SVG, name it `tile_0.svg` etc. and it will load — but note the game always tries the `.png` path first, so use PNG for zero hassle.

---

## Good Free Sources

- **Game-icons.net** — fantasy / RPG icons, SVG, free
- **Flaticon.com** — huge icon packs, many free PNG
- **Icons8.com** — good game-style icons, free tier available
- **Noun Project** — clean flat icons

Search for: cherry blossom, shadow orb, gem/crystal, music note, heart, star
