import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { fadeIn, pulse } from 'react-animations';
import { MAIN_COLOR } from './colors';
const bounceAnimation = keyframes`${fadeIn}`;
const pulsenimation = keyframes`${pulse}`;

export const ModalBody = styled.div`
  animation: 200ms ${pulsenimation};
  position: absolute;
  top: 10px;
  left: 10px;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background-color: #334647f2;
  border-radius: 10px;
  transition: 0.2s ease;
  z-index: ${({ is_opened }) => (is_opened ? 100 : -10)};
  opacity: ${({ is_opened }) => (is_opened ? 1 : 0)};
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

export const Header = styled.p`
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #fff;
`;
