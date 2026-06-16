import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { rekindleJourney } from '../store/slices/shadowGardenSlice';

const ShadowGardenWelcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats, completedLevels, currentLevel } = useSelector(state => state.shadowGarden);

  const hasProgress = stats.totalScore > 0 || completedLevels.length > 0;

  const handleNewGame = () => {
    dispatch(rekindleJourney());
    navigate('/shadow-garden');
  };

  const handleContinue = () => {
    navigate('/shadow-garden');
  };

  return (
    <Container>
      <Glow />
      <ScanLines />
      <Content>
        <EyeGlyph>👁️</EyeGlyph>
        <Title>SHADOW GARDEN</Title>
        <Subtitle>Arise, Sovereign of Shadows</Subtitle>
        <Rule />

        {hasProgress && (
          <ProgressLine>
            REALM {currentLevel} · {Math.floor(stats.totalScore).toLocaleString()} PTS
          </ProgressLine>
        )}

        <ButtonGroup>
          {hasProgress && (
            <PrimaryBtn onClick={handleContinue}>
              <BtnIcon>▶</BtnIcon>
              <BtnBody>
                <BtnLabel>CONTINUE JOURNEY</BtnLabel>
                <BtnSub>Realm {currentLevel}</BtnSub>
              </BtnBody>
            </PrimaryBtn>
          )}

          <SecondaryBtn onClick={handleNewGame} $solo={!hasProgress}>
            {hasProgress ? '⚔ NEW GAME' : '⚔ START GAME'}
          </SecondaryBtn>
        </ButtonGroup>

        <HubLink onClick={() => navigate('/')}>[ RETURN TO HUB ]</HubLink>
      </Content>
    </Container>
  );
};

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%       { opacity: 0.75; transform: scale(1.06); }
`;

const flicker = keyframes`
  0%, 89%, 91%, 93%, 100% { opacity: 1; }
  90%, 92% { opacity: 0.75; }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at 50% 60%, #0d0a18 0%, #020208 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const Glow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 55%, rgba(123, 44, 191, 0.14) 0%, transparent 65%);
  pointer-events: none;
`;

const ScanLines = styled.div`
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.12) 2px,
    rgba(0, 0, 0, 0.12) 4px
  );
  pointer-events: none;
  opacity: 0.4;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 56px 24px;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;

  @media (min-width: 640px) {
    padding: 56px 64px;
  }
`;

const EyeGlyph = styled.div`
  font-size: 72px;
  filter: drop-shadow(0 0 32px rgba(123, 44, 191, 0.9));
  animation: ${pulseGlow} 3s ease-in-out infinite;
  line-height: 1;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(2.2rem, 6vw, 4rem);
  color: #ffffff;
  letter-spacing: 0.45em;
  text-shadow: 0 0 50px rgba(123, 44, 191, 0.7), 0 0 100px rgba(123, 44, 191, 0.3);
  animation: ${flicker} 9s infinite;
  margin: 0;
`;

const Subtitle = styled.p`
  font-family: 'Dancing Script', cursive;
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  color: rgba(190, 140, 255, 0.55);
  letter-spacing: 0.1em;
  margin: 0;
`;

const Rule = styled.div`
  width: 220px;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(123, 44, 191, 0.65), transparent);
  margin: 4px 0;
`;

const ProgressLine = styled.div`
  font-family: monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.28);
  letter-spacing: 0.25em;
  text-transform: uppercase;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 340px;
  margin-top: 12px;
`;

const PrimaryBtn = styled.button`
  width: 100%;
  padding: 22px 28px;
  background: rgba(123, 44, 191, 0.22);
  border: 2px solid rgba(123, 44, 191, 0.55);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 18px;

  &:hover {
    background: rgba(123, 44, 191, 0.38);
    border-color: #9d4edd;
    box-shadow: 0 0 36px rgba(123, 44, 191, 0.45);
    transform: scale(1.025);
  }

  &:active {
    transform: scale(0.97);
    background: rgba(123, 44, 191, 0.45);
  }
`;

const BtnIcon = styled.span`
  font-size: 20px;
  color: #c084fc;
`;

const BtnBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const BtnLabel = styled.span`
  font-family: 'Orbitron', sans-serif;
  font-size: 15px;
  color: white;
  letter-spacing: 0.18em;
`;

const BtnSub = styled.span`
  font-family: monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.38);
  letter-spacing: 0.15em;
  text-transform: uppercase;
`;

const SecondaryBtn = styled.button`
  width: 100%;
  padding: ${props => props.$solo ? '22px 28px' : '14px 28px'};
  background: ${props => props.$solo ? 'rgba(123, 44, 191, 0.22)' : 'rgba(255, 255, 255, 0.03)'};
  border: ${props => props.$solo ? '2px solid rgba(123, 44, 191, 0.55)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  color: ${props => props.$solo ? 'white' : 'rgba(255, 255, 255, 0.35)'};
  font-family: 'Orbitron', sans-serif;
  font-size: ${props => props.$solo ? '18px' : '11px'};
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: ${props => props.$solo ? 'rgba(123, 44, 191, 0.38)' : 'rgba(255, 255, 255, 0.07)'};
    border-color: ${props => props.$solo ? '#9d4edd' : 'rgba(255, 255, 255, 0.25)'};
    color: white;
    ${props => props.$solo && 'box-shadow: 0 0 36px rgba(123, 44, 191, 0.45); transform: scale(1.025);'}
  }

  &:active {
    transform: scale(0.97);
    opacity: 0.85;
  }
`;

const HubLink = styled.button`
  background: none;
  border: none;
  color: rgba(255, 107, 149, 0.45);
  font-family: monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s ease;

  &:hover {
    color: rgba(255, 107, 149, 0.9);
    text-decoration: underline;
  }
`;

export default ShadowGardenWelcome;
