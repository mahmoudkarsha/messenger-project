import styled from 'styled-components';
import bg from '../imgs/chatbg.png';
import { MAIN_COLOR } from './colors';
import { keyframes } from 'styled-components';

import fadeIn from 'react-animations/lib/zoomInDown';
const bounceAnimation = keyframes`${fadeIn}`;

export const ChatArea = styled.div`
  background: url(${bg});
  background-repeat: repeat;
  position: relative;
  background-color: #ffe5d922;
`;

export const Message = styled.div`
  animation: 200ms ${bounceAnimation};
  position: relative;
  align-self: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  background-color: ${({ isMe, transparent }) => {
    let color = isMe ? '#caf0f8' : '#fff';
    if (transparent) color = 'transparent';
    return color;
  }};
  max-width: 400px;
  border-radius: 8px;
  box-shadow: ${({ transparent }) =>
    !transparent ? '0px 1px 6px -3px rgba(0, 0, 0, .51)' : ''};
  padding: 0px;
  margin: 3px 20px;
  color: ${({ isMe }) => (isMe ? '#333' : '#333')};
`;

export const MessageBody = styled.div`
  text-align: left;
  padding: 17px;
  font-size: 14px;
  color: #000;
  word-wrap: break-word;
`;

export const MessageDetails = styled.div`
  padding: 0px 7px 2px 7px;
  display: flex;
  gap: 1px;
  justify-content: space-between;
`;
export const MessageDate = styled.div`
  font-size: 12px;
  color: #999;
`;
export const MessageAknow = styled.div`
  margin: 0 10px;
  height: 15px;
  width: 15px;
  overflow: hidden;
`;

export const MessageDateLine = styled.div`
  align-self: center;
  padding: 3px 20px;
  background-color: #5d576b;
  color: #fff;
  border-radius: 20px;
  margin: 10px 0;
  box-shadow: ${({ transparent }) =>
    !transparent ? '0px 1px 6px -3px rgba(0, 0, 0, .51)' : ''};
`;
