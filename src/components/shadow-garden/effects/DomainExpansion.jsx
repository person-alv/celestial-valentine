import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useSound } from '../../../hooks/useSound';

const DomainExpansion = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const { playSFX } = useSound();

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 1000);
      }
    });

    // Step 1: Darken and focus
    tl.to(containerRef.current, {
      backgroundColor: 'rgba(0, 0, 0, 1)',
      duration: 1,
      ease: 'power4.inOut'
    });

    // Step 2: System Proclamation
    tl.fromTo(textRef.current, 
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
    );

    tl.add(() => {
      playSFX('domain_expansion', '/sounds/shadow-garden/sfx/domain_expansion.mp3');
    }, "-=0.5");

    // Step 3: Pulsing "INFINITE LOVE"
    tl.to(".domain-title", {
      textShadow: "0 0 30px rgba(255, 215, 0, 1)",
      scale: 1.1,
      duration: 0.2,
      repeat: 5,
      yoyo: true
    });

    // Step 4: White Flash
    tl.to(containerRef.current, {
      backgroundColor: 'white',
      duration: 0.5,
      delay: 1
    });

    // Step 5: Fade out
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 2
    });

  }, [onComplete, playSFX]);

  return (
    <Container ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div ref={textRef} className="text-center">
        <h2 className="font-orbitron text-white text-2xl tracking-[0.5rem] mb-4">DOMAIN EXPANSION</h2>
        <h1 className="domain-title font-bangers text-sg-gold text-8xl italic tracking-widest drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
          INFINITE LOVE
        </h1>
        <div className="mt-8 font-mono text-sg-purple text-sm animate-pulse">
          [ UNLOCKING HEART REALM: 100% ]
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background: rgba(0, 0, 0, 0);
`;

export default DomainExpansion;
