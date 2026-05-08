# Faith Avatar Images — Shadow Garden

Drop Faith's expression images here and the game will use them in place of the emoji avatars.
If any file is missing or fails to load, that expression falls back to its emoji — all 5 expressions can be replaced independently.

---

## Naming Convention

The avatar changes expression based on what is happening in the game:

| File name              | When shown                            | Fallback emoji |
|------------------------|---------------------------------------|----------------|
| `faith_idle.png`       | Default / waiting for a move          | 👩‍🎨            |
| `faith_happy.png`      | Combo of 3–4                          | 😊             |
| `faith_excited.png`    | Combo of 5+                           | 🤩             |
| `faith_thinking.png`   | Board is processing / cascading       | 🧐             |
| `faith_determined.png` | Boss HP below 25%                     | 💪             |

You can replace all 5 or just the ones you have art for.

---

## Recommended Format & Size

**Format:** PNG with a transparent background (preferred) or WebP with alpha.
The avatar is displayed in a circular frame — a transparent background lets the game's rose border and glow show through cleanly. Avoid white backgrounds.

**Size:** 300 × 300 px minimum, square crop.
The display container is 96 × 96 px (`w-24 h-24` in Tailwind), but a 300 px source stays sharp on all screens. Anything 200 px or larger works fine.

**Orientation:** Portrait or square. The circular clip cuts from the centre of the image, so keep Faith's face centred.

---

## Drop and Go

Drop the correctly named files into this folder — no code changes required.
The avatar component automatically tries each expression path and falls back to emoji if the file is missing or fails to load.
