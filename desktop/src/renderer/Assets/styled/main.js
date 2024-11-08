import styled from 'styled-components';
import { divFlexCenter } from './shared';

import { MAIN_COLOR } from './colors';
import { keyframes } from 'styled-components';
import { fadeIn, pulse } from 'react-animations';
const bounceAnimation = keyframes`${fadeIn}`;

const secondColor = '';

export const ConversationCard = styled.div`
  position: relative;
  margin: 1px 70px 0px 0px;
  display: flex;
  gap: 10px;
  padding: 5px 10px;
  align-items: center;
  height: 74px;
  border-radius: 2px;
  border-bottom: 1px solid ${MAIN_COLOR}22;
  background-color: ${({ is_selected }) =>
    is_selected ? `${MAIN_COLOR}33` : ''};
  color: ${({ is_selected }) => (is_selected ? '#fff' : '#333')};
  font-size: 18px;
  transition: background-color 0.2s ease-in-out;
  :hover {
    background-color: rgba(80, 201, 155, 0.3);
    cursor: pointer;
  }
`;
export const ConversationInfo = styled.div`
  width: calc(100% - 50px);
  height: 100%;
  display: flex;
  gap: 3px;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0 7px 0;
`;
export const LeftWrapperDiv = styled.div`
  height: 100%;
`;
export const ContactName = styled.div`
  font-size: 15px;
  margin-bottom: 0px;
  font-weight: 700;
  color: ${({ is_selected }) => (is_selected ? '#444' : '#444')};
`;
export const LastMessageDetails = styled.div`
  display: flex;
`;
export const Aknow = styled.div`
  height: 20px;
  width: 20px;
`;
export const LastMessageBody = styled.div`
  margin-top: 0px;
  color: #869698;
  font-size: 11px;
  color: ${({ is_selected }) => (is_selected ? '#333' : '#333')};
`;
export const RigthWrapperDiv = styled.div``;
export const LastMessageDateTime = styled.div`
  color: #343534;
  font-size: 14px;
  font-weight: 500;
`;

export const ListName = styled.div`
  height: 50px;
  padding: 5px 0px;
  font-size: 17px;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const GroupsListWrapper = styled.div`
  animation: 1s ${bounceAnimation};

  transition: 1s ease-in-out;
  height: calc(100% - 60px);
`;
export const ChatsListWrapper = styled.div`
  animation: 1s ${bounceAnimation};
  height: calc(100% - 123px);
  overflow-y: scroll;
`;

export const NewMessageInput = styled.textarea`
  width: 100%;
  resize: none;
  height: 55px;
  background-color: #ffffff77;
  border: 1px solid ${MAIN_COLOR}66;
  border-radius: 28px;
  font-size: 16px;
  color: #000;
  padding-right: 30px;
  padding: 10px 15px;
  z-index: 2;
  transition: 0.2s ease-in;
  direction: ltr;
  color: #555;
  :focus {
    outline: none;
    border: 1px solid #00bfa6cc;
  }
`;

export const RecordTime = styled.div`
  width: 90%;
  height: 55px;
  background-color: #ffffff77;
  border: 1px solid #00bfa644;
  border-radius: 10px;
  font-size: 18px;
  color: #000;
  padding-right: 30px;
  padding: 10px;
  z-index: 2;
  transition: opacity 0.2s ease-in;
`;

export const SendingArea = styled.div`
  height: 55px;
  width: 95%;
  background-color: #fff;
  display: flex;
  position: absolute;
  bottom: 10px;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0px;
  z-index: 1;
  border: 1px solid #eee;
  border-radius: 30px;
  margin-right: 7px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.1);
  border: 1px solid ${MAIN_COLOR}22;
  /* border-top-right-radius: -20px; */
`;
export const Main = styled.div`
  height: 100%;
  width: 100%;
  padding: 0px;
  position: relative;
  box-shadow: 0px 0px 50px 10px rgba(1, 1, 1, 0);
  display: flex;
  border-radius: 3px;
  border: 0px solid #219ebc;
  overflow: hidden;
`;

export const ChatBoxNavBar = styled.div`
  animation: 1s ${bounceAnimation};
  width: 100%;
  height: 64px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.1);
`;
export const ChatBox = styled.div`
  animation: 1s ${bounceAnimation};
  width: 70%;
  height: 100%;
  position: relative;
  background-color: #f7f7f7;
`;
export const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
export const UserName = styled.div`
  color: #454646;
  font-size: 14px;
  font-weight: 700;
