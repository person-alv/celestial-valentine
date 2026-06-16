import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

const LoadingScreen = ({ message = "ENTERING THE GATE...", onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) setTimeout(onComplete, 500);
      }
    });

    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        setProgress(Math.floor(this.progress() * 100));
      }
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <Container className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center">
      <div className="relative w-80 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
        <Fill style={{ width: `${progress}%` }} className="h-full bg-sg-purple shadow-[0_0_15px_rgba(123,44,191,0.8)]" />
      </div>
      
      <div className="flex flex-col items-center">
        <h2 className="font-orbitron text-sg-gold text-sm tracking-[0.3rem] animate-pulse mb-2">{message}</h2>
        <span className="font-mono text-white/40 text-[10px] uppercase">[ SYSTEM LOAD: {progress}% ]</span>
      </div>

      {/* Decorative Gate Corners */}
      <Corner className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-sg-purple/30" />
      <Corner className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-sg-purple/30" />
      <Corner className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-sg-purple/30" />
      <Corner className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-sg-purple/30" />
    </Container>
  );
};

const Container = styled.div``;
const Fill = styled.div`
  transition: width 0.1s linear;
`;
const Corner = styled.div``;

export default LoadingScreen;
