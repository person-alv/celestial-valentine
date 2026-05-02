import React from 'react';
import styled from 'styled-components';

const Tooltip = ({ target, position, title, content, buttons, onButtonClick, onSkip, waiting }) => {
  return (
    <Container className="fixed z-[2001] pointer-events-auto">
      <div className="bg-gradient-to-br from-sg-midnight to-sg-purple border-2 border-sg-gold rounded-xl p-6 shadow-2xl max-w-xs">
        <h3 className="font-orbitron text-sg-gold text-lg mb-2">{title}</h3>
        <p className="font-quicksand text-white text-sm leading-relaxed mb-4">{content}</p>
        
        <div className="flex justify-between items-center">
          {onSkip && (
            <button onClick={onSkip} className="text-white/40 text-[10px] hover:text-white transition-colors">
              SKIP TUTORIAL
            </button>
          )}
          
          <div className="flex gap-2">
            {buttons?.map((btn, i) => (
              <button 
                key={i} 
                onClick={onButtonClick}
                className="bg-sg-gold text-black px-4 py-1 rounded-full font-bold text-xs hover:scale-105 transition-transform"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
        
        {waiting && (
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-sg-gold rounded-full animate-ping" />
            <span className="text-[10px] text-sg-gold font-mono uppercase">Waiting for Hunter...</span>
          </div>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  /* Position logic would be more complex in real world, using fixed center for now */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default Tooltip;
