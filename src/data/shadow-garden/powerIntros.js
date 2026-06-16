// src/data/shadow-garden/powerIntros.js
//
// Catchy, lore-flavored intro copy for the "New Power Unlocked" cards.
// The howTo lines mirror the real mechanics in useMatch3.js so the guidance is accurate.
// Name / character / anime / icon / color come from powerups.js via getPowerById.

export const powerIntros = {
  0: {
    lore: "The honored one's limitless gaze sees through all.",
    effect: 'Erases an entire row of tiles.',
    howTo: 'Tap the power, then tap any tile in the row you want gone.',
  },
  1: {
    lore: "Arise — the Shadow Monarch's soldiers strike from the dark.",
    effect: 'Destroys 10 random tiles across the board.',
    howTo: 'Just tap the power — the shadows do the rest.',
  },
  2: {
    lore: 'Bend the rules of reality and move what you will.',
    effect: 'Swap ANY two tiles, even far apart — one time.',
    howTo: 'Tap the power, then tap two tiles anywhere to swap them.',
  },
  3: {
    lore: "The Sorcerer Killer's blade nullifies all it touches.",
    effect: 'Destroys every tile of one kind.',
    howTo: 'Tap the power, then tap a tile — all of that type vanish.',
  },
  4: {
    lore: 'Divine Dogs hunt at your side.',
    effect: 'Doubles every point you score for 15 seconds.',
    howTo: "Tap it, then chain big matches fast while it's active.",
  },
  5: {
    lore: "The Demon King's gaze annihilates from every corner.",
    effect: 'Blasts all four corners and the tiles around them.',
    howTo: 'Just tap the power — the corners erupt instantly.',
  },
  6: {
    lore: 'Reflect the blow back with overwhelming force.',
    effect: 'Triples the score of your last match.',
    howTo: 'Tap it within 3 seconds of a big match to triple it.',
  },
};

export const getPowerIntro = (id) => powerIntros[id] || powerIntros[0];
