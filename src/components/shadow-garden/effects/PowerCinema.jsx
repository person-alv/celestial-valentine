import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';

/**
 * PowerCinema — Anime-accurate cinematic overlays for each Legendary Power.
 * Props:
 *   activePowerId: number | null
 *   onComplete: (powerId) => void  — fires when animation finishes
 */
const PowerCinema = ({ activePowerId, onComplete }) => {
  if (activePowerId === null || activePowerId === undefined) return null;

  const cinemas = {
    0: SixEyesCinema,
    1: ShadowArmyCinema,
    2: RulersAuthorityCinema,
    3: InvertedSpearCinema,
    4: DivineDogsCinema,
    5: MagicEyesCinema,
    6: FullCounterCinema,
  };

  const Cinema = cinemas[activePowerId];
  if (!Cinema) return null;
  return <Cinema onComplete={() => onComplete(activePowerId)} />;
};

/* ═══════════════════════════════════════════════════════════════
   POWER 0 ─ SIX EYES: INFINITY  (Gojo Satoru – Jujutsu Kaisen)
   Electric blue veil, Gojo's six-eyed iris, ∞ symbol, row-select prompt
═══════════════════════════════════════════════════════════════ */
const SixEyesCinema = ({ onComplete }) => {
  const overlayRef = useRef();
  const eyeRef = useRef();
  const infinityRef = useRef();
  const textRef = useRef();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current() });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.in' })
      .fromTo(eyeRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: 'back.out(2.5)' }, '-=0.1')
      .fromTo(infinityRef.current,
        { scale: 2.5, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out' }, '-=0.1')
      .fromTo(textRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
      .to(eyeRef.current, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 3, ease: 'sine.inOut' })
      .to(overlayRef.current, { opacity: 0, duration: 0.4, delay: 0.2 });
    return () => tl.kill();
  }, []);

  return (
    <CinemaOverlay ref={overlayRef} $bg="radial-gradient(circle at center, rgba(0,50,100,0.97) 0%, rgba(0,0,20,0.99) 100%)">
      <HeroStack ref={eyeRef} $w="170px" $h="170px">
        {!imgLoaded && (
          <SixEyesEye>
            <EyeOuter />
            <EyeMid />
            <EyeInner />
            <EyePupil />
            {[...Array(6)].map((_, i) => (
              <EyeRay key={i} $angle={i * 60} />
            ))}
          </SixEyesEye>
        )}
        <CinemaHeroImg src="/images/powers/cinema_0.png" $glow="#00BFFF"
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      </HeroStack>
      <InfinitySymbol ref={infinityRef}>∞</InfinitySymbol>
      <CinemaLabel ref={textRef} $color="#00BFFF">
        SIX EYES: INFINITY
        <CinemaInstruction>— SELECT A ROW TO OBLITERATE —</CinemaInstruction>
      </CinemaLabel>
    </CinemaOverlay>
  );
};

