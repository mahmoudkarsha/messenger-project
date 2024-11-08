import React, { useRef, useState } from 'react';
//Icon Imports
import freeSpacaBg from '../../Assets/svgs/mainpagebg.svg';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import {
  RiRegisteredLine,
  RiContactsLine,
  RiAlarmWarningLine,
} from 'react-icons/ri';
import {
  MdOutlinePowerSettingsNew,
  MdOutlineBackup,
  MdOutlineGroupAdd,
} from 'react-icons/md';
import { BsThreeDotsVertical, BsChatText } from 'react-icons/bs';

import { exportDB } from 'dexie-export-import';
//styles imports
import {
  Main,
  Menu,
  MenuSideBar,
  MenuNavBar,
  Icon,
  ChatBox,
  ChatBoxNavBar,
  UserInfoWrapper,
  ImageWrapper,
  InfoWrapper,
  Status,
  UserName,
  MainContainer,
  ConnectionStatus,
} from '../../Assets/styled/main';

//Menu Imports
import ConverstaionsList from './Menu/ConverstaionsList';
import GroupsList from './Menu/GroupsList';
import ContactsList from './Menu/ContactsList';

//ChatArea Imports
import MessagesWrapper from './ChatArea/MessagesWrapper';
import SendWrapper from './SendArea/SendWrapper';

import useSocket from '../../Functions/hooks/useSocket';
import renderContact from '../../Functions/methods/Application/renderContact';
import renderGroupName from '../../Functions/methods/Application/renderGroupName';
import Modal from '../Modal';
import ExportModal from '../Modal';
import ProfileModal from '../Modal';
import NewGroupModal from '../Modal';

import { db } from '../../Functions/methods/LocalDB/db';
import ContactActions from './Menu/ContactActions';
import { Link } from 'react-router-dom';
// import scrollToPosition from "../../Functions/methods/Application/scrollToPosition";

import moment from 'moment';
import Profile from './Profile';
import GroupInfo from './Menu/GroupInfo';
import { SERVER_URL } from '../../Functions/methods/Server/server';
import CreateGroup from './CreateGroup';
import RenderProfileImage from './Menu/RenderProfileImage';

import Call from './Call';
import CallInterface from './CallInterface';
import CallModal from '../CallModal';

import callRing from './call-ring.mp3';
import callerRing from './callertune.mp3';

const savedLocale = window.localStorage.getItem('locale');
const savedCandidates = [];

