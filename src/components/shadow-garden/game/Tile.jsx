import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { TILE_TYPES } from '../../../utils/match3/board';

const Tile = ({ tile, row, col, isSelected, isProcessing, onClick, isRowHighlighted, isTypeTargeting, isDragging, dragOffset }) => {
  const animRef = useRef(null);
  const prevTileRef = useRef(tile);
  const isFirstMount = useRef(true);
  const [imgFailed, setImgFailed] = useState(false);

  // Reset image-failed state when the tile type changes
  useEffect(() => {
    setImgFailed(false);
  }, [tile?.type]);

  useEffect(() => {
    const el = animRef.current;
    if (!el) return;

    // Skip entrance animation on the very first board load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      gsap.set(el, { opacity: 1, scale: 1, y: 0, rotation: 0 });
      prevTileRef.current = tile;
      return;
    }

    const prev = prevTileRef.current;
    prevTileRef.current = tile;

    if (prev && !tile) {
      // ── TILE EXIT: type-specific animations, staggered by position ──
      gsap.killTweensOf(el);
      const t = prev.type;
      const exitDelay = row * 0.018 + col * 0.009;

      if (t === 0) {
        // Cherry Blossom — petals scatter upward
        gsap.to(el, { y: -24, scale: 0, opacity: 0, duration: 0.38, delay: exitDelay, ease: 'back.in(1.5)' });
      } else if (t === 1) {
        // Shadow Orb — implodes into void (Jinwoo shadow)
        gsap.to(el, { scale: 0, opacity: 0, duration: 0.3, delay: exitDelay, ease: 'power4.in' });
      } else if (t === 2) {
        // Six Eyes Gem — horizontal infinity dissolve (Gojo limitless)
        gsap.to(el, { scaleX: 0, scaleY: 1.4, opacity: 0, duration: 0.28, delay: exitDelay, ease: 'power2.in' });
      } else if (t === 3) {
        // Musical Note — pops upward before fading
        gsap.to(el, { y: -28, scale: 0, opacity: 0, duration: 0.35, delay: exitDelay, ease: 'back.in(3)' });
      } else if (t === 4) {
        // Black Heart — shatters outward then implodes (cursed energy)
        const tl = gsap.timeline({ delay: exitDelay });
        tl.to(el, { scale: 1.3, duration: 0.08, ease: 'power4.out' })
          .to(el, { scale: 0, opacity: 0, duration: 0.25, ease: 'power4.in' });
      } else if (t === 5) {
        // Star Fragment — supernova burst (celestial explosion)
        const tl = gsap.timeline({ delay: exitDelay });
        tl.to(el, { scale: 1.6, opacity: 1, duration: 0.1, ease: 'power1.out' })
          .to(el, { scale: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
      } else {
        gsap.to(el, { scale: 0, opacity: 0, duration: 0.3, delay: exitDelay, ease: 'back.in(2)' });
      }

    } else if (!prev && tile) {
      // ── TILE ENTRANCE: gravity fall from above, distance scales with row ──
      // Tiles NEVER rotate — they fall straight down, always upright
      gsap.killTweensOf(el);
      const fallDistance = -(40 + row * 18);
      gsap.fromTo(el,
        { y: fallDistance, opacity: 0, scale: 0.75, rotation: 0 },
        { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.45 + row * 0.02, ease: 'bounce.out' }
      );

    } else if (prev && tile && prev.id !== tile.id) {
      // Same position, different tile (replacement) — quick upright drop-in
      gsap.killTweensOf(el);
      gsap.fromTo(el,
        { y: -30, opacity: 0, scale: 0.8, rotation: 0 },
        { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.35, ease: 'bounce.out' }
      );
    }
  }, [tile, row, col]);

  // Selection pulse via GSAP
  useEffect(() => {
    const el = animRef.current;
    if (!el) return;
    if (isSelected) {
      gsap.to(el, { scale: 1.12, duration: 0.15, ease: 'power2.out' });
    } else {
      gsap.to(el, { scale: 1, duration: 0.15, ease: 'power2.out' });
    }
  }, [isSelected]);

  const typeInfo = tile ? TILE_TYPES[tile.type] : null;
  const isTypeMatch = isTypeTargeting && tile;

  const dragStyle = isDragging && dragOffset
    ? {
        transform: `translate(${dragOffset.dx}px, ${dragOffset.dy}px) scale(1.12)`,
        transition: 'none',
        zIndex: 50,
        filter: 'brightness(1.35) drop-shadow(0 6px 12px rgba(255,215,0,0.5))',
      }
    : undefined;

  return (
    <TileContainer
      $isSelected={isSelected}
      $isRowHighlighted={isRowHighlighted}
      $isTypeMatch={isTypeMatch}
      $isEmpty={!tile}
      $isDragging={isDragging}
      onClick={() => onClick(row, col)}
      style={dragStyle}
      className="relative flex items-center justify-center transition-colors duration-150"
    >
      <AnimatedContent ref={animRef} className="w-full h-full flex items-center justify-center">
        {tile && (
          <TileInner
            $color={typeInfo.color}
            className="w-[85%] h-[85%] rounded-lg flex items-center justify-center text-3xl shadow-lg border-2 border-white/10"
          >
            {!imgFailed
              ? <img
                  src={`/images/tiles/tile_${tile.type}.png`}
                  alt={typeInfo.displayName}
                  onError={() => setImgFailed(true)}
                  draggable={false}
                  style={{ width: '65%', height: '65%', objectFit: 'contain', userSelect: 'none' }}
                />
              : typeInfo.symbol
            }

            {tile.isSpecial && (
              <SpecialOverlay className="absolute inset-0 rounded-lg pointer-events-none">
                {tile.specialType === 'striker' && (
                  <StrikerGlow className="absolute inset-0 rounded-lg animate-pulse border-2 border-yellow-300 shadow-[0_0_12px_rgba(255,215,0,0.9)]" />
                )}
                {tile.specialType === 'monarch' && (
                  <MonarchGlow className="absolute inset-0 rounded-lg animate-pulse border-2 border-sg-gold shadow-[0_0_16px_rgba(255,215,0,1)] shadow-inner" />
                )}
                {tile.specialType === 'domain' && (
                  <DomainGlow className="absolute inset-0 rounded-lg animate-pulse border-2 border-sg-purple shadow-[0_0_16px_rgba(123,44,191,1)]" />
                )}
                <SpecialBadge $type={tile.specialType}>
                  {tile.specialType === 'striker' && '⚡'}
                  {tile.specialType === 'monarch' && '👑'}
                  {tile.specialType === 'domain' && '💫'}
                </SpecialBadge>
              </SpecialOverlay>
            )}
          </TileInner>
        )}
      </AnimatedContent>
    </TileContainer>
  );
};

const TileContainer = styled.div`
  aspect-ratio: 1;
  cursor: ${p => p.$isEmpty ? 'default' : 'pointer'};
  border-radius: 10px;
  outline: ${p => p.$isRowHighlighted
    ? '2px solid rgba(0,191,255,0.8)'
    : p.$isTypeMatch
    ? '2px solid rgba(128,0,128,0.7)'
    : 'none'};
  background: ${p => p.$isRowHighlighted
    ? 'rgba(0,191,255,0.1)'
    : p.$isTypeMatch
    ? 'rgba(128,0,128,0.08)'
    : 'transparent'};
  box-shadow: ${p => p.$isSelected
    ? '0 0 18px rgba(255,215,0,0.8), inset 0 0 8px rgba(255,215,0,0.3)'
    : 'none'};

  &:hover {
    filter: ${p => !p.$isEmpty && !p.$isSelected ? 'brightness(1.25)' : 'none'};
  }
`;

const AnimatedContent = styled.div`
  /* GSAP controls transforms — no CSS transform here */
  will-change: transform, opacity;
`;

const TileInner = styled.div`
  position: relative;
  background: radial-gradient(circle at 35% 35%, ${p => p.$color}55 0%, ${p => p.$color}22 100%);
  border-color: ${p => p.$color}66;
`;

const SpecialOverlay = styled.div``;
const StrikerGlow = styled.div``;
const MonarchGlow = styled.div``;
const DomainGlow = styled.div``;

const SpecialBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 10px;
  line-height: 1;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.8));
`;

export default Tile;