/* ═══════════════════════════════════════════════════════════════
   POWER 1 ─ SHADOW MONARCH'S ARMY  (Sung Jinwoo – Solo Leveling)
   Screen to near-black, crown descends, ARISE slams in, shadow wisps rise
═══════════════════════════════════════════════════════════════ */
const ShadowArmyCinema = ({ onComplete }) => {
  const overlayRef = useRef();
  const crownRef = useRef();
  const ariseRef = useRef();
  const wispsRef = useRef();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current() });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power3.in' })
      .fromTo(crownRef.current,
        { y: -80, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'bounce.out' }, '-=0.1')
      .fromTo(ariseRef.current,
        { y: 60, opacity: 0, scale: 0.6, letterSpacing: '-0.1em' },
        { y: 0, opacity: 1, scale: 1, letterSpacing: '0.3em', duration: 0.5, ease: 'elastic.out(1, 0.5)' }, '-=0.1')
      .fromTo('.shadow-wisp', { y: 120, opacity: 0, scale: 0.3 }, {
        y: 0, opacity: 1, scale: 1,
        stagger: { amount: 0.4, from: 'random' },
        duration: 0.6, ease: 'power2.out'
      }, '-=0.2')
      .to([crownRef.current, ariseRef.current], { y: -10, duration: 0.15, yoyo: true, repeat: 1 })
      .to(overlayRef.current, { opacity: 0, duration: 0.5, delay: 0.15 });
    return () => tl.kill();
  }, []);

  return (
    <CinemaOverlay ref={overlayRef} $bg="radial-gradient(ellipse at 50% 80%, rgba(60,0,120,0.97) 0%, rgba(0,0,5,0.99) 100%)">
      <HeroStack ref={crownRef} $w="150px" $h="180px">
        {!imgLoaded && <ShadowCrown>♛</ShadowCrown>}
        <CinemaHeroImg src="/images/powers/cinema_1.png" $glow="#9d4edd"
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      </HeroStack>
      <AriseText ref={ariseRef}>ARISE</AriseText>
      <WispField ref={wispsRef}>
        {[...Array(10)].map((_, i) => (
          <ShadowWisp key={i} className="shadow-wisp" $x={10 + i * 9} $size={20 + Math.random() * 20} />
        ))}
      </WispField>
    </CinemaOverlay>
  );
};

/* ═══════════════════════════════════════════════════════════════
   POWER 2 ─ RULER'S AUTHORITY  (Sung Jinwoo – Solo Leveling)
   Board grayscale freeze, purple energy palm descends, "SELECT ANY TWO TILES"
═══════════════════════════════════════════════════════════════ */
const RulersAuthorityCinema = ({ onComplete }) => {
  const overlayRef = useRef();
  const handRef = useRef();
  const textRef = useRef();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current() });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.in' })
      .fromTo(handRef.current,
        { y: -150, opacity: 0, scale: 0.7 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out' }, '-=0.1')
      .fromTo(textRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3 })
      .to(handRef.current, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 2 })
      .to(overlayRef.current, { opacity: 0, duration: 0.45, delay: 0.25 });
    return () => tl.kill();
  }, []);

  return (
    <CinemaOverlay ref={overlayRef} $bg="radial-gradient(ellipse at 50% 30%, rgba(80,0,180,0.95) 0%, rgba(5,0,20,0.97) 100%)">
      <GrayscalePane />
      <HeroStack ref={handRef} $w="150px" $h="180px">
        {!imgLoaded && (
          <AuthorityHand>
            <HandPalm />
            <HandFinger $i={0} /><HandFinger $i={1} /><HandFinger $i={2} /><HandFinger $i={3} /><HandThumb />
            <HandAura />
          </AuthorityHand>
        )}
        <CinemaHeroImg src="/images/powers/cinema_2.png" $glow="#c084fc"
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      </HeroStack>
      <CinemaLabel ref={textRef} $color="#c084fc">
        RULER'S AUTHORITY
        <CinemaInstruction>— SELECT ANY TWO TILES —</CinemaInstruction>
      </CinemaLabel>
    </CinemaOverlay>
  );
};

