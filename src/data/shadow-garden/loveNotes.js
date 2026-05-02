// src/data/shadow-garden/loveNotes.js

/**
 * Love Notes from Alvin to Faith
 * These appear in the Music Room and as system messages throughout the game
 */

export const loveNotes = [
  {
    id: 1,
    title: 'Message of Strength',
    text: "Hey beautiful, ready to show this world what you're made of? I believe in you. You've got this! 💪✨",
    occasion: 'Level Start',
    emotion: 'encouragement'
  },
  {
    id: 2,
    title: 'Keep Going',
    text: "You're doing amazing! Every move you make reminds me why I fell for you. Keep going, my love! 💕",
    occasion: 'Mid-Battle',
    emotion: 'admiration'
  },
  {
    id: 3,
    title: 'The Final Gate',
    text: "This is it, my love. The final gate. Beyond this lies everything I want to show you, everything I want to say. Thank you for being mine. ❤️",
    occasion: 'Level 5 Entry',
    emotion: 'devotion'
  }
];

/**
 * Additional love notes for collections (displayed in Music Room)
 */
export const collectionNotes = [
  {
    id: 4,
    title: 'Why I Built This',
    text: "Every line of code, every animation, every little detail... I crafted this world just for you. Because you deserve something as extraordinary as you are.",
    unlockCondition: 'Complete any 3 levels'
  },
  {
    id: 5,
    title: 'Our Journey',
    text: "From the moment you said yes, every day has been an adventure. This game is my love letter to us - to our laughs, our songs, our quiet moments, and our epic battles against the world together.",
    unlockCondition: 'Reach Level 5'
  },
  {
    id: 6,
    title: 'Forever Player 2',
    text: "You're not just my Valentine. You're my co-op partner in this game called life. And I wouldn't want anyone else holding the other controller. Let's keep leveling up together. 🎮❤️",
    unlockCondition: 'Complete all 5 levels'
  }
];

/**
 * Get love note by ID
 * @param {number} id - Note ID (1-6)
 * @returns {object} Love note object
 */
export const getLoveNoteById = (id) => {
  const allNotes = [...loveNotes, ...collectionNotes];
  return allNotes.find(note => note.id === id);
};

/**
 * Get all available love notes
 * @returns {array} Array of all love notes
 */
export const getAllLoveNotes = () => {
  return [...loveNotes, ...collectionNotes];
};

/**
 * Get random love note from main collection
 * @returns {object} Random love note
 */
export const getRandomLoveNote = () => {
  return loveNotes[Math.floor(Math.random() * loveNotes.length)];
};
