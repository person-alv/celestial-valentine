# Power-Up Images — Shadow Garden

Two image slots per power: a small **rack icon** shown in the power bar on the right, and a larger **cinema hero** shown during the activation cinematic.
Both are independent — you can add either without the other. Anything missing falls back to emoji automatically.

---

## Rack Icons (PowerUpBar)

Small icons shown in the 7-slot power rack during gameplay.

| File name      | Power                        | Fallback emoji |
|----------------|------------------------------|----------------|
| `icon_0.png`   | Six Eyes: Infinity           | 👁️             |
| `icon_1.png`   | Shadow Monarch's Army        | ⚫             |
| `icon_2.png`   | Ruler's Authority            | 🔱             |
| `icon_3.png`   | Inverted Spear of Heaven     | 🗡️             |
| `icon_4.png`   | Ten Shadows: Divine Dogs     | 🐺             |
| `icon_5.png`   | Magic Eyes of Destruction    | 👁️‍🗨️            |
| `icon_6.png`   | Full Counter                 | ⚔️             |

**Format:** PNG with transparent background (required — white bg shows badly in the dark rack).
**Size:** 64 × 64 px. The rack button is 40–56 px; a 64 px source stays sharp at all sizes.
**Style tip:** Clean, flat / minimal icons read best at small sizes. Avoid fine detail that disappears below 40 px.

**Drop and go:** just drop the correctly named file into this folder — no code changes required.
Missing files fall back to the emoji for that slot automatically.

---

## Cinema Heroes (PowerCinema)

Larger artwork shown during the activation cinematic. The image replaces (and covers) the CSS-drawn art while keeping the same GSAP animation. Drop the file → set the path → done.

| File name        | Power                        | Subject to download                  | Fallback CSS art     |
|------------------|------------------------------|--------------------------------------|----------------------|
| `cinema_0.png`   | Six Eyes: Infinity           | Gojo's six-eyed iris / glowing eyes  | CSS eye rings        |
| `cinema_1.png`   | Shadow Monarch's Army        | Jinwoo silhouette / shadow monarch   | ♛ crown + wisps     |
| `cinema_2.png`   | Ruler's Authority            | Jinwoo hand / cursed energy          | CSS drawn hand       |
| `cinema_3.png`   | Inverted Spear of Heaven     | Toji Fushiguro art                   | CSS silhouette       |
| `cinema_4.png`   | Ten Shadows: Divine Dogs     | Black + white dogs together          | CSS dog shapes       |
| `cinema_5.png`   | Magic Eyes of Destruction    | Anos Voldigoad / crimson eyes        | CSS red circles      |
| `cinema_6.png`   | Full Counter                 | Meliodas / Dragon Handle sword       | CSS broken sword     |

**Format:** PNG with transparent background (strongly recommended).
The image sits on a dark gradient overlay — a transparent background lets the glow and gradient show through naturally. Solid white/black backgrounds look jarring.

**Size:** 300 × 300 px square (for most). Exceptions:
- `cinema_3.png` (Toji) — 200 × 350 px portrait works well (tall silhouette)
- `cinema_4.png` (Dogs) — 400 × 200 px landscape works well (dogs side by side)

The game uses `object-fit: contain` so any square/portrait/landscape PNG is safe — it will scale to fit without cropping.

**Drop and go:** just drop the correctly named file into this folder — no code changes required.
Missing files fall back to the CSS animated art for that cinema automatically.

---

## Suggested Search Terms

| Power | Search |
|-------|--------|
| Six Eyes (Gojo) | "Gojo Satoru six eyes infinity JJK transparent PNG" |
| Shadow Army (Jinwoo) | "Sung Jinwoo shadow monarch arise PNG" |
| Ruler's Authority (Jinwoo) | "Sung Jinwoo ruler authority hand PNG" |
| Inverted Spear (Toji) | "Toji Fushiguro silhouette art transparent" |
| Divine Dogs (Megumi) | "Megumi divine dogs black white shadows" |
| Magic Eyes (Anos) | "Anos Voldigoad demon king eyes art" |
| Full Counter (Meliodas) | "Meliodas full counter Dragon Handle sword art" |

Good sources: Zerochan, Danbooru (check licensing), Pinterest fan art, DeviantArt, or any anime PNG site.
