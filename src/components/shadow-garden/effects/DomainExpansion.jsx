import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';

/**
 * DomainExpansion — Full 5-stage 15-20s cinematic for Level 5 win.
 * Stage 1: Avatar grows, power colors radiate, outstretched hand
 * Stage 2: Black screen slam — "DOMAIN EXPANSION: INFINITE LOVE"
 * Stage 3: Color explosion, orbiting light fragments
 * Stage 4: Fragments become hearts, spiral inward toward a bloom
 * Stage 5: Heart Domain door reveal — white light, navigate to music room
 *
 * Uses ref pattern + [] deps so re-renders never restart the timeline.
 */
const DomainExpansion = ({ onComplete, onAudioStart }) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onAudioStartRef = useRef(onAudioStart);
  onAudioStartRef.current = onAudioStart;

  // Stage refs
  const rootRef      = useRef(null);
  const stage1Ref    = useRef(null);
  const avatarRef    = useRef(null);
  const handRef      = useRef(null);
  const raysRef      = useRef(null);
  const stage2Ref    = useRef(null);
  const declRef      = useRef(null);
  const titleRef     = useRef(null);
  const stage3Ref    = useRef(null);
  const stage4Ref    = useRef(null);
  const bloomRef     = useRef(null);
  const stage5Ref    = useRef(null);
  const doorRef      = useRef(null);
  const doorLightRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current(),
    });

    // ── Initial state: everything hidden ──
    gsap.set([stage1Ref.current, stage2Ref.current, stage3Ref.current, stage4Ref.current, stage5Ref.current], {
      opacity: 0, display: 'none',
    });
    gsap.set(rootRef.current, { opacity: 1 });

    // ══════════════════════════════════════════════
    // STAGE 1 (0–4s): Avatar grows + power aura + hand outstretched
    // ══════════════════════════════════════════════
    tl.set(stage1Ref.current, { display: 'flex' })
      .fromTo(stage1Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.in' })
      .fromTo(avatarRef.current,
        { scale: 0.4, opacity: 0 },
        { scale: 1.2, opacity: 1, duration: 1.2, ease: 'back.out(1.4)' }, '-=0.3')
      .fromTo(raysRef.current,
        { scale: 0, opacity: 0, rotation: 0 },
        { scale: 1, opacity: 1, rotation: 360, duration: 1.5, ease: 'power2.out' }, '-=0.9')
      .fromTo(handRef.current,
        { y: 40, opacity: 0, scale: 0.6 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)' }, '-=0.8')
      .to(avatarRef.current, { scale: 1.35, duration: 0.3, ease: 'power1.inOut', yoyo: true, repeat: 1 })
      .to(stage1Ref.current, { opacity: 0, duration: 0.5, ease: 'power3.in' });

    // ══════════════════════════════════════════════
    // STAGE 2 (4–8s): Black slam — DOMAIN EXPANSION / INFINITE LOVE
    // ══════════════════════════════════════════════
    tl.set(stage1Ref.current, { display: 'none' })
      .set(stage2Ref.current, { display: 'flex' })
      .fromTo(stage2Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power4.in' })
      .fromTo(declRef.current,
        { y: -60, opacity: 0, letterSpacing: '-0.05em' },
        { y: 0, opacity: 1, letterSpacing: '0.4em', duration: 0.55, ease: 'power3.out' })
      .fromTo(titleRef.current,
        { scale: 2.5, opacity: 0, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power4.out' }, '-=0.1')
      .to(titleRef.current, {
        textShadow: '0 0 60px rgba(255,215,0,1), 0 0 120px rgba(255,105,180,0.6)',
        scale: 1.06,
        duration: 0.25, yoyo: true, repeat: 5, ease: 'sine.inOut',
      })
      .to(stage2Ref.current, { opacity: 0, duration: 0.6, delay: 0.3, ease: 'power2.in' });

    // ══════════════════════════════════════════════
    // STAGE 3 (8–11s): Color explosion, orbiting fragments
    // ══════════════════════════════════════════════
    tl.set(stage2Ref.current, { display: 'none' })
      .set(stage3Ref.current, { display: 'flex' })
      .fromTo(stage3Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      .fromTo('.de-fragment', { scale: 0, opacity: 0, x: 0, y: 0 }, {
        scale: 1, opacity: 1,
        x: 'random(-180, 180)', y: 'random(-140, 140)',
        duration: 0.8, stagger: { amount: 0.4, from: 'center' }, ease: 'back.out(2)',
      }, '-=0.2')
      .to('.de-fragment', {
        rotation: 'random(-360, 360)', scale: 0.8,
        duration: 1.5, stagger: { amount: 0.6 }, ease: 'sine.inOut',
      }, '-=0.4')
      .to(stage3Ref.current, { opacity: 0, duration: 0.5, ease: 'power2.in' });

    // ══════════════════════════════════════════════
    // STAGE 4 (11–15s): Fragments become hearts, spiral into bloom
    // ══════════════════════════════════════════════
    tl.set(stage3Ref.current, { display: 'none' })
      .set(stage4Ref.current, { display: 'flex' })
      .fromTo(stage4Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      .fromTo('.de-heart', {
        scale: 0.2, opacity: 0,
        x: 'random(-200, 200)', y: 'random(-150, 150)',
      }, {
        scale: 1, opacity: 1,
        duration: 0.6, stagger: { amount: 0.5, from: 'random' }, ease: 'back.out(2)',
      }, '-=0.2')
      .to('.de-heart', {
        x: 0, y: 0, scale: 0, opacity: 0,
        duration: 1.2, stagger: { amount: 0.8, from: 'edges' }, ease: 'power2.in',
      }, '-=0.2')
      .fromTo(bloomRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1.4, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, '-=0.6')
      .to(stage4Ref.current, { opacity: 0, duration: 0.5, ease: 'power2.in' });

    // ══════════════════════════════════════════════
    // STAGE 5 (15–20s): Heart Domain door / white light
    // ══════════════════════════════════════════════
    tl.set(stage4Ref.current, { display: 'none' })
      .set(stage5Ref.current, { display: 'flex' })
      .call(() => onAudioStartRef.current?.())
      .fromTo(stage5Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .fromTo(doorRef.current,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(doorLightRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to(doorLightRef.current, {
        scale: 8, opacity: 0, duration: 2.5, ease: 'power2.in',
      })
      .to(stage5Ref.current, { opacity: 1, duration: 0 }) // keep visible during whiteout
      .to(rootRef.current, { opacity: 0, duration: 1, ease: 'power1.in', delay: 0.3 });

    return () => tl.kill();
  }, []);

  const FRAGMENT_COLORS = ['#FF69B4', '#9d4edd', '#FFD700', '#00BFFF', '#FF6347', '#7FFF00'];
  const HEART_EMOJIS    = ['💖', '💕', '💗', '💝', '❤️', '💜', '💛', '💙', '🩷', '🌸'];

  return (
    <Root ref={rootRef}>

      {/* ── STAGE 1: Avatar + aura ── */}
      <Stage ref={stage1Ref} $bg="radial-gradient(ellipse at center, #1a003a 0%, #000010 100%)">
        <AuraRays ref={raysRef}>
          {[...Array(12)].map((_, i) => (
            <AuraRay key={i} $angle={i * 30} />
          ))}
        </AuraRays>
        <AvatarGlyph ref={avatarRef}>
          <AvatarCore>♛</AvatarCore>
          <AvatarRing $r={1} />
          <AvatarRing $r={2} />
          <AvatarRing $r={3} />
        </AvatarGlyph>
        <HandGesture ref={handRef}>☞</HandGesture>
        <Stage1Label>A FEELING BEYOND WORDS…</Stage1Label>
      </Stage>

      {/* ── STAGE 2: DOMAIN EXPANSION text slam ── */}
      <Stage ref={stage2Ref} $bg="#000000">
        <DeclText ref={declRef}>DOMAIN EXPANSION</DeclText>
        <TitleText ref={titleRef}>INFINITE LOVE</TitleText>
        <SubText>[ HEART REALM: UNLOCKED ]</SubText>
      </Stage>

      {/* ── STAGE 3: Orbiting fragments ── */}
      <Stage ref={stage3Ref} $bg="radial-gradient(ellipse at center, #0a002a 0%, #000000 100%)">
        <FragmentField>
          {FRAGMENT_COLORS.map((color, i) => (
            [...Array(3)].map((_, j) => (
              <Fragment key={`${i}-${j}`} className="de-fragment" $color={color} $size={10 + j * 6} />
            ))
          ))}
        </FragmentField>
      </Stage>

      {/* ── STAGE 4: Hearts spiraling to bloom ── */}
      <Stage ref={stage4Ref} $bg="radial-gradient(ellipse at center, #1a0028 0%, #000000 100%)">
        <HeartField>
          {HEART_EMOJIS.map((h, i) => (
            <HeartPiece key={i} className="de-heart">{h}</HeartPiece>
          ))}
        </HeartField>
        <Bloom ref={bloomRef}>💗</Bloom>
      </Stage>

      {/* ── STAGE 5: Heart Domain door ── */}
      <Stage ref={stage5Ref} $bg="radial-gradient(ellipse at center, #300040 0%, #0a000f 100%)">
        <DoorFrame ref={doorRef}>
          <DoorInner>
            <DoorGlyph>♾</DoorGlyph>
            <DoorHeart>💖</DoorHeart>
          </DoorInner>
          <DoorLight ref={doorLightRef} />
        </DoorFrame>
        <DoorLabel>ENTER THE HEART DOMAIN</DoorLabel>
      </Stage>

    </Root>
  );
};

/* ── Keyframes ── */
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const rayPulse = keyframes`
  0%,100% { opacity: 0.3; transform: scaleY(1) rotate(var(--angle)); }
  50%      { opacity: 0.8; transform: scaleY(1.15) rotate(var(--angle)); }
`;
const ringPulse = keyframes`
  0%,100% { transform: scale(1); opacity: 0.4; }
  50%      { transform: scale(1.12); opacity: 0.8; }
`;
const heartFloat = keyframes`
  0%,100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-8px) scale(1.1); }
`;
const bloomPulse = keyframes`
  0%,100% { transform: scale(1.4); filter: drop-shadow(0 0 30px rgba(255,105,180,0.8)); }
  50%      { transform: scale(1.55); filter: drop-shadow(0 0 60px rgba(255,105,180,1)); }
`;
const doorGlow = keyframes`
  0%,100% { box-shadow: 0 0 40px rgba(255,105,180,0.6), inset 0 0 40px rgba(255,215,0,0.2); }
  50%      { box-shadow: 0 0 80px rgba(255,105,180,1),   inset 0 0 80px rgba(255,215,0,0.5); }
`;

/* ── Styled components ── */
const Root = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
`;

const Stage = styled.div`
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${p => p.$bg || '#000'};
`;

/* Stage 1 */
const AuraRays = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
`;

const AuraRay = styled.div`
  --angle: ${p => p.$angle}deg;
  position: absolute;
  top: 50%; left: 50%;
  width: 3px;
  height: 200px;
  margin-left: -1.5px;
  transform-origin: top center;
  transform: rotate(${p => p.$angle}deg) translateY(-100%);
  background: linear-gradient(to bottom,
    rgba(255,215,0,0.9), rgba(255,105,180,0.6), rgba(123,44,191,0.3), transparent);
  border-radius: 2px;
  animation: ${rayPulse} 1.5s ease-in-out infinite;
  animation-delay: ${p => p.$angle * 0.004}s;
`;

const AvatarGlyph = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
`;

const AvatarCore = styled.div`
  font-size: 64px;
  color: #FFD700;
  text-shadow: 0 0 30px #FFD700, 0 0 80px rgba(255,215,0,0.5);
  position: relative;
  z-index: 2;
`;

const AvatarRing = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 2px solid ${p =>
    p.$r === 1 ? 'rgba(255,215,0,0.8)' :
    p.$r === 2 ? 'rgba(255,105,180,0.6)' :
                 'rgba(123,44,191,0.5)'};
  width: ${p => p.$r * 55 + 40}px;
  height: ${p => p.$r * 55 + 40}px;
  animation: ${ringPulse} ${p => 1.2 + p.$r * 0.3}s ease-in-out infinite;
  animation-delay: ${p => p.$r * 0.15}s;
`;

const HandGesture = styled.div`
  font-size: 48px;
  margin-top: 16px;
  color: rgba(255,215,0,0.9);
  text-shadow: 0 0 20px rgba(255,215,0,0.7);
`;

const Stage1Label = styled.div`
  margin-top: 20px;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(10px, 1.5vw, 14px);
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.4em;
`;

/* Stage 2 */
const DeclText = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(14px, 2.5vw, 22px);
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.5em;
  margin-bottom: 12px;
`;

const TitleText = styled.div`
  font-family: 'Bangers', cursive;
  font-size: clamp(52px, 10vw, 100px);
  color: #FFD700;
  letter-spacing: 0.15em;
  text-shadow: 0 0 30px #FFD700, 0 0 80px rgba(255,105,180,0.5);
  -webkit-text-stroke: 2px rgba(255,150,0,0.4);
  line-height: 1;
`;

const SubText = styled.div`
  margin-top: 20px;
  font-family: monospace;
  font-size: clamp(9px, 1.2vw, 13px);
  color: #9d4edd;
  letter-spacing: 0.35em;
  text-shadow: 0 0 12px #9d4edd;
`;

/* Stage 3 */
const FragmentField = styled.div`
  position: relative;
  width: 1px;
  height: 1px;
`;

const Fragment = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: radial-gradient(circle, ${p => p.$color} 0%, transparent 70%);
  box-shadow: 0 0 12px ${p => p.$color};
  transform: translate(-50%, -50%);
`;

/* Stage 4 */
const HeartField = styled.div`
  position: relative;
  width: 1px;
  height: 1px;
`;

const HeartPiece = styled.div`
  position: absolute;
  font-size: 28px;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 0 8px rgba(255,105,180,0.8));
  animation: ${heartFloat} 1.2s ease-in-out infinite;
`;

const Bloom = styled.div`
  position: absolute;
  font-size: 80px;
  filter: drop-shadow(0 0 30px rgba(255,105,180,0.9));
  animation: ${bloomPulse} 0.6s ease-in-out infinite;
`;

/* Stage 5 */
const DoorFrame = styled.div`
  position: relative;
  width: 160px;
  height: 240px;
  border: 3px solid rgba(255,105,180,0.9);
  border-radius: 80px 80px 0 0;
  animation: ${doorGlow} 1.2s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.3);
  transform-origin: bottom center;
`;

const DoorInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const DoorGlyph = styled.div`
  font-size: 36px;
  color: #FFD700;
  text-shadow: 0 0 20px #FFD700;
  animation: ${spin} 8s linear infinite;
`;

const DoorHeart = styled.div`
  font-size: 40px;
  filter: drop-shadow(0 0 16px rgba(255,105,180,1));
`;

const DoorLight = styled.div`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,215,0,0.8) 30%, transparent 70%);
`;

const DoorLabel = styled.div`
  margin-top: 24px;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(10px, 1.5vw, 14px);
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.4em;
  text-shadow: 0 0 12px rgba(255,105,180,0.6);
`;

export default DomainExpansion;
