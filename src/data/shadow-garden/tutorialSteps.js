export const tutorialSteps = [
  {
    id: 'welcome',
    type: 'modal',
    title: 'Welcome, Hunter Faith!',
    content: "You've been chosen to embark on a legendary quest through the Shadow Garden. Match sacred symbols, unlock legendary powers, and defeat the forces that stand between you and the Heart Domain.",
    showAvatar: true,
    buttons: ['Let\'s Go!']
  },
  {
    id: 'board-intro',
    type: 'tooltip',
    target: '#game-board',
    position: 'center',
    title: 'The Match-3 Board',
    content: 'Swap adjacent symbols to match 3 or more of the same kind. Create combos by triggering chain reactions!',
    highlight: true,
    buttons: ['Next']
  },
  {
    id: 'first-match',
    type: 'interactive',
    requirement: 'make_match',
    title: 'Make Your First Match',
    content: 'Try it! Tap two adjacent symbols to swap them and create a match of 3 or more.',
    highlight: true,
    waitForAction: true
  },
  {
    id: 'special-pieces',
    type: 'tooltip',
    target: null,
    position: 'center',
    title: 'Special Pieces',
    content: "Match 4 symbols to create a Striker piece that clears an entire row or column!\n\nMatch 5 in a line to create a Monarch piece that clears all of one color!",
    buttons: ['Got it!']
  },
  {
    id: 'power-ups',
    type: 'tooltip',
    target: '#power-up-bar',
    position: 'left',
    title: 'Legendary Powers',
    content: 'You start with Six Eyes and Shadow Army. Tap these icons to unleash devastating abilities! More powers unlock as you progress.',
    highlight: true,
    buttons: ['Show me!']
  },
  {
    id: 'boss',
    type: 'tooltip',
    target: '#boss-bar',
    position: 'bottom',
    title: 'Defeat the Boss',
    content: 'Each level has a boss protecting it. Make matches to damage the boss and reach your score goal!',
    highlight: true,
    buttons: ['Understood']
  },
  {
    id: 'tutorial-complete',
    type: 'modal',
    title: 'You\'re Ready!',
    content: "You now know the basics! Remember:\n\n✨ Match symbols to defeat bosses\n⚡ Use legendary powers strategically\n🎁 Request the Mystery Doll Box when needed\n💖 Fill the Love Meter in the final level\n\nGood luck, Hunter Faith! The Shadow Garden awaits.",
    showAvatar: true,
    buttons: ['Begin My Quest!']
  }
];