/* ═══════════════════════════════════════════════════════════════
   POWER 3 ─ INVERTED SPEAR OF HEAVEN  (Toji Fushiguro – JJK)
   Toji silhouette flashes, green/silver spear slashes from top, "SELECT TYPE"
═══════════════════════════════════════════════════════════════ */
const InvertedSpearCinema = ({ onComplete }) => {
  const overlayRef = useRef();
  const silhouetteRef = useRef();
  const spearRef = useRef();
  const textRef = useRef();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [tojiImgLoaded, setTojiImgLoaded] = useState(false);
  const [spearImgFailed, setSpearImgFailed] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current() });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power4.in' })
      .fromTo(silhouetteRef.current,
        { opacity: 0, x: 40 },
        { opacity: 0.7, x: 0, duration: 0.25, ease: 'power2.out' })
      .to(silhouetteRef.current, { opacity: 0, duration: 0.2 })
      .fromTo(spearRef.current,
        { y: '-110%', opacity: 0, scaleX: 0.5 },
        { y: '0%', opacity: 1, scaleX: 1, duration: 0.35, ease: 'power4.in' }, '-=0.05')
      .to(spearRef.current, { scaleX: 1.4, duration: 0.08, yoyo: true, repeat: 1 })
      .fromTo(textRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3 }, '-=0.1')
      .to(overlayRef.current, { opacity: 0, duration: 0.45, delay: 0.4 });
    return () => tl.kill();
  }, []);

  return (
    <CinemaOverlay ref={overlayRef} $bg="radial-gradient(ellipse at 50% 0%, rgba(0,80,40,0.95) 0%, rgba(3,5,3,0.98) 100%)">
      <TojiImageWrapper ref={silhouetteRef}>
        {!tojiImgLoaded && <TojiSilhouette />}
        <img src="/images/powers/cinema_3.png" alt="Toji"
          onLoad={() => setTojiImgLoaded(true)}
          onError={e => { e.currentTarget.style.display = 'none'; }}
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 12px #00FF7F) drop-shadow(0 0 35px #00FF7F55)',
          }}
        />
      </TojiImageWrapper>
      <SpearContainer ref={spearRef}>
        {spearImgFailed ? (
          <>
            <SpearBlade />
            <SpearGlow />
          </>
        ) : (
          <img
            src="/images/powers/cinema_3_spear.png"
            alt="Spear of Heaven"
            onError={() => setSpearImgFailed(true)}
            draggable={false}
            style={{
              width: '160px',
              height: 'auto',
              filter: 'drop-shadow(0 0 20px #00FF7F) drop-shadow(0 0 50px rgba(0,255,127,0.4))',
              userSelect: 'none',
            }}
          />
        )}
      </SpearContainer>
      <CinemaLabel ref={textRef} $color="#00FF7F">
        INVERTED SPEAR OF HEAVEN
        <CinemaInstruction>— CLICK A TILE TO SELECT ITS TYPE —</CinemaInstruction>
      </CinemaLabel>
    </CinemaOverlay>
  );
};

/* ═══════════════════════════════════════════════════════════════
   POWER 4 ─ TEN SHADOWS: DIVINE DOGS  (Megumi Fushiguro – JJK)
   Black + white dog silhouettes flank screen, blue cursed energy, ×2 badge
═══════════════════════════════════════════════════════════════ */
const DivineDogsCinema = ({ onComplete }) => {
  const overlayRef = useRef();
  const dogsHeroRef = useRef();
  const energyRef = useRef();
  const badgeRef = useRef();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current() });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(dogsHeroRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.1')
      .fromTo(energyRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.2')
      .fromTo(badgeRef.current,
        { scale: 0, rotation: -15 },
        { scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1.2, 0.5)' }, '-=0.1')
      .to(dogsHeroRef.current, { y: -8, duration: 0.25, yoyo: true, repeat: 2 })
      .to(overlayRef.current, { opacity: 0, duration: 0.4, delay: 0.2 });
    return () => tl.kill();
  }, []);

  return (
    <CinemaOverlay ref={overlayRef} $bg="radial-gradient(circle at center, rgba(0,30,80,0.96) 0%, rgba(0,0,0,0.98) 100%)">
      <DivineDogsRow>
        <HeroStack ref={dogsHeroRef} $w="260px" $h="150px">
          {!imgLoaded && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
              <DogSilhouette $white>
                <DogBody $white /><DogHead $white /><DogEar $white $left /><DogEar $white /><DogTail $white />
              </DogSilhouette>
              <DogSilhouette $black>
                <DogBody /><DogHead /><DogEar $left /><DogEar /><DogTail />
              </DogSilhouette>
            </div>
          )}
          <CinemaHeroImg src="/images/powers/cinema_4.png" $glow="#00BFFF"
            onLoad={() => setImgLoaded(true)}
            onError={e => { e.currentTarget.style.display = 'none'; }} />
        </HeroStack>
        <CursedEnergyCenter ref={energyRef} />
      </DivineDogsRow>
      <MultiplierBadge ref={badgeRef}>×2</MultiplierBadge>
      <CinemaLabel $color="#00BFFF">
        TEN SHADOWS: DIVINE DOGS
        <CinemaInstruction>— SCORE MULTIPLIER ACTIVE: 15s —</CinemaInstruction>
      </CinemaLabel>
    </CinemaOverlay>
  );
};

