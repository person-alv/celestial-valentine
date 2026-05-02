import { useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { useSelector } from 'react-redux';

/**
 * Advanced Sound Manager Hook
 * Handles Hub, Valentine, and Shadow Garden audio with Howler.js
 */
export const useSound = () => {
  const { sfxVolume, musicMuted, sfxMuted, musicVolume } = useSelector(state => state.shadowGarden || {});
  
  const backgroundMusic = useRef(null);
  const sfxRegistry = useRef({});

  // Initialize Howler settings
  useEffect(() => {
    Howler.volume(1.0);
  }, []);

  // Sync background music volume with mute state
  useEffect(() => {
    if (backgroundMusic.current) {
      backgroundMusic.current.volume(musicMuted ? 0 : (musicVolume || 0.3));
    }
  }, [musicMuted, musicVolume]);

  const playBackground = useCallback((src, volume = 0.3, loop = true) => {
    if (backgroundMusic.current) {
      if (backgroundMusic.current._src === src) {
        backgroundMusic.current.volume(musicMuted ? 0 : volume);
        return;
      }
      backgroundMusic.current.fade(backgroundMusic.current.volume(), 0, 1000);
      const oldMusic = backgroundMusic.current;
      setTimeout(() => oldMusic.stop(), 1000);
    }

    backgroundMusic.current = new Howl({
      src: [src],
      loop,
      volume: musicMuted ? 0 : volume,
      autoplay: true,
      html5: true
    });
    
    backgroundMusic.current.play();
  }, [musicMuted]);

  const stopBackground = useCallback(() => {
    if (backgroundMusic.current) {
      backgroundMusic.current.stop();
    }
  }, []);

  const playSFX = useCallback((name, src, volume = 1.0) => {
    if (sfxMuted) return;

    // Support for both name+src and just src (compatibility mode)
    const actualSrc = src || `/sounds/${name}.mp3`;

    if (!sfxRegistry.current[name]) {
      sfxRegistry.current[name] = new Howl({
        src: [actualSrc],
        volume: volume * (sfxVolume || 1.0)
      });
    }
    
    sfxRegistry.current[name].play();
  }, [sfxMuted, sfxVolume]);

  // Legacy compatibility for original Valentine's game
  const play = useCallback((name) => {
    playSFX(name);
  }, [playSFX]);

  return { playBackground, stopBackground, playSFX, play };
};

// Singleton-style access for non-hook usage
class SoundManager {
  constructor() {
    this.bg = null;
    this.sfx = {};
  }

  playBackground(src, volume = 0.3) {
    if (this.bg) this.bg.stop();
    this.bg = new Howl({ src: [src], loop: true, volume, html5: true });
    this.bg.play();
  }

  stopBackground() {
    if (this.bg) this.bg.stop();
  }

  loadSound(name, src) {
    this.sfx[name] = new Howl({ src: [src] });
  }

  play(name) {
    if (this.sfx[name]) this.sfx[name].play();
  }
}

export const soundManager = new SoundManager();
