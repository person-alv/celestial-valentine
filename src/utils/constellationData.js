// Constellation data for "Faith & Alvin ❤️"
// Each constellation represents one character in the phrase

export const constellations = [
  // F
  {
    id: 0,
    char: 'F',
    stars: [
      { x: 15, y: 20, id: 0 },
      { x: 15, y: 35, id: 1 },
      { x: 15, y: 50, id: 2 },
      { x: 15, y: 65, id: 3 },
      { x: 30, y: 20, id: 4 },
      { x: 30, y: 35, id: 5 }
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], // Vertical line
      [0, 4], [1, 5] // Horizontal bars
    ]
  },
  
  // a
  {
    id: 1,
    char: 'a',
    stars: [
      { x: 40, y: 35, id: 0 },
      { x: 40, y: 50, id: 1 },
      { x: 40, y: 65, id: 2 },
      { x: 55, y: 35, id: 3 },
      { x: 55, y: 50, id: 4 },
      { x: 55, y: 65, id: 5 }
    ],
    connections: [
      [0, 3], // Top
      [3, 4], [4, 5], // Right side
      [1, 4], // Middle
      [1, 2] // Left vertical (partial)
    ]
  },
  
  // i
  {
    id: 2,
    char: 'i',
    stars: [
      { x: 65, y: 30, id: 0 }, // Dot
      { x: 65, y: 40, id: 1 },
      { x: 65, y: 50, id: 2 },
      { x: 65, y: 60, id: 3 },
      { x: 65, y: 70, id: 4 }
    ],
    connections: [
      [1, 2], [2, 3], [3, 4] // Vertical line (dot is separate)
    ]
  },
  
  // t
  {
    id: 3,
    char: 't',
    stars: [
      { x: 75, y: 25, id: 0 },
      { x: 75, y: 35, id: 1 },
      { x: 75, y: 50, id: 2 },
      { x: 75, y: 65, id: 3 },
      { x: 68, y: 35, id: 4 },
      { x: 82, y: 35, id: 5 }
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], // Vertical
      [4, 5] // Horizontal cross
    ]
  },
  
  // h
  {
    id: 4,
    char: 'h',
    stars: [
      { x: 15, y: 20, id: 0 },
      { x: 15, y: 35, id: 1 },
      { x: 15, y: 50, id: 2 },
      { x: 15, y: 65, id: 3 },
      { x: 30, y: 35, id: 4 },
      { x: 30, y: 50, id: 5 },
      { x: 30, y: 65, id: 6 }
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], // Left vertical
      [1, 4], // Bridge
      [4, 5], [5, 6] // Right vertical
    ]
  },
  
  // & (ampersand)
  {
    id: 5,
    char: '&',
    stars: [
      { x: 45, y: 30, id: 0 },
      { x: 40, y: 40, id: 1 },
      { x: 40, y: 55, id: 2 },
      { x: 45, y: 65, id: 3 },
      { x: 55, y: 65, id: 4 },
      { x: 60, y: 55, id: 5 },
      { x: 55, y: 45, id: 6 },
      { x: 65, y: 65, id: 7 }
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], // Main curve
      [4, 5], [5, 6], [6, 1], // Inner loop
      [6, 7] // Tail
    ]
  },
  
  // A (capital)
  {
    id: 6,
    char: 'A',
    stars: [
      { x: 20, y: 20, id: 0 }, // Top
      { x: 15, y: 40, id: 1 },
      { x: 10, y: 65, id: 2 }, // Bottom left
      { x: 25, y: 40, id: 3 },
      { x: 30, y: 65, id: 4 } // Bottom right
    ],
    connections: [
      [2, 1], [1, 0], [0, 3], [3, 4], // Outline
      [1, 3] // Cross bar
    ]
  },
  
  // l
  {
    id: 7,
    char: 'l',
    stars: [
      { x: 40, y: 20, id: 0 },
      { x: 40, y: 35, id: 1 },
      { x: 40, y: 50, id: 2 },
      { x: 40, y: 65, id: 3 }
    ],
    connections: [
      [0, 1], [1, 2], [2, 3]
    ]
  },
  
  // v
  {
    id: 8,
    char: 'v',
    stars: [
      { x: 50, y: 35, id: 0 },
      { x: 55, y: 50, id: 1 },
      { x: 60, y: 65, id: 2 },
      { x: 65, y: 50, id: 3 },
      { x: 70, y: 35, id: 4 }
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  
  // i (second one)
  {
    id: 9,
    char: 'i',
    stars: [
      { x: 80, y: 30, id: 0 }, // Dot
      { x: 80, y: 40, id: 1 },
      { x: 80, y: 50, id: 2 },
      { x: 80, y: 60, id: 3 },
      { x: 80, y: 70, id: 4 }
    ],
    connections: [
      [1, 2], [2, 3], [3, 4]
    ]
  },
  
  // n
  {
    id: 10,
    char: 'n',
    stars: [
      { x: 15, y: 35, id: 0 },
      { x: 15, y: 50, id: 1 },
      { x: 15, y: 65, id: 2 },
      { x: 25, y: 35, id: 3 },
      { x: 30, y: 40, id: 4 },
      { x: 30, y: 50, id: 5 },
      { x: 30, y: 65, id: 6 }
    ],
    connections: [
      [0, 1], [1, 2], // Left vertical
      [0, 3], [3, 4], // Arc
      [4, 5], [5, 6] // Right vertical
    ]
  },
  
  // ❤️ (heart shape)
  {
    id: 11,
    char: '❤️',
    stars: [
      { x: 45, y: 30, id: 0 }, // Top left curve
      { x: 40, y: 35, id: 1 },
      { x: 50, y: 45, id: 2 }, // Middle
      { x: 50, y: 60, id: 3 }, // Bottom point
      { x: 60, y: 35, id: 4 },
      { x: 55, y: 30, id: 5 } // Top right curve
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], // Left side
      [5, 4], [4, 2] // Right side
    ]
  }
];

// Generate a mirrored/rotated "portrait" version for the puzzle guide
export const generatePortrait = (constellation) => {
  const centerX = 50;
  
  return constellation.stars.map((star) => {
    // Mirror horizontally and add slight random offset for puzzle difficulty
    const mirroredX = centerX + (centerX - star.x) + (Math.random() * 10 - 5);
    const mirroredY = star.y + (Math.random() * 8 - 4);
    
    return {
      x: Math.max(10, Math.min(90, mirroredX)), // Keep within bounds
      y: Math.max(10, Math.min(90, mirroredY)),
      id: star.id
    };
  });
};

// Shuffle which 7 constellations will trigger love notes
export const getRandomNoteIndices = () => {
  const indices = Array.from({ length: 12 }, (_, i) => i);
  const shuffled = indices.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 7); // Return 7 random indices
};

export default constellations;