/* ═══════════════════════════════════════════════════════════════
   POWER 5 ─ MAGIC EYES OF DESTRUCTION  (Anos Voldigoad – Misfit)
   Crimson eye-glow, screen pulse red, spinning magic circles at corners, lightning
═══════════════════════════════════════════════════════════════ */
const MagicEyesCinema = ({ onComplete }) => {
  const overlayRef = useRef();
  const eyesRef = useRef();
  const textRef = useRef();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current() });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power4.in' })
      .fromTo(eyesRef.current,
        { scale: 3, opacity: 0, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' })
      .to(overlayRef.current, { backgroundColor: 'rgba(100,0,0,0.4)', duration: 0.15, yoyo: true, repeat: 3 }, '-=0.2')
      .fromTo('.magic-circle', { scale: 0, rotation: 0, opacity: 0 }, {
        scale: 1, rotation: 360, opacity: 1,
        duration: 0.5, stagger: 0.08, ease: 'back.out(2)'
      }, '-=0.3')
      .fromTo(textRef.current, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.3 })
      .to(eyesRef.current, { filter: 'brightness(2)', duration: 0.1, yoyo: true, repeat: 3 })
      .to(overlayRef.current, { opacity: 0, duration: 0.5, delay: 0.15 });
    return () => tl.kill();
  }, []);

  return (
    <CinemaOverlay ref={overlayRef} $bg="radial-gradient(circle at center, rgba(60,0,0,0.97) 0%, rgba(0,0,0,0.99) 100%)">
      <HeroStack ref={eyesRef} $w="210px" $h="120px">
        {!imgLoaded && (
          <AnosEyes>
            <AnosEye /><AnosEye />
          </AnosEyes>
        )}
        <CinemaHeroImg src="/images/powers/cinema_5.png" $glow="#FF2020"
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      </HeroStack>
      {/* Magic circles at 4 corners */}
      <MagicCircle className="magic-circle" $pos="top: 8%; left: 8%"  />
      <MagicCircle className="magic-circle" $pos="top: 8%; right: 8%" />
      <MagicCircle className="magic-circle" $pos="bottom: 8%; left: 8%"  />
      <MagicCircle className="magic-circle" $pos="bottom: 8%; right: 8%" />
      {/* Corner lightning lines */}
      <LightningLine $from="8% 8%"   $to="92% 92%" />
      <LightningLine $from="92% 8%"  $to="8% 92%"  />
      <CinemaLabel ref={textRef} $color="#FF2020">
        MAGIC EYES OF DESTRUCTION
        <CinemaInstruction>— OBLITERATING ALL FOUR CORNERS —</CinemaInstruction>
      </CinemaLabel>
    </CinemaOverlay>
  );
};

