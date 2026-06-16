import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getPowerById } from '../../../data/shadow-garden/powerups';
import { getPowerIntro } from '../../../data/shadow-garden/powerIntros';

/**
 * PowerIntro — compact, mobile-first "New Power Unlocked" reveal.
 * Shows one card per newly-unlocked power (a carousel when a level unlocks two).
 * Hero art reuses the power-up row image (/images/powers/icon_{id}.png) with the
 * power's emoji as fallback. Calls onComplete() once the last card is dismissed.
 */
const PowerIntro = ({ powerIds = [], onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  if (!powerIds.length) return null;

  const id = powerIds[idx];
  const power = getPowerById(id);
  const intro = getPowerIntro(id);
  const isLast = idx >= powerIds.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete?.();
    } else {
      setImgFailed(false);
      setIdx(i => i + 1);
    }
  };

  return (
    <Overlay>
      <Card $color={power.color} key={id}>
        <Kicker>✦ NEW POWER UNLOCKED ✦</Kicker>

        <Hero $color={power.color}>
          {imgFailed
            ? <HeroEmoji>{power.icon}</HeroEmoji>
            : <img
                src={`/images/powers/icon_${id}.png`}
                alt={power.name}
                onError={() => setImgFailed(true)}
                draggable={false}
                style={{ width: '70%', height: '70%', objectFit: 'contain', userSelect: 'none' }}
              />
          }
        </Hero>

        <Name $color={power.color}>{power.name}</Name>
        <Meta>{power.character} · {power.anime}</Meta>
        <Lore>“{intro.lore}”</Lore>

        <Info>
          <Row>
            <Label>EFFECT</Label>
            <Text>{intro.effect}</Text>
          </Row>
          <Row>
            <Label $color={power.color}>HOW TO USE</Label>
            <Text>{intro.howTo}</Text>
          </Row>
        </Info>

        {powerIds.length > 1 && (
          <Dots>
            {powerIds.map((_, i) => <Dot key={i} $active={i === idx} />)}
          </Dots>
        )}

        <NextBtn $color={power.color} onClick={handleNext}>
          {isLast ? 'GOT IT' : 'NEXT →'}
        </NextBtn>
      </Card>
    </Overlay>
  );
};

/* ── Styles (mobile-first) ── */
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const cardIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

const heroGlow = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.3s ease;
`;

const Card = styled.div`
  position: relative;
  width: 90vw;
  max-width: 360px;
  max-height: 90dvh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 20px 18px 18px;
  border-radius: 20px;
  border: 1.5px solid ${p => p.$color}88;
  background: linear-gradient(160deg, rgba(15, 8, 30, 0.98) 0%, rgba(8, 4, 18, 0.98) 100%);
  box-shadow: 0 0 40px ${p => p.$color}33, 0 20px 60px rgba(0, 0, 0, 0.6);
  animation: ${cardIn} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const Kicker = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: #FFD700;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
`;

const Hero = styled.div`
  width: 84px;
  height: 84px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 2px 0;
  background: radial-gradient(circle at 50% 45%, ${p => p.$color}33 0%, transparent 70%);
  filter: drop-shadow(0 0 12px ${p => p.$color}aa);
  animation: ${heroGlow} 2.4s ease-in-out infinite;
`;

const HeroEmoji = styled.div`
  font-size: 44px;
  line-height: 1;
`;

const Name = styled.h2`
  font-family: 'Bangers', cursive;
  font-size: clamp(22px, 6vw, 28px);
  letter-spacing: 0.04em;
  line-height: 1.05;
  color: ${p => p.$color};
  text-shadow: 0 0 18px ${p => p.$color}66;
  margin: 0;
`;

const Meta = styled.div`
  font-family: monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
`;

const Lore = styled.p`
  font-family: 'Dancing Script', cursive;
  font-size: clamp(15px, 4.2vw, 18px);
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.85);
  margin: 2px 0 4px;
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 2px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
`;

const Label = styled.span`
  font-family: 'Orbitron', sans-serif;
  font-size: 8px;
  letter-spacing: 0.22em;
  color: ${p => p.$color || 'rgba(255, 255, 255, 0.4)'};
`;

const Text = styled.span`
  font-family: 'Quicksand', sans-serif;
  font-size: 13px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.92);
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;
`;

const Dot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${p => p.$active ? '#FFD700' : 'rgba(255, 255, 255, 0.25)'};
  box-shadow: ${p => p.$active ? '0 0 8px rgba(255, 215, 0, 0.7)' : 'none'};
  transition: all 0.2s ease;
`;

const NextBtn = styled.button`
  width: 100%;
  margin-top: 8px;
  min-height: 44px;
  padding: 12px;
  border-radius: 999px;
  font-family: 'Orbitron', sans-serif;
  font-size: 13px;
  letter-spacing: 0.15em;
  color: #0a0a14;
  background: linear-gradient(135deg, ${p => p.$color} 0%, #FFD700 140%);
  box-shadow: 0 6px 20px ${p => p.$color}55;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  &:hover { transform: scale(1.03); }
  &:active { transform: scale(0.97); }
`;

export default PowerIntro;
