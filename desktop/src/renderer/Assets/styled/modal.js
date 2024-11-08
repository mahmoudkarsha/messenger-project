import styled from 'styled-components';
import { keyframes } from 'styled-components';
import fadeIn from 'react-animations/lib/fade-in';
import { MAIN_COLOR } from './colors';
const bounceAnimation = keyframes`${fadeIn}`;

export const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: ${({ is_opened }) => (is_opened ? 100 : -10)};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s ease;
  opacity: ${({ is_opened }) => (is_opened ? 1 : 0)};
  filter: blur(22px);
`;

export const ModalBody = styled.div`
  animation: 1s ${bounceAnimation};
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background-color: #fff;
  border-radius: 7px;
  transition: 100ms ease;
  z-index: ${({ is_opened }) => (is_opened ? 100 : -10)};
  opacity: ${({ is_opened }) => (is_opened ? 1 : 0)};
  overflow: hidden;
  box-shadow: 1px 1px 30px 10px rgba(0, 0, 0, 0.3);
`;

export const Header = styled.p`
  position: relative;
  padding: 20px;
  top: 0;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 1.2vw;
  color: ${MAIN_COLOR};
`;

export const CloseIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
  }
`;
