import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setTutorialCompleted } from '../../../store/slices/shadowGardenSlice';
import { tutorialSteps } from '../../../data/shadow-garden/tutorialSteps';
import Tooltip from './Tooltip';

const TutorialOverlay = ({ onComplete = () => {} }) => {
  const dispatch = useDispatch();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [waitingForAction, setWaitingForAction] = useState(false);

  const currentStep = tutorialSteps[currentStepIndex];

  const handleNext = useCallback(() => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      dispatch(setTutorialCompleted(true));
      if (onComplete) onComplete();
    }
  }, [currentStepIndex, dispatch, onComplete]);

  const handleSkip = () => {
    dispatch(setTutorialCompleted(true));
    if (onComplete) onComplete();
  };

  useEffect(() => {
    // If interactive, listen for events
    if (currentStep.type === 'interactive') {
      setWaitingForAction(true);
      const handleAction = (e) => {
        if (e.detail?.type === 'match' || e.detail?.type === 'power_used') {
          handleNext();
        }
      };
      window.addEventListener('tutorial-action', handleAction);
      return () => window.removeEventListener('tutorial-action', handleAction);
    } else {
      setWaitingForAction(false);
    }
  }, [currentStepIndex, currentStep.type, handleNext]);

  if (currentStep.type === 'modal') {
    return (
      <ModalOverlay>
        <div className="bg-gradient-to-br from-sg-midnight to-sg-purple border-4 border-sg-gold rounded-3xl p-6 md:p-10 w-[90vw] max-w-xl text-center shadow-[0_0_50px_rgba(255,215,0,0.3)] animate-in fade-in zoom-in duration-300">
          <h2 className="font-bangers text-3xl md:text-5xl text-sg-gold mb-6 tracking-wider">{currentStep.title}</h2>
          <p className="font-quicksand text-white text-lg leading-relaxed mb-8">{currentStep.content}</p>
          <div className="flex justify-center gap-4">
            {currentStep.buttons.map((btn, i) => (
              <button 
                key={i} 
                onClick={handleNext}
                className="bg-sg-gold text-black px-10 py-3 rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-lg"
              >
                {btn}
              </button>
            ))}
          </div>
          <button onClick={handleSkip} className="mt-6 text-white/30 text-xs hover:text-white transition-colors">
            SKIP TUTORIAL
          </button>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <>
      <DimOverlay />
      <Tooltip
        target={currentStep.target}
        position={currentStep.position}
        title={currentStep.title}
        content={currentStep.content}
        buttons={currentStep.buttons}
        onButtonClick={handleNext}
        onSkip={handleSkip}
        waiting={waitingForAction}
      />
    </>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const DimOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1999;
  pointer-events: none;
`;

export default TutorialOverlay;
