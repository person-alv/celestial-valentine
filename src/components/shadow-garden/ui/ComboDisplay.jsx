import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import gsap from 'gsap';

/**
 * ComboDisplay — floating combo counter with escalating anime energy.
 *   2–3:   white  · subtle slam
 *   4–6:   gold   · stronger slam + glow
 *   7–9:   purple · EXCELLENT! banner + screen flash
 *  10+:    rainbow· ×2 multiplier already dispatched in useMatch3
 */
const ComboDisplay = ({ comboCount }) => {
  const numberRef = useRef(null);
  const labelRef  = useRef(null);
  const excellentRef = useRef(null);

  // Slam animation every time combo increments
  useEffect(() => {
    if (comboCount < 2) return;

    const numEl = numberRef.current;
    const lblEl = labelRef.current;
    if (!numEl || !lblEl) return;

    gsap.killTweensOf([numEl, lblEl]);

    // Slam number in
    gsap.fromTo(numEl,
      { scale: 1.8, opacity: 0, y: -20 },
      { scale: 1,   opacity: 1, y: 0, duration: 0.25, ease: 'back.out(3)' }
    );
    gsap.fromTo(lblEl,
      { opacity: 0, x: 10 },
      { opacity: 1, x: 0, duration: 0.2, delay: 0.05 }
    );

    // EXCELLENT! at 7+
    if (comboCount >= 7 && excellentRef.current) {
      gsap.killTweensOf(excellentRef.current);
      gsap.fromTo(excellentRef.current,
        { scale: 1.5, opacity: 0, rotation: -5 },
        { scale: 1,   opacity: 1, rotation: 0, duration: 0.35, ease: 'elastic.out(1.2, 0.5)' }
      );
      // Screen flash
      const flash = document.createElement('div');
      flash.style.cssText = `
        position:fixed;inset:0;pointer-events:none;z-index:9500;
        background:${comboCount >= 10
          ? 'linear-gradient(135deg,rgba(255,215,0,0.25),rgba(123,44,191,0.25))'
          : 'rgba(123,44,191,0.18)'};
      `;
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 0, duration: 0.4, onComplete: () => flash.remove() });
    }
  }, [comboCount]);

  // Fade out when combo resets
  useEffect(() => {
    if (comboCount === 0) {
      const numEl = numberRef.current;
      const lblEl = labelRef.current;
      const excEl = excellentRef.current;
      if (numEl) gsap.to(numEl, { opacity: 0, scale: 0.6, duration: 0.3 });
      if (lblEl) gsap.to(lblEl, { opacity: 0, duration: 0.3 });
      if (excEl) gsap.to(excEl, { opacity: 0, duration: 0.2 });
    }
  }, [comboCount]);

  if (comboCount < 2) return null;

  const tier = comboCount >= 10 ? 'rainbow' : comboCount >= 7 ? 'purple' : comboCount >= 4 ? 'gold' : 'white';

  return (
    <Container>
      {comboCount >= 7 && (
        <ExcellentBanner ref={excellentRef} $tier={tier}>
          {comboCount >= 10 ? '⚡ MAX COMBO ⚡' : '✦ EXCELLENT! ✦'}
        </ExcellentBanner>
      )}

      <NumberRow>
        <ComboNumber ref={numberRef} $tier={tier}>
          {comboCount}
        </ComboNumber>
        <ComboLabel ref={labelRef} $tier={tier}>
          <span>COMBO</span>
          {comboCount >= 10 && <MultiplierTag>×2 SCORE</MultiplierTag>}
        </ComboLabel>
      </NumberRow>

      {/* Energy bar under the number — fills proportionally to tier */}
      <EnergyBar>
        <EnergyFill $tier={tier} $pct={Math.min(comboCount * 8, 100)} />
      </EnergyBar>
    </Container>
  );
};

/* ── Animations ── */
const pulseGold = keyframes`
  0%,100% { text-shadow: 0 0 15px #FFD700, 0 0 40px rgba(255,215,0,0.4); }
  50%      { text-shadow: 0 0 30px #FFD700, 0 0 80px rgba(255,215,0,0.7); }
`;
const pulsePurple = keyframes`
  0%,100% { text-shadow: 0 0 15px #9d4edd, 0 0 40px rgba(123,44,191,0.5); }
  50%      { text-shadow: 0 0 35px #c084fc, 0 0 90px rgba(157,78,221,0.7); }
`;
const rainbowShift = keyframes`
  0%   { color: #FFD700; }
  25%  { color: #FF69B4; }
  50%  { color: #00BFFF; }
  75%  { color: #9d4edd; }
  100% { color: #FFD700; }
`;
const excellentSlide = keyframes`
  0%,100% { letter-spacing: 0.3em; }
  50%      { letter-spacing: 0.45em; }
`;

/* ── Styled components ── */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
  user-select: none;
`;

const ExcellentBanner = styled.div`
  font-family: 'Bangers', cursive;
  font-size: clamp(13px, 2vw, 18px);
  letter-spacing: 0.3em;
  color: ${p => p.$tier === 'rainbow' ? '#FFD700' : '#c084fc'};
  text-shadow: 0 0 20px currentColor;
  animation: ${excellentSlide} 1s ease-in-out infinite,
             ${p => p.$tier === 'rainbow' ? rainbowShift : pulsePurple} 1.2s linear infinite;
`;

const NumberRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const ComboNumber = styled.div`
  font-family: 'Bangers', cursive;
  font-size: clamp(36px, 5vw, 52px);
  line-height: 1;
  will-change: transform, opacity;
  color: ${p => p.$tier === 'white' ? '#ffffff'
              : p.$tier === 'gold'   ? '#FFD700'
              : p.$tier === 'purple' ? '#c084fc'
              : '#FFD700'};
  ${p =>
    p.$tier === 'rainbow' ? css`animation: ${rainbowShift} 0.8s linear infinite;` :
    p.$tier === 'purple'  ? css`animation: ${pulsePurple} 0.8s ease-in-out infinite;` :
    p.$tier === 'gold'    ? css`animation: ${pulseGold} 1s ease-in-out infinite;` :
    'animation: none;'}
`;

const ComboLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  will-change: opacity;

  span {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(8px, 1.2vw, 11px);
    color: ${p => p.$tier === 'white' ? 'rgba(255,255,255,0.6)'
                : p.$tier === 'gold'   ? 'rgba(255,215,0,0.8)'
                : p.$tier === 'purple' ? 'rgba(192,132,252,0.8)'
                : 'rgba(255,215,0,0.8)'};
    letter-spacing: 0.25em;
  }
`;

const MultiplierTag = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(7px, 1vw, 9px);
  color: #00BFFF;
  background: rgba(0,191,255,0.12);
  border: 1px solid rgba(0,191,255,0.4);
  border-radius: 4px;
  padding: 1px 4px;
  letter-spacing: 0.15em;
  text-shadow: 0 0 8px #00BFFF;
`;

const EnergyBar = styled.div`
  width: 80px;
  height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const EnergyFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  border-radius: 2px;
  background: ${p =>
    p.$tier === 'rainbow' ? 'linear-gradient(to right, #FFD700, #FF69B4, #00BFFF, #9d4edd)' :
    p.$tier === 'purple'  ? 'linear-gradient(to right, #7b2cbf, #c084fc)' :
    p.$tier === 'gold'    ? 'linear-gradient(to right, #b8860b, #FFD700)' :
    'rgba(255,255,255,0.6)'};
  box-shadow: 0 0 6px currentColor;
  transition: width 0.25s ease-out;
`;

export default ComboDisplay;
