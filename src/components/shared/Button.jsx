import React from 'react';
import styled, { css } from 'styled-components';

/**
 * Reusable Button Component
 * Based on the YesButton and StartButton designs
 */
const Button = ({ children, onClick, variant = 'primary', scale = 1, className, ...props }) => {
  return (
    <StyledButton
      onClick={onClick}
      variant={variant}
      $scale={scale}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  padding: ${props => 20 * props.$scale}px ${props => 60 * props.$scale}px;
  font-size: ${props => 24 * props.$scale}px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transform: scale(1);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  z-index: 10;
  
  /* Primary Variant (Gold/Orange Gradient) */
  ${props => props.variant === 'primary' && css`
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: white;
    box-shadow: 0 ${10 * props.$scale}px ${30 * props.$scale}px rgba(255, 215, 0, 0.4);
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 ${15 * props.$scale}px ${40 * props.$scale}px rgba(255, 215, 0, 0.6);
    }
  `}

  /* Secondary Variant (White/Red) */
  ${props => props.variant === 'secondary' && css`
    background: white;
    color: #E63946;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }
  `}

  /* Danger/No Variant (Red) */
  ${props => props.variant === 'danger' && css`
    background: #E63946;
    color: white;
    box-shadow: 0 8px 20px rgba(230, 57, 70, 0.4);
    
    &:hover {
      transform: scale(1.05);
    }
  `}
  
  @media (max-width: 768px) {
    padding: ${props => 15 * props.$scale}px ${props => 40 * props.$scale}px;
    font-size: ${props => 20 * props.$scale}px;
  }
`;

export default Button;