`;
export const Status = styled.div`
  font-size: 12px;

  color: #222;
`;
export const InfoWrapper = styled.div``;
export const ImageWrapper = styled(divFlexCenter)`
  margin-left: 3px;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  overflow: hidden;
`;

// contact tab

export const ContactsListWrapper = styled.div`
  animation: 1s ${bounceAnimation};

  height: calc(100% - 200px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin: 1px 70px 1px 1px;
  padding: 0px 0 0 0;
`;

export const ContactCardWrapper = styled.div`
  position: relative;
  margin: 1px 0px 0px 0px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 5px 10px;
  align-items: center;
  height: 74px;
  border-radius: 2px;
  border-bottom: 1px solid #eee;

  background-color: ${({ is_selected }) =>
    is_selected ? `${MAIN_COLOR}33` : ''};
  color: ${({ is_selected }) => (is_selected ? '#fff' : '#333')};
  font-size: 18px;
  transition: background-color 0.2s ease-in-out;
  :hover {
    background-color: rgba(80, 201, 155, 0.3);
    cursor: pointer;
  }
`;

export const ContactInfo = styled.div`
  padding: 10px 2px;
`;
export const FlexCenterDiv = styled.div`
  display: flex;
  align-items: center;
`;
export const Name = styled.div`
  font-size: 15px;
  color: ${MAIN_COLOR};
  font-weight: 700;
  margin-right: 5px;
`;

export const Number = styled.div`
  font-size: 12px;
  margin-right: 5px;

  color: #00bfac;
  color: #555555;
`;

///

// rigth tab

export const Menu = styled.div`
  width: 40%;
  min-width: 550px;
  background-color: #fff;
  border-left: 1px solid #eee;
  padding: 0;
`;
export const MenuNavBar = styled.div`
  margin-right: 60px;
  color: #5d576b;

  height: 64px;
  background-color: #fff;
  border-bottom: 0px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px -10px 40px 10px rgba(0, 0, 0, 0.1);
  word-spacing: 1px;
  letter-spacing: 2px;
  :hover {
    cursor: pointer;
  }
`;

export const ConnectionStatus = styled.div`
  margin-right: 68px;
  color: ${({ status }) => (status === 'connected' ? '#fff' : '#fff')};
  height: 64px;
  background-color: #f2e2f5;
  background-color: ${({ status }) =>
    status === 'connected' ? '#2ec4b6' : '#ef476f'};
  direction: ltr;
  border-bottom: 0px solid #000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  padding: 5px 10px;
  transition: background-color 0.4s ease-in-out;
  border-bottom: 1px solid #ccc;

  /* box-shadow: 0px -10px 40px 10px rgba(0, 0, 0, 0.1); */
`;

export const MenuSideBar = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  bottom: 4px;
  width: 65px;
  background-color: ${MAIN_COLOR};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  gap: 10px;
  border-radius: 30px;
`;

export const Icon = styled(divFlexCenter)`
  height: 50px;
  width: 50px;
  color: #fff;
  transition: 0.1s ease-in-out;
  :hover {
    cursor: pointer;

    /* background-color: #5a6480;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 4px; */
  }
`;

export const FileName = styled.div`
  height: 70px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 60%;
  border-radius: 10px 10px 0 0;
  z-index: 1;
  margin-right: 0px;
  border: 1px solid #ccc;
  bottom: 67px;
`;

export const MainContainer = styled.div`
  height: 100vh;
  width: 100%;
  padding: 0;
  background-color: #e7e7e7;
`;

export const Active = styled.div`
  height: 13px;
  width: 13px;
  position: absolute;
  background-color: #06d6a0;
  top: 10px;
  right: 50px;
  border-radius: 50%;
  color: #fff;
  border: 2px solid #fff;
`;

export const UnreadMsgsCount = styled.div`
  height: 20px;
  width: 20px;
  background-color: #e63946;

  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 30px;
  border: 1px solid #ccc;
  padding: 3px 10px;
`;
export const SearchWrapper = styled.div`
  margin-right: 0px;
  padding: 10px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  z-index: 1;
`;
export const SearchIcon = styled.div`
  position: absolute;
  top: 25px;
  left: 30px;
  color: #777;
`;

export const EmojiContaciner = styled.div`
  animation: 1s ${bounceAnimation};
  display: ${({ display }) => display};
  position: absolute;
  width: 400px;
  bottom: 70px;
  left: -20px;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  user-select: none;
`;
