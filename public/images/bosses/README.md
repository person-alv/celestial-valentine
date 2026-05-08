# Boss Images — Shadow Garden

One image per level. Drop the correctly named file here and it appears in the boss icon beside the health bar immediately — no code changes needed. If the file is missing or fails to load the boss falls back to its emoji, so the game always works.

---

## Naming Convention

| File name   | Level | Boss name        | Emoji fallback | Theme                                      |
|-------------|-------|------------------|----------------|--------------------------------------------|
| `boss_1.png` | 1    | Hesitation       | 😰             | Anxiety / fear / hesitation energy         |
| `boss_2.png` | 2    | Silence          | 🎧💔           | Noise-cancelling heartbreak, muffled music |
| `boss_3.png` | 3    | Loneliness       | 👻🧸           | Ghost-like figure, plushies, solitude      |
| `boss_4.png` | 4    | Distance         | 🌑             | Dark moon, void, cosmic emptiness          |
| `boss_5.png` | 5    | The Final Trial  | 💖             | Radiant heart, final gate energy           |

---

## Recommended Format & Size

**Format:** PNG with a **transparent background** — required. The boss icon sits inside a dark circular frame with a purple glow; a white or solid background will create an ugly hard edge inside the circle.

**Size:** **256 × 256 px**, square crop.
The icon renders at 64 × 64 px on screen (`w-16 h-16` Tailwind), but a 256 px source stays sharp on high-DPI displays. Anything from 128 px up works fine.

**Shape:** The game applies a circular clip (`border-radius: 50%`). Keep the main subject centred in the square — anything in the corners will be cropped out.

**Coverage:** The image fills 85% of the circular frame. A small gap between the image edge and the purple border ring is intentional.

---

## Visual Direction per Boss

### boss_1.png — Hesitation (Level 1)
A creature or face that radiates nervous energy: wide eyes, trembling expression, anxious aura. Think pale blues and cold whites. Could be an abstract nervous form, a humanoid with sweat drops, or a glitching eye motif.

### boss_2.png — Silence (Level 2)
Something that visually mutes sound — headphones over a broken heart, a figure with their mouth sealed, sound waves dying out. Dark pinks, greys, and muted tones work well. A cracked headphone icon or a ghostly silhouette works.

### boss_3.png — Loneliness (Level 3)
A ghost cradling a stuffed animal, a pale spectral figure among a sea of plushies, or a hollow outline of a person. Soft lavender, dusty rose, and dim yellows. Ethereal and slightly sad.

### boss_4.png — Distance (Level 4)
A dark moon, a silhouette drifting in a void, or a figure reaching across an impossible gap. Deep navy, pitch black, and cold silver. Cosmic and isolating.

### boss_5.png — The Final Trial (Level 5)
The climax boss — radiant, powerful, emotionally charged. A glowing heart sigil, an angelic/demonic dual form, or a burst of rose-gold light. Warm golds, deep magentas, and bright white. Should feel like the final gate.

---

## Good Sources

Free art with transparent backgrounds:
- **Pinterest / DeviantArt** — search `[boss theme] transparent PNG` or `anime [theme] art PNG`
- **Zerochan / Danbooru** — for anime-style boss character art (check licensing)
- **Adobe Express / Canva** — generate dark fantasy character portraits
- **AI image tools** — generate and export with transparent BG

Search tips per boss:
| Boss | Search |
|------|--------|
| Hesitation | `anxiety demon transparent PNG` / `nervous spirit art` |
| Silence | `broken headphones ghost art PNG` / `silence specter` |
| Loneliness | `ghost plushie art transparent` / `lonely spirit fantasy` |
| Distance | `dark moon void spirit PNG` / `cosmic shadow being` |
| Final Trial | `radiant heart boss art` / `final guardian glowing transparent PNG` |
