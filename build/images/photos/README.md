# Photo Gallery Images — Music Room

Drop your photos here and the gallery in the Music Room will display them.
If a file is missing, the slot shows a styled placeholder with the photo's caption — the gallery always renders all 5 frames regardless.

---

## Naming Convention

| File name     | Caption in gallery                      |
|---------------|-----------------------------------------|
| `photo_1.jpg` | "The day we met... ✨"                  |
| `photo_2.jpg` | "Coffee dates and rainy days. ☕"       |
| `photo_3.jpg` | "Under the summer sun. ☀️"             |
| `photo_4.jpg` | "Making magic together. 🪄"            |
| `photo_5.jpg` | "Forever and always. ❤️"               |

Captions are edited in `src/routes/MusicRoom.jsx` inside the `photos` array.

---

## Recommended Format & Size

**Format:** JPG (preferred for photos) or PNG.
JPG gives good quality at smaller file sizes for real photos — aim for 200–400 KB per image so the gallery loads quickly.

**Aspect ratio:** 16:9 landscape.
The gallery frame renders at 16:9 (`aspect-video` in Tailwind). Portrait photos will be object-fit:covered and centred, so they still look fine, but landscape fills the frame with no cropping.

**Resolution:** 1200 × 675 px (1080p crop) for sharpest result. 800 × 450 px is also fine.

---

## Expanded Modal

When a photo is clicked, it opens in a 600 × 400 px modal. The same image is used — no separate thumbnail/full-res pair needed.

---

## Changing Captions or Adding More Photos

Open `src/routes/MusicRoom.jsx` and find the `photos` array near the top of the component:

```js
const photos = [
  { id: 1, caption: "The day we met... ✨" },
  ...
];
```

Edit the `caption` strings freely. The `id` must stay as a number 1–5 to match the file names.