/* ═══════════════════════════════════════════════════════════════
   POWER 6 ─ FULL COUNTER  (Meliodas – Seven Deadly Sins)
   Broken sword appears, golden energy burst, "FULL COUNTER!" slams, score x3
═══════════════════════════════════════════════════════════════ */
const FullCounterCinema = ({ onComplete }) => {
  const overlayRef = useRef();
  const swordRef = useRef();
  const textRef = useRef();
  const multiplierRef = useRef();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => onCompleteRef.current() });
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power4.in' })
      .fromTo(swordRef.current,
        { rotation: -40, scale: 0.2, opacity: 0, x: -60 },
        { rotation: 0, scale: 1, opacity: 1, x: 0, duration: 0.45, ease: 'back.out(2)' })
      .to(overlayRef.current, { backgroundColor: 'rgba(255,200,0,0.25)', duration: 0.1, yoyo: true, repeat: 4 }, '-=0.2')
      .fromTo(textRef.current,
        { y: -60, scale: 1.5, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' }, '-=0.1')
      .fromTo(multiplierRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.5)' })
      .to(swordRef.current, { rotation: 15, duration: 0.1, yoyo: true, repeat: 3, ease: 'sine.inOut' })
      .to(overlayRef.current, { opacity: 0, duration: 0.5, delay: 0.2 });
    return () => tl.kill();
  }, []);

  return (
    <CinemaOverlay ref={overlayRef} $bg="radial-gradient(circle at center, rgba(80,60,0,0.97) 0%, rgba(0,0,0,0.98) 100%)">
      <HeroStack ref={swordRef} $w="150px" $h="220px">
        {!imgLoaded && (
          <BrokenSword>
            <SwordBlade $top />
            <SwordGuard />
            <SwordBlade $bottom />
            <SwordAura />
          </BrokenSword>
        )}
        <CinemaHeroImg src="/images/powers/cinema_6.png" $glow="#FFD700"
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
      </HeroStack>
      <FullCounterText ref={textRef}>FULL COUNTER</FullCounterText>
      <MultiplierBadge ref={multiplierRef} $gold>×3 SCORE</MultiplierBadge>
    </CinemaOverlay>
  );
};

/* ════════════════════════════════════════════
   SHARED BASE STYLES
════════════════════════════════════════════ */
const CinemaOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 500;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${p => p.$bg || 'rgba(0,0,0,0.88)'};
  pointer-events: none;
`;

const CinemaLabel = styled.div`
  margin-top: 12px;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(9px, 1.8vw, 14px);
  color: ${p => p.$color || 'white'};
  letter-spacing: 0.25em;
  text-align: center;
  text-shadow: 0 0 20px ${p => p.$color || 'white'}, 0 0 50px ${p => p.$color || 'white'};
`;

const CinemaInstruction = styled.div`
  margin-top: 6px;
  font-family: monospace;
  font-size: clamp(7px, 1vw, 10px);
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.15em;
  animation: pulse 1s ease-in-out infinite;
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
`;

/* ──── SIX EYES STYLES ──── */
const SixEyesEye = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EyeOuter = styled.div`
  position: absolute;
  width: 90px; height: 90px;
  border-radius: 50%;
  border: 3px solid #00BFFF;
  box-shadow: 0 0 20px #00BFFF, 0 0 50px rgba(0,191,255,0.4), inset 0 0 20px rgba(0,191,255,0.1);
`;

const EyeMid = styled.div`
  position: absolute;
  width: 58px; height: 58px;
  border-radius: 50%;
  border: 2px solid rgba(0,191,255,0.7);
  box-shadow: 0 0 10px rgba(0,191,255,0.5);
`;

const EyeInner = styled.div`
  position: absolute;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,191,255,0.5) 0%, rgba(0,100,200,0.3) 100%);
  border: 2px solid #00BFFF;
  box-shadow: 0 0 14px #00BFFF;
`;

const EyePupil = styled.div`
  position: absolute;
  width: 9px; height: 9px;
  border-radius: 50%;
  background: #00BFFF;
  box-shadow: 0 0 10px #00BFFF;
`;

const EyeRay = styled.div`
  position: absolute;
  width: 2px; height: 70px;
  background: linear-gradient(to top, transparent, rgba(0,191,255,0.6), transparent);
  transform-origin: center bottom;
  transform: rotate(${p => p.$angle}deg) translateY(-50px);
  left: 50%; top: 50%;
  margin-left: -1px; margin-top: -70px;
