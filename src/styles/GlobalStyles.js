import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Quicksand', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior-y: contain; /* Prevent pull-to-refresh on mobile */
  }

  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  /* Custom scrollbar styling (for Phase 5 letter) */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.5);
    border-radius: 5px;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.8);
  }

  /* Disable text selection on interactive elements */
  button,
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* Ensure smooth transitions */
  * {
    transition-timing-function: ease-in-out;
  }

  /* Remove button default styles */
  button {
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
    font-family: inherit;
  }

  /* Prevent image dragging */
  img {
    user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  /* Smooth font rendering */
  body,
  input,
  textarea,
  button {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Accessibility: Focus styles */
  *:focus-visible {
    outline: 2px solid #FFD700;
    outline-offset: 2px;
  }

  /* Mobile-specific optimizations */
  @media (max-width: 768px) {
    body {
      -webkit-text-size-adjust: 100%; /* Prevent font size adjustment on mobile */
    }
  }

  /* Prevent zoom on double-tap on iOS */
  @media (max-width: 768px) {
    * {
      touch-action: manipulation;
    }
  }

  /* Hide scrollbar but keep functionality (for cleaner look in some phases) */
  .hide-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

export default GlobalStyles;
