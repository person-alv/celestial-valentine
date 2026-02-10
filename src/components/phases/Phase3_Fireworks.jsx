import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSound } from '../../hooks/useSound';

const Phase3_Fireworks = ({ onStart }) => {
  const { play } = useSound();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Show greeting after brief delay
    setTimeout(() => setShowGreeting(true), 500);

    // Particle class for fireworks
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.gravity = 0.1;
      }

      update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create heart-shaped firework
    const createHeartFirework = (x, y) => {
      const particles = [];
      const particleCount = 50;
      const colors = ['#FF1493', '#FF69B4', '#FFD700', '#FFA500', '#FF6B9D'];

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;

        // Heart shape parametric equation
        const heartX = 16 * Math.pow(Math.sin(angle), 3);
        const heartY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));

        const color = colors[Math.floor(Math.random() * colors.length)];
        const particle = new Particle(x, y, color);
        particle.velocity.x = heartX * 0.3;
        particle.velocity.y = heartY * 0.3;
        particles.push(particle);
      }

      return particles;
    };

    // Auto-launch fireworks
    const launchInterval = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.6;
      particlesRef.current.push(...createHeartFirework(x, y));
      play('firework');
    }, 400);

    // Animation loop
    const animate = () => {
      // Clear canvas with a transparent fill to create trail effect
      // Use the component background color but with very low opacity
      // Actually, we need to clear carefully to maintain the gradient background visibility
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);

      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      clearInterval(launchInterval);
    };
  }, [play]);

  // Handle canvas click - user creates glitter burst
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create glitter burst at click location
    const glitterColors = ['#FFD700', '#FFA500', '#FFFF00'];
    for (let i = 0; i < 30; i++) {
      const color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
      particlesRef.current.push(new Particle(x, y, color));
    }

    play('sparkle');
  };

  return (
    <Container>
      <Canvas 
        ref={canvasRef} 
        onClick={handleCanvasClick}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const rect = canvasRef.current.getBoundingClientRect();
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          
          const glitterColors = ['#FFD700', '#FFA500', '#FFFF00'];
          for (let i = 0; i < 30; i++) {
            const color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
            particlesRef.current.push(new Particle(x, y, color));
          }
          play('sparkle');
        }}
      />

      {showGreeting && (
        <OverlayContainer>
          <Greeting>
            Happy Valentine's Day, Baby ❤️
          </Greeting>
          <StartButton onClick={onStart}>
            <ButtonText>START</ButtonText>
            <ButtonGlow />
          </StartButton>
          <HintText>
            Tap the screen to create sparkles! ✨
          </HintText>
        </OverlayContainer>
      )}
    </Container>
  );
};

// Styled Components

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  /* Deep Space Radiant Gradient */
  background: radial-gradient(circle at center, #2e1a47 0%, #191970 40%, #000000 100%);
  position: relative;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  pointer-events: none;
`;

const Greeting = styled.h1`
  font-family: 'Dancing Script', cursive;
  font-size: 72px;
  color: white;
  text-align: center;
  margin-bottom: 60px;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  animation: fadeInScale 2s ease-out;
  pointer-events: none;
  
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 40px;
  }
`;

const StartButton = styled.button`
  position: relative;
  padding: 25px 80px;
  font-size: 32px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.6);
  animation: pulse 2s ease-in-out infinite;
  pointer-events: all;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 50px rgba(255, 215, 0, 0.8);
  }
  
  &:active {
    transform: scale(1.05);
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 10px 40px rgba(255, 215, 0, 0.6);
    }
    50% {
      box-shadow: 0 10px 60px rgba(255, 215, 0, 1);
    }
  }
  
  @media (max-width: 768px) {
    padding: 20px 60px;
    font-size: 28px;
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 2;
`;

const ButtonGlow = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  animation: rotate 3s linear infinite;
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HintText = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 30px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  animation: fadeIn 3s ease-out;
  pointer-events: none;
  
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

// Particle class needs to be defined in component scope
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8
    };
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.015;
    this.gravity = 0.1;
  }

  update() {
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default Phase3_Fireworks;