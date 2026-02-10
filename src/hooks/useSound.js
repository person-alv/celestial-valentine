/**
 * Sound Manager class for handling all audio in the app
 */
class SoundManager {
  constructor() {
    this.sounds = {};
    this.backgroundMusic = null;
    this.isSFXMuted = false;
    this.isMusicMuted = false;
  }

  /**
   * Load a sound file
   * @param {string} name - Sound identifier
   * @param {string} path - Path to sound file
   */
  loadSound(name, path) {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds[name] = audio;
    } catch (error) {
      console.error(`Failed to load sound "${name}":`, error);
    }
  }

  /**
   * Play a sound effect
   * @param {string} name - Sound identifier
   * @param {boolean} loop - Whether to loop the sound
   */
  play(name, loop = false) {
    if (this.isSFXMuted) return;

    const sound = this.sounds[name];
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.loop = loop;
        sound.play().catch(e => {
          // Silence common errors about interaction
        });
      } catch (error) {
        console.error(`Error playing sound "${name}":`, error);
      }
    }
  }

  /**
   * Play background music
   * @param {string} path - Path to music file
   * @param {number} volume - Volume (0-1)
   */
  playBackground(path, volume = 0.3) {
    if (this.backgroundMusic) {
      if (this.backgroundMusic.src.includes(path)) {
        // Same track, just ensure it's playing if allowed
        if (!this.isMusicMuted && this.backgroundMusic.paused) {
          this.backgroundMusic.play().catch(() => {});
        }
        return;
      } else {
        // Different track, stop old one
        this.backgroundMusic.pause();
      }
    }

    try {
      this.backgroundMusic = new Audio(path);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = volume;

      if (!this.isMusicMuted) {
        this.backgroundMusic.play().catch(e => {
          console.log('Background music play failed (user interaction required)');
        });
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }

  /**
   * Toggle mute for sound effects
   */
  toggleSFX() {
    this.isSFXMuted = !this.isSFXMuted;
    if (this.isSFXMuted) {
      Object.values(this.sounds).forEach(sound => {
        if (!sound.paused) sound.pause();
      });
    }
    return this.isSFXMuted;
  }

  /**
   * Toggle mute for background music
   */
  toggleMusic() {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.backgroundMusic) {
      if (this.isMusicMuted) {
        this.backgroundMusic.pause();
      } else {
        this.backgroundMusic.play().catch(() => {});
      }
    }
    return this.isMusicMuted;
  }

  getSFXMuteState() { return this.isSFXMuted; }
  getMusicMuteState() { return this.isMusicMuted; }
}

// Create singleton instance
export const soundManager = new SoundManager();

/**
 * React hook for playing sounds
 */
export const useSound = () => {
  const play = (name, loop = false) => {
    soundManager.play(name, loop);
  };

  const playBackground = (path, volume = 0.3) => {
    soundManager.playBackground(path, volume);
  };

  const toggleSFX = () => soundManager.toggleSFX();
  const toggleMusic = () => soundManager.toggleMusic();
  const isSFXMuted = () => soundManager.getSFXMuteState();
  const isMusicMuted = () => soundManager.getMusicMuteState();

  return { play, playBackground, toggleSFX, toggleMusic, isSFXMuted, isMusicMuted };
};

export default useSound;