`;

const spinAnim = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

const InfinitySymbol = styled.div`
  font-size: clamp(32px, 6vw, 52px);
  color: #00BFFF;
  text-shadow: 0 0 20px #00BFFF, 0 0 50px rgba(0,191,255,0.5);
  font-family: 'Orbitron', sans-serif;
  margin-top: 4px;
  animation: ${spinAnim} 8s linear infinite;
`;

/* ──── SHADOW ARMY STYLES ──── */
const ShadowCrown = styled.div`
  font-size: clamp(32px, 6vw, 50px);
  color: #9d4edd;
  text-shadow: 0 0 20px #9d4edd, 0 0 50px rgba(123,44,191,0.6);
  line-height: 1;
`;

const AriseText = styled.div`
  font-family: 'Bangers', cursive;
  font-size: clamp(36px, 7vw, 64px);
  color: white;
  letter-spacing: 0.3em;
  text-shadow: 0 0 30px rgba(123,44,191,0.8), 0 3px 0 rgba(80,0,160,0.9);
  line-height: 1;
  -webkit-text-stroke: 1px rgba(123,44,191,0.5);
`;

const WispField = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 40%;
`;

const wispFloat = keyframes`
  0%   { transform: translateY(0) scale(1); opacity:0.7; }
  50%  { transform: translateY(-30px) scale(1.2); opacity:1; }
  100% { transform: translateY(-60px) scale(0.6); opacity:0; }
`;

const ShadowWisp = styled.div`
  position: absolute;
  left: ${p => p.$x}%;
  bottom: 0;
  width: ${p => p.$size}px;
  height: ${p => p.$size * 1.4}px;
  background: radial-gradient(ellipse at center, rgba(123,44,191,0.8) 0%, rgba(40,0,80,0.4) 60%, transparent 100%);
  border-radius: 50% 50% 40% 40%;
  filter: blur(3px);
  animation: ${wispFloat} 1.8s ease-out infinite;
`;

/* ──── RULER'S AUTHORITY STYLES ──── */
const GrayscalePane = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: grayscale(0.8) brightness(0.7);
  pointer-events: none;
`;

const AuthorityHand = styled.div`
  position: relative;
  width: 100px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HandAura = styled.div`
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(157,78,221,0.6) 0%, transparent 70%);
  animation: pulseAura 0.8s ease-in-out infinite;
  @keyframes pulseAura { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
`;

const HandPalm = styled.div`
  width: 70px; height: 65px;
  background: linear-gradient(135deg, #4a1a8a, #7b2cbf);
  border-radius: 10px 10px 5px 5px;
  box-shadow: 0 0 20px rgba(123,44,191,0.6);
`;

const HandFinger = styled.div`
  position: absolute;
  top: -32px;
  left: ${p => 8 + p.$i * 15}px;
  width: 12px; height: 35px;
  background: linear-gradient(to top, #7b2cbf, #9d4edd);
  border-radius: 6px 6px 0 0;
  box-shadow: 0 0 8px rgba(123,44,191,0.5);
`;

const HandThumb = styled.div`
  position: absolute;
  top: -12px;
  left: -10px;
  width: 12px; height: 28px;
  background: linear-gradient(to top, #7b2cbf, #9d4edd);
  border-radius: 6px 6px 0 0;
  transform: rotate(-25deg);
  box-shadow: 0 0 8px rgba(123,44,191,0.5);
`;

/* ──── INVERTED SPEAR STYLES ──── */
const TojiSilhouette = styled.div`
  width: 60px; height: 120px;
  background: rgba(200,220,200,0.15);
  clip-path: polygon(30% 0%, 70% 0%, 90% 20%, 90% 50%, 70% 55%, 80% 100%, 20% 100%, 30% 55%, 10% 50%, 10% 20%);
  filter: blur(2px);
`;

