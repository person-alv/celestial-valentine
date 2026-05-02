import gsap from 'gsap';

// GSAP Global Configuration
gsap.config({
  force3D: true,
  nullTargetWarn: false
});

/**
 * Shadow Garden Animation Presets
 */
export const gameAnimations = {
  // Tile animations
  tileMatch: (element) => {
    return gsap.to(element, {
      scale: 0,
      rotation: 180,
      opacity: 0,
      duration: 0.4,
      ease: 'back.in(1.7)'
    });
  },
  
  tileFall: (element, delay = 0) => {
    return gsap.fromTo(element,
      { y: -100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5,
        delay,
        ease: 'bounce.out'
      }
    );
  },
  
  tileSwap: (element1, element2, onComplete) => {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    const deltaX = rect2.left - rect1.left;
    const deltaY = rect2.top - rect1.top;
    
    const tl = gsap.timeline({ onComplete });
    
    tl.to(element1, { x: deltaX, y: deltaY, duration: 0.3, ease: 'power2.inOut' }, 0);
    tl.to(element2, { x: -deltaX, y: -deltaY, duration: 0.3, ease: 'power2.inOut' }, 0);
    
    return tl;
  },

  tileSelect: (element) => {
    return gsap.to(element, {
      scale: 1.1,
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
      duration: 0.2,
      ease: 'power2.out'
    });
  },

  // Boss animations
  bossHit: (element) => {
    return gsap.timeline()
      .to(element, { x: -5, duration: 0.05 })
      .to(element, { x: 5, duration: 0.05 })
      .to(element, { x: -5, duration: 0.05 })
      .to(element, { x: 0, duration: 0.05 });
  },

  // UI animations
  comboFlash: () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.2);pointer-events:none;z-index:99;';
    document.body.appendChild(overlay);
    
    return gsap.to(overlay, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => overlay.remove()
    });
  }
};
