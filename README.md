# 💖 Faith & Alvin: Celestial Valentine

A magical, interactive Valentine's Day experience built with React.

## 🎁 What is this?

This is a multi-phase interactive gift that takes Faith on a journey:

1. **The Playful Ask** - A fun "game" where she has to click YES
2. **The Countdown** - A romantic countdown to Valentine's Day
3. **The Fireworks** - A celebratory fireworks display
4. **The Constellation Puzzle** - An interactive star-connecting game
5. **The Love Letter** - A beautiful, magic-written letter reveal

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ installed
- npm or yarn package manager

### Installation

```bash
# 1. Navigate to the project directory
cd celestial-valentine

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at `http://localhost:3000`

## 📝 Before You Deploy - Important Steps!

### 1. Add Your Sound Files

Navigate to `public/sounds/` and add all required sound files as described in the README there. You need 12 sound files total.

**Quick test without sounds:** The app will run without sounds, but you'll see console warnings. Add real sounds before deploying!

### 2. Write Your Love Notes

Edit `src/data/loveNotes.js` and replace all 7 PLACEHOLDER notes with your own heartfelt messages.

### 3. Write Your Final Love Letter

Edit `src/data/finalLetter.js` and write your complete love letter. This is the grand finale!

### 4. Test Everything

```bash
# Run the app
npm start

# Test all phases by clicking through
```

## 📱 Deployment

### Deploy to Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Get Your Link:**
Vercel will give you a URL like: `https://celestial-valentine-xxx.vercel.app`

5. **Send to Faith!** 💖

## 🧪 Testing Tips

### Test Different Dates

To test the countdown phase, temporarily change the Valentine's date in `src/utils/constants.js`

### Test on Mobile

Access from your phone using your computer's IP address

### Clear Progress (Reset the Game)

Open browser console and run:
```javascript
localStorage.clear();
window.location.reload();
```

## 📂 Project Structure

```
celestial-valentine/
├── public/
│   ├── sounds/           # Add your sound files here!
│   └── index.html
├── src/
│   ├── components/
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions
│   ├── data/             # Love notes & letter (EDIT THESE!)
│   ├── styles/           # Global styles
│   └── App.js           # Main app component
└── README.md            # This file
```

## 🎯 Important Files to Edit

1. **`src/data/loveNotes.js`** - Your 7 love notes
2. **`src/data/finalLetter.js`** - Your final letter
3. **`public/sounds/`** - All 12 sound files
4. **`src/utils/constants.js`** - VALENTINE_DATE (set to Feb 14, 2026)

## ❤️ Final Checklist Before Sending

- [ ] All sound files added and working
- [ ] All 7 love notes written (no PLACEHOLDER text)
- [ ] Final letter written and spell-checked
- [ ] VALENTINE_DATE is set to Feb 14, 2026
- [ ] Tested on desktop browser
- [ ] Tested on mobile device
- [ ] Deployed to production URL
- [ ] Visited the production URL yourself to verify

---

**Good luck, Alvin! You've got this. Faith is going to love it! 💖✨**