const SpearContainer = styled.div`
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpearBlade = styled.div`
  width: 8px;
  height: 45vh;
  background: linear-gradient(to bottom,
    transparent,
    rgba(0,255,127,0.9) 10%,
    rgba(200,255,200,1) 50%,
    rgba(0,255,127,0.9) 90%,
    transparent
  );
  box-shadow: 0 0 20px #00FF7F, 0 0 50px rgba(0,255,127,0.4);
`;

const SpearGlow = styled.div`
  position: absolute;
  top: 0; bottom: 0;
  left: -15px; right: -15px;
  background: linear-gradient(to bottom, transparent, rgba(0,255,127,0.15), transparent);
  filter: blur(8px);
`;

/* ──── DIVINE DOGS STYLES ──── */
const DivineDogsRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 60px;
  margin-bottom: 8px;
`;

const DogSilhouette = styled.div`
  position: relative;
  width: 80px; height: 60px;
  filter: drop-shadow(0 0 12px ${p => p.$white ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}),
          drop-shadow(0 0 30px ${p => p.$white ? 'rgba(200,200,255,0.4)' : 'rgba(0,180,255,0.4)'});
`;

const DogBody = styled.div`
  position: absolute;
  bottom: 5px; left: 10px;
  width: 60px; height: 35px;
  background: ${p => p.$white ? 'rgba(240,240,255,0.9)' : 'rgba(10,10,20,0.95)'};
  border-radius: 50%;
`;

const DogHead = styled.div`
  position: absolute;
  bottom: 30px; right: 5px;
  width: 30px; height: 28px;
  background: ${p => p.$white ? 'rgba(240,240,255,0.9)' : 'rgba(10,10,20,0.95)'};
  border-radius: 50% 50% 40% 40%;
`;

const DogEar = styled.div`
  position: absolute;
  bottom: 50px;
  ${p => p.$left ? 'right: 22px;' : 'right: 8px;'}
  width: 12px; height: 18px;
  background: ${p => p.$white ? 'rgba(240,240,255,0.9)' : 'rgba(10,10,20,0.95)'};
  border-radius: 50% 50% 0 0;
  transform: ${p => p.$left ? 'rotate(-10deg)' : 'rotate(10deg)'};
`;

const DogTail = styled.div`
  position: absolute;
  bottom: 20px; left: 0;
  width: 20px; height: 10px;
  background: ${p => p.$white ? 'rgba(240,240,255,0.9)' : 'rgba(10,10,20,0.95)'};
  border-radius: 50%;
  transform: rotate(-30deg);
`;

const cursedSpin = keyframes`
  from { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.15); }
  to   { transform: rotate(360deg) scale(1); }
`;

const CursedEnergyCenter = styled.div`
  width: 60px; height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,191,255,0.8) 0%, rgba(0,100,200,0.3) 50%, transparent 70%);
  box-shadow: 0 0 30px rgba(0,191,255,0.6), 0 0 80px rgba(0,191,255,0.2);
  animation: ${cursedSpin} 1.5s linear infinite;
`;

const MultiplierBadge = styled.div`
  font-family: 'Bangers', cursive;
  font-size: clamp(22px, 4vw, 36px);
  color: ${p => p.$gold ? '#FFD700' : '#00BFFF'};
  text-shadow: 0 0 16px currentColor, 0 0 40px currentColor;
  letter-spacing: 0.1em;
  margin-top: 4px;
`;

