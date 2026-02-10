# 🚀 QUICK START GUIDE

## Get Your Valentine's Gift Running in 10 Minutes!

### Step 1: Install Node.js (if you haven't already)

1. Go to [nodejs.org](https://nodejs.org)
2. Download the LTS version
3. Install it (just click "Next" through everything)
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Set Up The Project

```bash
# Navigate to the project folder
cd celestial-valentine

# Install all dependencies (this might take 2-3 minutes)
npm install
```

### Step 3: Add Sound Files

1. Go to `public/sounds/` folder
2. Read the `README.md` there
3. Download 12 sound files from the recommended sites
4. Name them exactly as specified (e.g., `buttonEscape.mp3`, `sparkle.mp3`, etc.)

**Quick hack for testing:** Create empty placeholder files:
```bash
cd public/sounds
touch buttonEscape.mp3 screenShake.mp3 sparkle.mp3 tap.mp3 firework.mp3 starSelect.mp3 starConnect.mp3 error.mp3 shimmer.mp3 scroll.mp3 success.mp3 background-romantic.mp3
cd ../..
```

### Step 4: Write Your Content

1. **Love Notes:** Edit `src/data/loveNotes.js`
   - Replace all 7 PLACEHOLDER notes with your own
   
2. **Final Letter:** Edit `src/data/finalLetter.js`
   - Delete the placeholder text
   - Write your heart out!

### Step 5: Test It Locally

```bash
# Start the development server
npm start
```

Your browser will open to `http://localhost:3000`

**Testing tips:**
- Click through all phases
- Test on your phone (use your computer's IP address)
- Make sure everything looks and sounds good

### Step 6: Deploy to Vercel (FREE!)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel (creates a free account)
vercel login

# Deploy!
vercel --prod
```

Vercel will give you a URL like: `https://celestial-valentine-xxx.vercel.app`

### Step 7: Send to Faith! 💖

---

## 🆘 Quick Fixes

### "npm: command not found"
→ Install Node.js from [nodejs.org](https://nodejs.org)

### Sounds not playing
→ Make sure all sound files are in `public/sounds/`
→ Try adding sound files (see Step 3)

### Want to test Valentine's Day mode now?
→ Edit `src/utils/constants.js`, change:
```javascript
export const VALENTINE_DATE = new Date(Date.now() + 5 * 60 * 1000); // 5 min from now
```

### Need to reset everything?
→ Open browser console (F12) and run:
```javascript
localStorage.clear();
window.location.reload();
```

---

## 📱 Test on Your Phone

1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. Look for something like `192.168.1.xxx`

3. On your phone, visit: `http://192.168.1.xxx:3000`

---

## ✅ Pre-Deployment Checklist

- [ ] Node.js installed
- [ ] All dependencies installed (`npm install`)
- [ ] All 12 sound files added
- [ ] All 7 love notes written
- [ ] Final letter written
- [ ] Tested locally on desktop
- [ ] Tested on mobile device
- [ ] Deployed to Vercel
- [ ] Tested the production URL
- [ ] Ready to send! 🎉

---

## 🎨 Want to Customize?

### Change the Valentine's Date
`src/utils/constants.js` → `VALENTINE_DATE`

### Change Colors
`src/utils/constants.js` → `COLORS` object

### Change the Phrase
`src/utils/constellationData.js` → Edit the constellations array

### Change Fonts
`public/index.html` → Google Fonts link
`src/utils/constants.js` → `FONTS` object

---

**You've got this, Alvin! Need more help? Check the full `README.md` or `IMPLEMENTATION_GUIDE.md`**
