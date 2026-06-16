import { useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { useSelector } from 'react-redux';

export const useSound = () => {
  const { sfxVolume, musicMuted, sfxMuted, musicVolume } = useSelector(state => state.shadowGarden || {});

  const backgroundMusic = useRef(null);
  const sfxRegistry = useRef({});
  const stopTimerRef = useRef(null);
  const pendingUnlockRef = useRef(null); // cleanup fn for an armed first-gesture retry

  useEffect(() => {
    Howler.volume(1.0);
  }, []);

  // Sync background music volume with mute state
  useEffect(() => {
    if (backgroundMusic.current) {
      backgroundMusic.current.volume(musicMuted ? 0 : (musicVolume || 0.3));
    }
  }, [musicMuted, musicVolume]);

  // Stop background music when the consuming component unmounts.
  // Short fade (150ms) — fast enough to not bleed into the next route's audio.
  useEffect(() => {
    return () => {
      if (pendingUnlockRef.current) pendingUnlockRef.current();
      if (backgroundMusic.current) {
        const howl = backgroundMusic.current;
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        howl.fade(howl.volume(), 0, 150);
        stopTimerRef.current = setTimeout(() => howl.stop(), 170);
      }
    };
  }, []);

  // Mobile autoplay policy rejects play() that isn't inside a user gesture (mount effects).
  // When that happens Howler fires 'playerror'; we arm a one-time first-gesture listener
  // that resumes the audio context and replays the track. No-ops on desktop (no playerror).
  const armUnlockRetry = useCallback((howl) => {
    // Never stack listeners across repeated failures.
    if (pendingUnlockRef.current) {
      pendingUnlockRef.current();
      pendingUnlockRef.current = null;
    }
    const events = ['pointerdown', 'touchend', 'click', 'keydown'];
    const cleanup = () => {
      events.forEach(evt => document.removeEventListener(evt, onGesture, true));
      pendingUnlockRef.current = null;
    };
    const onGesture = () => {
      cleanup();
      try {
        if (Howler.ctx && Howler.ctx.state === 'suspended') Howler.ctx.resume();
      } catch (e) { /* no-op */ }
      if (howl && !howl.playing()) howl.play();
    };
    events.forEach(evt => document.addEventListener(evt, onGesture, true));
    pendingUnlockRef.current = cleanup;
  }, []);

  // instant=true: old track stops immediately, new track starts at full volume right away.
  // Use this for cinematics or moments where timing must be exact.
  // instant=false (default): smooth cross-fade between tracks.
  const playBackground = useCallback((src, volume = 0.3, loop = true, instant = false) => {
    const targetVol = musicMuted ? 0 : volume;

    if (backgroundMusic.current) {
      const _activeSrc = Array.isArray(backgroundMusic.current._src)
        ? backgroundMusic.current._src[0]
        : backgroundMusic.current._src;
      if (_activeSrc === src) {
        if (stopTimerRef.current) {
          // A fade-out + stop is in flight (StrictMode cleanup or stopBackground).
          // Cancel it and revive the track cleanly.
          clearTimeout(stopTimerRef.current);
          stopTimerRef.current = null;
          backgroundMusic.current.stop(); // clears Howler's internal fade interval
          backgroundMusic.current.volume(targetVol);
          backgroundMusic.current.play();
        } else if (!backgroundMusic.current.playing()) {
          backgroundMusic.current.volume(targetVol);
          backgroundMusic.current.play();
        } else {
          backgroundMusic.current.volume(targetVol);
        }
        return;
      }

      const old = backgroundMusic.current;
      if (instant) {
        // Hard stop old track, new track starts at full volume immediately
        old.stop();
      } else {
        // Cross-fade: old fades out while new fades in.
        // Starting new at 0 is safe here because existing music means AudioContext is unlocked.
        old.fade(old.volume(), 0, 800);
        setTimeout(() => old.stop(), 820);
      }

      const newHowl = new Howl({
        src: [src], loop, volume: instant ? targetVol : 0, html5: true,
        onplayerror: () => armUnlockRetry(newHowl),
      });
      backgroundMusic.current = newHowl;
      newHowl.play();
      if (!instant) newHowl.fade(0, targetVol, 800);
    } else {
      // Fresh start — no existing track. Start at target volume directly so autoplay
      // policy can't leave us stuck at silent volume on first load or after navigation.
      const newHowl = new Howl({
        src: [src], loop, volume: targetVol, html5: true,
        onplayerror: () => armUnlockRetry(newHowl),
      });
      backgroundMusic.current = newHowl;
      newHowl.play();
    }
  }, [musicMuted, armUnlockRetry]);

  const stopBackground = useCallback(() => {
    if (backgroundMusic.current) {
      const howl = backgroundMusic.current;
      const vol = howl.volume();
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      howl.fade(vol, 0, 500);
      stopTimerRef.current = setTimeout(() => {
        howl.stop();
        stopTimerRef.current = null;
      }, 520);
    }
  }, []);

  // Set background volume, optionally with a fade (fadeDuration ms)
  const setBackgroundVolume = useCallback((vol, fadeDuration = 0) => {
    if (backgroundMusic.current) {
      const target = musicMuted ? 0 : vol;
      if (fadeDuration > 0) {
        backgroundMusic.current.fade(backgroundMusic.current.volume(), target, fadeDuration);
      } else {
        backgroundMusic.current.volume(target);
      }
    }
  }, [musicMuted]);

  const playSFX = useCallback((name, src, volume = 1.0, onEnd) => {
    if (sfxMuted) return;

    const actualSrc = src || `/sounds/${name}.mp3`;

    if (!sfxRegistry.current[name]) {
      sfxRegistry.current[name] = new Howl({
        src: [actualSrc],
        volume: volume * (sfxVolume || 1.0),
        html5: true,
      });
    }

    const howl = sfxRegistry.current[name];
    if (onEnd) {
      howl.off('end');
      howl.off('playerror');
      howl.once('end', onEnd);
      howl.once('playerror', onEnd); // restore even if file fails
    }
    howl.play();
  }, [sfxMuted, sfxVolume]);

  // Legacy compatibility for original Valentine's game
  const play = useCallback((name) => {
    playSFX(name);
  }, [playSFX]);

  return { playBackground, stopBackground, setBackgroundVolume, playSFX, play };
};

// Singleton-style access for non-hook usage (Hub)
class SoundManager {
  constructor() {
    this.bg = null;
    this.sfx = {};
    this._pendingUnlock = null;
  }

  playBackground(src, volume = 0.3) {
    if (this.bg) {
      const old = this.bg;
      const vol = old.volume();
      old.fade(vol, 0, 500);
      setTimeout(() => old.stop(), 520);
    }
    const bg = new Howl({
      src: [src], loop: true, volume: 0, html5: true,
      onplayerror: () => this._armUnlock(bg),
    });
    this.bg = bg;
    bg.play();
    bg.fade(0, volume, 800);
  }

  // Mobile autoplay: if play() was blocked, replay on the first user gesture.
  _armUnlock(howl) {
    if (this._pendingUnlock) this._pendingUnlock();
    const events = ['pointerdown', 'touchend', 'click', 'keydown'];
    const cleanup = () => {
      events.forEach(evt => document.removeEventListener(evt, onGesture, true));
      this._pendingUnlock = null;
    };
    const onGesture = () => {
      cleanup();
      try {
        if (Howler.ctx && Howler.ctx.state === 'suspended') Howler.ctx.resume();
      } catch (e) { /* no-op */ }
      if (howl && !howl.playing()) howl.play();
    };
    events.forEach(evt => document.addEventListener(evt, onGesture, true));
    this._pendingUnlock = cleanup;
  }

  stopBackground() {
    if (this.bg) {
      const howl = this.bg;
      const vol = howl.volume();
      howl.fade(vol, 0, 500);
      setTimeout(() => howl.stop(), 520);
    }
  }

  loadSound(name, src) {
    this.sfx[name] = new Howl({ src: [src] });
  }

  play(name) {
    if (this.sfx[name]) this.sfx[name].play();
  }
}

export const soundManager = new SoundManager();