/* ──── MAGIC EYES STYLES ──── */
const AnosEyes = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 8px;
`;

const eyePulse = keyframes`
  0%,100% { box-shadow: 0 0 20px #FF0000, 0 0 60px rgba(200,0,0,0.5); }
  50%      { box-shadow: 0 0 40px #FF0000, 0 0 120px rgba(200,0,0,0.8); }
`;

const AnosEye = styled.div`
  width: 55px; height: 55px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ff6060 0%, #cc0000 40%, #400000 100%);
  animation: ${eyePulse} 0.6s ease-in-out infinite;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(0,0,0,0.85);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 8px rgba(255,0,0,0.5);
  }
`;

const circleSpin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(-360deg)}`;

const MagicCircle = styled.div`
  position: absolute;
  ${p => p.$pos};
  width: 70px; height: 70px;
  border-radius: 50%;
  border: 2px solid rgba(255,30,30,0.8);
  box-shadow: 0 0 15px rgba(255,0,0,0.5), inset 0 0 15px rgba(255,0,0,0.2);
  animation: ${circleSpin} 1.5s linear infinite;
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 1px solid rgba(255,80,80,0.5);
  }
  &::after {
    content: '';
    position: absolute;
    inset: 16px;
    border-radius: 50%;
    border: 1px solid rgba(255,100,100,0.3);
  }
`;

const LightningLine = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255,0,0,0.15) 45%,
    rgba(255,50,50,0.4) 50%,
    rgba(255,0,0,0.15) 55%,
    transparent 100%
  );
  pointer-events: none;
`;

/* ──── FULL COUNTER STYLES ──── */
const BrokenSword = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
`;

const SwordAura = styled.div`
  position: absolute;
  inset: -30px;
  background: radial-gradient(circle, rgba(255,200,0,0.4) 0%, transparent 70%);
  animation: pulseGold 0.5s ease-in-out infinite;
  @keyframes pulseGold { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
`;

const SwordBlade = styled.div`
  width: ${p => p.$top ? '10px' : '10px'};
  height: ${p => p.$top ? '80px' : '60px'};
  background: linear-gradient(
    to ${p => p.$top ? 'top' : 'bottom'},
    transparent,
    rgba(255,215,0,0.9) 20%,
    rgba(255,255,200,1) 50%,
    rgba(255,215,0,0.9) 80%,
    transparent
  );
  clip-path: ${p => p.$top
    ? 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
    : 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)'};
  box-shadow: 0 0 15px rgba(255,215,0,0.7);
  transform: ${p => p.$bottom ? 'rotate(8deg) translateX(4px)' : 'none'};
`;

const SwordGuard = styled.div`
  width: 40px; height: 10px;
  background: linear-gradient(to right, rgba(255,150,0,0.8), rgba(255,215,0,1), rgba(255,150,0,0.8));
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255,215,0,0.6);
  margin: 2px 0;
`;

const goldFlash = keyframes`
  0%   { text-shadow: 0 0 20px #FFD700, 0 0 50px #FFD700; }
  50%  { text-shadow: 0 0 60px #FFD700, 0 0 120px rgba(255,215,0,0.6); }
  100% { text-shadow: 0 0 20px #FFD700, 0 0 50px #FFD700; }
`;

const FullCounterText = styled.div`
  font-family: 'Bangers', cursive;
  font-size: clamp(28px, 5.5vw, 50px);
  color: #FFD700;
  letter-spacing: 0.2em;
  animation: ${goldFlash} 0.5s ease-in-out infinite;
  -webkit-text-stroke: 1px rgba(255,150,0,0.5);
`;

/* ──── IMAGE INTEGRATION STYLES ──── */

// GSAP animation target — contains CSS art + image overlay.
// Always sized so the image has a fixed canvas to land on.
const HeroStack = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${p => p.$w || '120px'};
  height: ${p => p.$h || '120px'};
  min-width: ${p => p.$w || '120px'};
  min-height: ${p => p.$h || '120px'};
`;

// Image overlay that covers the CSS art. onError → display:none reveals CSS art.
const CinemaHeroImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter:
    drop-shadow(0 0 14px ${p => p.$glow})
    drop-shadow(0 0 45px ${p => p.$glow}55)
    drop-shadow(0 0 80px ${p => p.$glow}25);
  z-index: 1;
  pointer-events: none;
  user-select: none;
  will-change: transform, opacity;
`;

// Toji wrapper: absolutely positioned in overlay, holds CSS art + image overlay.
const TojiImageWrapper = styled.div`
  position: absolute;
  right: 15%;
  top: 15%;
  width: 110px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default PowerCinema;
