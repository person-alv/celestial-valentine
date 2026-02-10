// Constants and utility functions for the Valentine's app

export const COLORS = {
  // Primary - UI & Hearts
  blushPink: '#FFB6C1',
  rosePink: '#FF69B4',
  deepRose: '#FF1493',
  valentineRed: '#E63946',
  
  // Secondary - Night Sky
  midnightBlue: '#191970',
  royalPurple: '#7B2CBF',
  twilightViolet: '#9D4EDD',
  
  // Accents
  sparkleGold: '#FFD700',
  shimmerGold: '#FFA500',
  pureWhite: '#FFFFFF',
  starWhite: '#F8F9FA',
};

export const FONTS = {
  ui: "'Quicksand', sans-serif",
  comic: "'Bangers', cursive",
  script: "'Dancing Script', cursive"
};

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1440px'
};

// Valentine's Day target date
// export const VALENTINE_DATE = new Date('2026-02-14T00:00:00');
export const VALENTINE_DATE = new Date('2026-02-10T02:50:00');

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth < 768;
};

// Check if device supports touch
export const isTouch = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get dynamic background color based on days until Valentine's
export const getCountdownBackgroundColor = (daysUntilValentine) => {
  const totalDays = 4; // Feb 10-14
  const progress = Math.max(0, Math.min(1, (totalDays - daysUntilValentine) / totalDays));
  
  // Color stops: Midnight Blue -> Royal Purple -> Twilight Violet -> Valentine Red (Dramatic/Shouting)
  const colorStops = [
    { r: 25, g: 25, b: 112 },    // Midnight Blue
    { r: 123, g: 44, b: 191 },   // Royal Purple
    { r: 157, g: 78, b: 221 },   // Twilight Violet
    { r: 230, g: 57, b: 70 }     // Valentine Red
  ];
  
  const index = progress * (colorStops.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const fraction = index - lower;
  
  const lowerColor = colorStops[lower];
  const upperColor = colorStops[upper];
  
  const r = Math.round(lowerColor.r + (upperColor.r - lowerColor.r) * fraction);
  const g = Math.round(lowerColor.g + (upperColor.g - lowerColor.g) * fraction);
  const b = Math.round(lowerColor.b + (upperColor.b - lowerColor.b) * fraction);
  
  return `rgb(${r}, ${g}, ${b})`;
};

// Calculate distance between two points
export const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Check if a click/tap is close enough to a star
export const isNearStar = (clickX, clickY, starX, starY, threshold = 5) => {
  return getDistance(clickX, clickY, starX, starY) < threshold;
};

// Format time remaining
export const formatTimeUnit = (value) => {
  return String(value).padStart(2, '0');
};

// Local storage keys
export const STORAGE_KEYS = {
  progress: 'valentine_progress',
  soundMuted: 'valentine_sound_muted'
};

// Save to local storage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Load from local storage
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Clear storage
export const clearStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

// Random element from array
export const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Shuffle array
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const constants = {
  COLORS,
  FONTS,
  BREAKPOINTS,
  VALENTINE_DATE,
  isMobile,
  isTouch,
  getCountdownBackgroundColor,
  getDistance,
  isNearStar,
  formatTimeUnit,
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage,
  clearStorage,
  randomElement,
  shuffleArray,
  debounce
};

export default constants;