export default function Home({ userState }) {
  const [user, setUser] = userState;

  const chatAreaRef = useRef();
  const callRingRefrence = useRef(null);
  const callerRingRefrence = useRef(null);
  const peerConnectionRefrence = useRef(null);
  const remoteAudioRefrence = useRef(null);

  const [showCallModal, setShowCallModal] = useState(false);
  const [callData, setCallData] = useState({});

  const [tab, setTab] = useState('conversations');
  const [exportProgress, setExportProgress] = useState(0);

  const [exporting, setExporting] = useState(false);
  const [locale, setLocale] = useState(savedLocale ? savedLocale : 'kr');
  moment.locale(locale);

  const [isAddContactModalOpened, setIsAddContactModalOpened] = useState(false);
  const [isCreateGroupModalOpened, setIsCreateGroupModalOpened] =
    useState(false);
  const [isProfileModalOpened, setProfileModalOpened] = useState(false);

  const {
    page,
    groups,
    messages,
    contacts,
    conversations,
    setPage,
    setContacts,
    setSelectedChat,
    setConversations,
    selectedChat,
    setGroups,
    connectionStatus,
    poke,
    typing,
    sendReadAcknow,
    sendMessage,
    deleteMessage,
    wsserver,
  } = useSocket({
    user,
    chatAreaRef,
    callRingRefrence,
    callerRingRefrence,
    peerConnectionRefrence,
    showCallModal,
    setShowCallModal,
    callData,
    setCallData,
    savedCandidates,
  });

  let unread_messages_countAll = 0;
  conversations.forEach(
    (con) => (unread_messages_countAll += con.unread_messages_count)
  );

  const handleTabClick = (tab) => () => setTab(tab);

  async function handleExport() {
    setExporting(true);
    const blob = await exportDB(db, {
      progressCallback: (e) => {
        setExportProgress((e.completedRows * 100) / e.totalRows);
      },
      filter: (table, valye, key) => {
        return table !== 'files';
      },
    });
    const href = URL.createObjectURL(blob);
    const aTag = document.createElement('a');
    aTag.setAttribute('href', href);
    aTag.setAttribute('download', new Date());
    aTag.click();
    setExporting(false);
  }

  function handleCreateGroup() {
    setIsCreateGroupModalOpened(true);
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '',
      }}
    >
      <MainContainer>
        <NewGroupModal
          close_modal={() => setIsCreateGroupModalOpened(false)}
          is_opened={isCreateGroupModalOpened}
          width="min(30%, 600px)"
          header="Gropek Nu"
          style={{
            maxHeight: '90%',
          }}
        >
          <CreateGroup contacts={contacts} user={user} />
        </NewGroupModal>
        <ExportModal
          close_modal={() => setExporting(false)}
          is_opened={exporting}
          height="300px"
          width="min(30%, 600px)"
          header="نسخة احتياطية"
        >
          {exportProgress}
        </ExportModal>
        <Modal
          close_modal={() => setIsAddContactModalOpened(false)}
          is_opened={isAddContactModalOpened}
          height="300px"
          width="min(30%, 600px)"
          header="Navekî nû"
        >
          <ContactActions
            setContacts={setContacts}
            setConversations={setConversations}
            user={user}
          />
        </Modal>
        <ProfileModal
          close_modal={() => setProfileModalOpened(false)}
          is_opened={isProfileModalOpened}
          width="min(30%, 600px)"
          header="Profîla bikarhêner"
        >
          <Profile
            wsserver={wsserver}
            locale={locale}
            setLocale={setLocale}
            user={user}
          />
        </ProfileModal>

        <CallModal
          is_opened={showCallModal}
          width="270px"
          header={locale === 'ar' ? 'مكالمة جديدة' : 'Tekîliyek nû'}
        >
          <CallInterface
            showCallModal={showCallModal}
            setShowCallModal={setShowCallModal}
            callData={callData}
            setCallData={setCallData}
            user={user}
            wsserver={wsserver}
            savedCandidates={savedCandidates}
            userNumber={user.number}
            peerConnectionRefrence={peerConnectionRefrence}
            remoteAudioRefrence={remoteAudioRefrence}
            callRingRefrence={callRingRefrence}
            callerRingRefrence={callerRingRefrence}
          />
        </CallModal>
        <Main>
          <Menu>
            <MenuNavBar className="drg">
              <audio
                ref={callRingRefrence}
                style={{
                  display: 'none',
                }}
                src={callRing}
              ></audio>
              <audio
                ref={callerRingRefrence}
                style={{
                  display: 'none',
                }}
                src={callerRing}
              ></audio>
              Messenger
            </MenuNavBar>
            <ConnectionStatus status={connectionStatus}>
              {connectionStatus === 'connected'
                ? 'Network girêdayî'
                : 'Têkiliya torê tune...'}
              {' .. Nimre '}
              {user.number}
            </ConnectionStatus>
            <MenuSideBar>
              <div>
                <Icon
                  onClick={() => {
                    setProfileModalOpened(true);
                  }}
                >
                  <CgProfile size={30} />
                </Icon>
              </div>
              <div>
                <Icon
                  style={{ position: 'relative' }}
                  onClick={handleTabClick('conversations')}
                >
                  {unread_messages_countAll > 0 && (
                    <p
                      style={{
                        position: 'absolute',
                        color: '#fff',
                        top: 0,
                        left: 10,
                        backgroundColor: '#e63946',
                        height: 20,
                        width: 20,
                        overflow: 'hidden',
                        borderRadius: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                      }}
                    >
                      {unread_messages_countAll}
                    </p>
                  )}

                  <BsChatText className="icon" size={25} />
                </Icon>
                <Icon onClick={handleTabClick('groups')}>
                  <HiOutlineUserGroup className="icon" size={25} />
                </Icon>
                <Icon onClick={handleTabClick('contacts')}>
                  <RiContactsLine className="icon" size={25} />
                </Icon>

                <Icon onClick={handleCreateGroup}>
                  <MdOutlineGroupAdd className="icon" size={25} />
                </Icon>

                <Icon
                  onClick={() => {
                    setIsAddContactModalOpened(!isAddContactModalOpened);
                  }}
                >
                  <AiOutlineUserAdd className="icon" size={25} />
                </Icon>
                {user.number === '1111' && (
                  <>
                    <Link to="/admin/register">
                      <Icon>
                        <RiRegisteredLine className="icon" size={25} />
                      </Icon>
                    </Link>
                    <Link to="/admin/newgroup">
                      <Icon>
                        <RiRegisteredLine className="icon" size={25} />
                      </Icon>
                    </Link>
                  </>
                )}
              </div>
              <div>
                <Icon onClick={handleExport}>
                  <MdOutlineBackup className="icon" size={25} />
                </Icon>
                <Icon
                  onClick={() => {
                    if (window && window.electron)
                      window?.electron?.ipcRenderer?.sendMessage('exit');
                  }}
                >
                  <MdOutlinePowerSettingsNew
                    className="icon"
                    size={25}
                    color="#fff"
                  />
                </Icon>
              </div>
            </MenuSideBar>
            {tab === 'conversations' && (
              <ConverstaionsList
                locale={locale}
                conversations={conversations}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                setConversations={setConversations}
                sendReadAcknow={sendReadAcknow}
              />
            )}
            {tab === 'groups' && (
              <GroupsList
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                groups={groups}
                user={user}
                setTab={setTab}
              />
            )}
            {tab === 'contacts' && (
              <ContactsList
                setSelectedChat={setSelectedChat}
                contacts={contacts}
                setContacts={setContacts}
                setConversations={setConversations}
                user={user}
              />
            )}
            {tab === 'groupinfo' && (
              <GroupInfo
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
                contacts={contacts}
                user={user}
                setTab={setTab}
              />
            )}
          </Menu>

          <ChatBox>
            {(selectedChat && (
              <>
                <ChatBoxNavBar>
                  <UserInfoWrapper
                    onClick={() => {
                      if (selectedChat.is_group) setTab('groupinfo');
                    }}
                  >
                    <ImageWrapper>
                      <RenderProfileImage
                        number={selectedChat.contact_number}
                        height="44"
                        width="44"
                      />
                    </ImageWrapper>
                    <InfoWrapper>
                      <UserName>
                        {(selectedChat.is_group &&
                          renderGroupName(selectedChat.group_id, groups)) ||
                          renderContact(selectedChat.contact_number, contacts)}
                      </UserName>
                      {(selectedChat.is_typing && (
                        <Status>يكتب الآن ..</Status>
                      )) ||
                        renderUserStatus(selectedChat.contact_status)}
                    </InfoWrapper>
                  </UserInfoWrapper>
                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    {!selectedChat.is_group && (
                      <>
                        <Call
                          showCallModal={showCallModal}
                          setShowCallModal={setShowCallModal}
                          callData={callData}
                          setCallData={setCallData}
                          selectedChat={selectedChat}
                          userNumber={user.number}
                          peerConnectionRefrence={peerConnectionRefrence}
                          callerRingRefrence={callerRingRefrence}
                          remoteAudioRefrence={remoteAudioRefrence}
                          wsserver={wsserver}
                        />
                        <Icon onClick={poke}>
                          <RiAlarmWarningLine color="#00afb9" size={24} />
                        </Icon>
                      </>
                    )}
                  </div>
                </ChatBoxNavBar>
                <MessagesWrapper
                  user={user}
                  page={page}
                  setPage={setPage}
                  messages={messages}
                  chatAreaRef={chatAreaRef}
                  contacts={contacts}
                  deleteMessage={deleteMessage}
                />
                <SendWrapper sendMessage={sendMessage} typing={typing} />
              </>
            )) || (
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <img alt="bg" src={freeSpacaBg} width="70%" height="70%" />
              </div>
            )}
          </ChatBox>
        </Main>
      </MainContainer>
    </div>
  );
}

function renderUserStatus(status) {
  if (status === undefined || status === 'unknown') {
    return null;
  }

  if (status === 'active')
    return <p style={{ fontSize: 11, color: '#168aad' }}>متصل الآن</p>;
  return (
    <p style={{ fontSize: 11, color: '#168aad' }}>
      {moment(status).calendar('')}
    </p>
  );
}
