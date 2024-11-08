import { useCallback, useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import server, { SERVER_URL } from '../methods/Server/server';

import {
  db,
  updateMany,
  $Conversations,
  $Messages,
  insertOne,
  $Files,
  findAll,
  $Contacts,
  findOneById,
} from '../methods/LocalDB/db';
import scrollToPosition from '../methods/Application/scrollToPosition';

//sounds
import newMsgSound from './newMsg.mp3';
import sendedSound from './sended.mp3';
import sirenSound from './siren.mp3';
import newMsgSoundS from './newMsgS.mp3';

import { toast } from '../../Components/Toast';
const newMsgAudio = new Audio(newMsgSound);
const sendedAudio = new Audio(sendedSound);
const sirenAudio = new Audio(sirenSound);
const newMsgAudioS = new Audio(newMsgSoundS);

let wsserver;
let timeOutId;
let last_number;
const isEmni = true;
const useSocket = ({
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
}) => {
  const socketRef = useRef();

  const [page, setPage] = useState(1);
  const [selectedChat, setSelectedChat] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [loadingDb, setLoadingDb] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);

  const messages = useLiveQuery(
    () =>
      db.messages
        .where({ conversation_id: selectedChat?.id || 100000000 })
        .reverse()
        .limit(page * 20)
        .toArray(),
    [selectedChat, page]
  );

  // handle loading
  useEffect(() => {
    let groups = [];
    let contacts = [];
    async function mapMsgAndContact(row) {
      const msg = await findOneById($Messages, row.last_message_id);
      let group;
      let contact;

      if (row.is_group) {
        group = groups.find((el) => el._id === row.group_id);
      } else {
        contact = contacts.find((el) => el.number === row.contact_number);
      }

      return {
        ...row,
        last_message: msg,
        last_message_date: msg.send_date,
        group,
        contact,
      };
    }
    findAll($Contacts)
      .then((contactsTable) => {
        setContacts([...contactsTable]);
        contacts = contactsTable;
        return getFromLocalStorage('groups');
      })
      .then((groupsString) => {
        if (typeof groupsString !== 'string') return parseJson('[]');
        return parseJson(groupsString);
      })
      .then((groupsTable) => {
        setGroups(groupsTable);
        groups = groupsTable;
        return findAll($Conversations);
      })
      .then(async (rows) => {
        const filteredRows = filterConversation(rows);
        const rowsMappedToMessagesPromise = Promise.all(
          filteredRows.map(mapMsgAndContact)
        );
        const rowsMappedToMessages = await rowsMappedToMessagesPromise;
        const sortedRows = quikSort(rowsMappedToMessages, 'last_message_date');
        setConversations([...sortedRows]);
        setLoadingDb(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // handle connection
  useEffect(() => {
    if (loadingDb) {
      socketRef.current = socketIOClient(SERVER_URL, {
        query: {
          loggedUser: user.number,
          token: user.token,
          contacts: isEmni ? '' : contacts.map((c) => c.number).join(','),
        },
        // transports: ['websocket'],
      });

      wsserver = socketRef.current;

      // fetch user data
      wsserver.on('connect_error', console.log);
      wsserver.on('connection-failed', () =>
        console.log('حدث خطأ في البيانات')
      );
      // connection
      wsserver.on('disconnect', (e) => {
        setConnectionStatus('disconnected');
        console.log(e);
        console.log('تم قطع الاتصال');
      });
      wsserver.on('connect', () => {
        console.log('تم الاتصال بالسيرفر بنجاح');
        setConnectionStatus('connected');
      });
      wsserver.on('close', () => {
        if (window && window.electron)
          window.electron?.ipcRenderer?.sendMessage('exit-se');
      });
    }

    return () => wsserver?.disconnect();
  }, [user, loadingDb]);

  // handle events
  useEffect(() => {
    if (wsserver) {
      wsserver.on('connection-succeeded', handleUserData);
      wsserver.on('message-from-server', recieveNewMessage);
      wsserver.on('server-recieved-message', setPendingToFalse);
      wsserver.on('message-acknowledge', setRecievedToTrue);
      wsserver.on('message-read-acknowledge', setReadToTrue);
      wsserver.on('poke', handlePoke);
      wsserver.on('typing', handleTyping);
      wsserver.on('typing-stopped', handleTypingStopped);
      wsserver.on('added-to-new-group', handleNewGroup);
      wsserver.on('user-status-changed', handleUserstatus);
      wsserver.on('client-deleted-message', handleClientDeleteMessage);
      // call
      wsserver.on('client-call', recieveCall);
      wsserver.on('client-call-answer', callAnswered);
      wsserver.on('call-ended', callEnded);
      wsserver.on('call-rejected', callRejected);
      wsserver.on('candidate', recieveCallCandidate);
    }

    return () => {
      if (wsserver) {
        wsserver.off('connection-succeeded', handleUserData);
        wsserver.off('message-from-server', recieveNewMessage);
        wsserver.off('server-recieved-message', setPendingToFalse);
        wsserver.off('message-acknowledge', setRecievedToTrue);
        wsserver.off('message-read-acknowledge', setReadToTrue);
        wsserver.off('poke', handlePoke);
        wsserver.off('typing', handleTyping);
        wsserver.off('added-to-new-group', handleNewGroup);
        wsserver.off('typing-stopped', handleTypingStopped);
        wsserver.off('user-status-changed', handleUserstatus);
        wsserver.off('client-deleted-message', handleClientDeleteMessage);
        // call
        wsserver.off('client-call', recieveCall);
        wsserver.off('client-call-answer', callAnswered);
        wsserver.off('call-ended', callEnded);
        wsserver.off('call-rejected', callRejected);
        wsserver.off('candidate', recieveCallCandidate);
      }
    };
  }, [selectedChat, conversations, wsserver, callData]);

  function recieveCall(payload) {
    if (showCallModal)
      return wsserver.emit('client-do-another-call', {
        sender_number: user.number,
        reciever_number: payload.sender_number,
      });

    console.log('new Call', payload);

    setCallData({
      sender_number: payload.sender_number,
      sender_name: contacts.find((el) => el.number === payload.sender_number)
        ?.name,
      status: 'calling',
      remoteOffer: payload.offer,
      isVideo: payload.isVideo,
    });

    setShowCallModal(true);
    callRingRefrence.current.currentTime = 0;
    callRingRefrence.current.play();
  }

  async function callAnswered(payload) {
    if (!peerConnectionRefrence.current) return;
    stopRings();
    let seconds = 0;
    setCallData((p) => {
      return {
        ...p,
        status: 'connected',
        intervalId: setInterval(() => {
          seconds = seconds + 1;
          setCallData((ps) => {
            return {
              ...ps,
              seconds,
            };
          });
        }, 990),
      };
    });

    await peerConnectionRefrence.current.setRemoteDescription(
      new RTCSessionDescription(payload.answer)
    );
  }

  function callEnded({ sender_number }) {
    const callerNumber = callData.isCaller
      ? callData.reciever_number
      : callData.sender_number;
    if (sender_number === callerNumber) {
      stopRings();
      if (peerConnectionRefrence.current)
        peerConnectionRefrence.current.close();
      peerConnectionRefrence.current = null;
      clearInterval(callData.intervalId);
      if (callData.localStream && callData.localStream instanceof MediaStream)
        callData.localStream.getTracks().forEach((t) => t.stop());
      setCallData({});
      setShowCallModal(!1);
    }
  }

  function callRejected({ sender_number }) {
    if (peerConnectionRefrence.current) {
      stopRings();
      if (peerConnectionRefrence.current)
        peerConnectionRefrence.current.close();
      peerConnectionRefrence.current = null;
      clearInterval(callData.intervalId);
      if (callData.localStream && callData.localStream instanceof MediaStream)
        callData.localStream.getTracks().forEach((t) => t.stop());
      setCallData({});
      setShowCallModal(!1);
    }
  }

  function recieveCallCandidate(payload) {
    const newCandidate = new RTCIceCandidate({
      sdpMLineIndex: payload.label,
      candidate: payload.candidate,
    });
    if (!peerConnectionRefrence.current) {
      savedCandidates.push(newCandidate);
    }
    if (
      peerConnectionRefrence.current &&
      callData.sender_number === payload.sender_number
    ) {
      peerConnectionRefrence.current.addIceCandidate(newCandidate);
    }
  }

  function stopRings() {
    callRingRefrence.current.pause();
    callRingRefrence.current.currentTime = 0;
    callerRingRefrence.current.pause();
    callerRingRefrence.current.currentTime = 0;
  }
  function handleNewGroup(group) {
    setGroups((ps) => {
      window.localStorage.setItem('groups', JSON.stringify([...ps, group]));
      return [...ps, group];
    });

    toast('تم اضافتك الى المجموعه' + ' ' + group.group_name);
  }
  async function recieveNewMessage({
    sender_number,
    reciever_number,
    type,
    text,
    file_id,
    file_name,
    size,
    send_date,
    uid,
    group_id,
    is_group,
  }) {
    let isSelectedChat =
      selectedChat?.contact_number === sender_number ? true : false;
    if (is_group)
      isSelectedChat = selectedChat?.group_id === group_id ? true : false;

    const last_message = {
      uid,
      sender_number,
      reciever_number,
      user: reciever_number,
      is_me: false,
      type,
      text,
      file_id,
      file_name,
      size,
      is_recieved: true,
      is_pending: false,
      is_read: false,
      recieve_date: Date.now(),
      send_date,
      group_id,
      is_group,
    };

    const jsonSendDate = new Date(send_date).toJSON();
    const conversationIndex = conversations.findIndex((el) => {
      if (is_group) {
        return el.group_id === group_id;
      }
      return el.contact_number === sender_number;
    });

    let conversation_id;
    let unread_messages_count = 0;

    if (conversationIndex === -1) {
      var newConversation = {
        user: user.number,
        contact_number: is_group ? null : sender_number,
        last_message_date: null,
        last_message_id: null,
        is_group: is_group,
        group_id: group_id,
        unread_messages_count: 0,
      };

      conversation_id = await db.conversations.add(newConversation);
      const newMessageId = await db.messages.add({
        ...last_message,
        conversation_id,
      });

      const updatedConversation = {
        last_message_date: jsonSendDate,
        last_message_id: newMessageId,
        unread_messages_count: isSelectedChat ? 0 : 1,
      };

      await db.conversations.update(conversation_id, updatedConversation);

      const contact = contacts.find((el) => el.number === sender_number);
      const group = groups.find((el) => el._id === group_id);

      setConversations((conversatios) => {
        return [
          {
            id: conversation_id,
            ...newConversation,
            ...updatedConversation,
            last_message,
            contact,
            group,
          },
        ].concat(conversatios);
      });
    } else {
      conversation_id = conversations[conversationIndex].id;
      unread_messages_count =
        conversations[conversationIndex].unread_messages_count;
      const newMessageId = await db.messages.add({
        ...last_message,
        conversation_id,
      });
      await db.conversations.update(conversation_id, {
        last_message_date: jsonSendDate,
        last_message_id: newMessageId,
        unread_messages_count: isSelectedChat ? 0 : unread_messages_count + 1,
      });

      setConversations((conversation) => {
        const copy = conversation.map((conversation) => {
          if (
            (is_group && conversation.group_id === group_id) ||
            (!is_group && conversation.contact_number === sender_number)
          ) {
            return {
              ...conversation,
              last_message,
              last_message_date: jsonSendDate,
              last_message_id: newMessageId,
              unread_messages_count: isSelectedChat
                ? 0
                : conversation.unread_messages_count + 1,
            };
          } else {
            return conversation;
          }
        });
        return quikSort(copy, 'last_message_date');
      });
    }

    wsserver.emit('client-recieved-message', {
      uid,
      group_id,
      sender_number,
      recieve_date: new Date().toJSON(),
      reciever_number: user.number,
    });

    if (isSelectedChat) {
      scrollToPosition(chatAreaRef);
      newMsgAudioS.currentTime = 0;
      newMsgAudioS.play();
      wsserver.emit('client-read-message', {
        uid,
        group_id,
        sender_number,
        read_date: new Date().toJSON(),
        reciever_number: user.number,
      });
    } else {
      const c = contacts.find((el) => el.number === sender_number);
      const g = groups.find((el) => el._id === group_id);

      if (window && window.electron)
        window?.electron?.ipcRenderer?.sendMessage(
          'play-new-message-notification',
          {
            text,
            sender: is_group
              ? g?.group_name || group_id
              : c?.name || sender_number,
          }
        );
      newMsgAudio.currentTime = 0;
      newMsgAudio.play();
    }
  }
  async function handleUserData({
    offline_inbox,
    require_recieved_acknow,
    require_read_acknow,
    offline_notifications,
    groups,
    all_users,
    users_status,
  }) {
    const conversationsUpdate = [...conversations];
    const contactsUpdate = [...contacts];
    const groupsUpdate = [];
    console.log(offline_inbox);
    // handle groups
    if (window && window.localStorage)
      window.localStorage.setItem('groups', JSON.stringify(groups));
    groups.forEach((el) => {
      groupsUpdate.push(el);
    });

    // handle offline messages

    if (Array.isArray(offline_inbox)) {
      const handleNewMessagesArray = async () => {
        for (const msg of offline_inbox) {
          const {
            sender_number,
            reciever_number,
            type,
            text,
            file_id,
            file_name,
            size,
            send_date,
            uid,
            group_id,
            is_group,
          } = msg;

          const contact = contactsUpdate.find(
            (el) => el.number === sender_number
          );
          const group = groups.find((el) => el._id === group_id);

          let isSelectedChat =
            selectedChat?.contact_number === sender_number ? true : false;
          if (is_group)
            isSelectedChat = selectedChat?.group_id === group_id ? true : false;

          const last_message = {
            uid,
            sender_number,
            reciever_number,
            user: reciever_number,
            is_me: false,
            type,
            text,
            file_id,
            file_name,
            size,
            is_recieved: true,
            is_pending: false,
            is_read: false,
            recieve_date: Date.now(),
            send_date,
            group_id,
            is_group,
          };

          const jsonSendDate = new Date(send_date).toJSON();
          const conversationIndex = conversationsUpdate.findIndex((el) => {
            if (is_group) {
              return el.group_id === group_id;
            }
            return el.contact_number === sender_number;
          });

          let conversation_id;
          let unread_messages_count = 0;

          if (conversationIndex === -1) {
            var newConversation = {
              user: user.number,
              contact_number: is_group ? null : sender_number,
              last_message_date: null,
              last_message_id: null,
              is_group: is_group,
              group_id: group_id,
              unread_messages_count: 0,
            };
            conversation_id = await db.conversations.add(newConversation);
            const newMessageId = await db.messages.add({
              ...last_message,
              conversation_id,
            });

            const updatedConversation = {
              last_message_date: jsonSendDate,
              last_message_id: newMessageId,
              unread_messages_count: isSelectedChat ? 0 : 1,
            };

            await db.conversations.update(conversation_id, updatedConversation);

            conversationsUpdate.push({
              id: conversation_id,
              ...newConversation,
              ...updatedConversation,
              last_message,
              contact,
              group,
            });
          } else {
            conversation_id = conversationsUpdate[conversationIndex].id;
            unread_messages_count =
              conversationsUpdate[conversationIndex].unread_messages_count;
            const newMessageId = await db.messages.add({
              ...last_message,
              conversation_id,
            });
            await db.conversations.update(conversation_id, {
              last_message_date: jsonSendDate,
              last_message_id: newMessageId,
              unread_messages_count: isSelectedChat
                ? 0
                : unread_messages_count + 1,
            });

            conversationsUpdate[conversationIndex] = {
              ...conversationsUpdate[conversationIndex],
              last_message,
              last_message_date: jsonSendDate,
              last_message_id: newMessageId,
              unread_messages_count: isSelectedChat
                ? 0
                : unread_messages_count + 1,
            };
          }
          wsserver.emit('client-recieved-message', {
            uid,
            group_id,
            sender_number,
            recieve_date: new Date().toJSON(),
            reciever_number: user.number,
          });

          if (isSelectedChat) {
            scrollToPosition(chatAreaRef);
            wsserver.emit('client-read-message', {
              uid,
              group_id,
              sender_number,
              read_date: new Date().toJSON(),
              reciever_number: user.number,
            });
          } else {
            if (window && window.electron)
              window?.electron?.ipcRenderer?.sendMessage(
                'play-new-message-notification',
                {
                  text,
                  sender_number,
                  contact,
                  group,
                }
              );
          }
        }
      };
      await handleNewMessagesArray();
    }
    if (Array.isArray(require_recieved_acknow)) {
      const runLoop = async () => {
        for (const item of require_recieved_acknow) {
          const { uid, recieve_date } = item;
          await updateMany(
            $Messages,
            { uid },
            { is_recieved: true, recieve_date }
          );

          wsserver.emit('client-recieved-message-acknowledge', {
            uid,
            sender_number: user.number,
          });
        }
      };
      await runLoop();
    }
    if (Array.isArray(require_read_acknow)) {
      const runLoop = async () => {
        for (const item of require_read_acknow) {
          const { uid, read_date } = item;
          await updateMany($Messages, { uid }, { is_read: true, read_date });

          wsserver.emit('client-recieved-message-read-acknowledge', {
            uid,
            sender_number: user.number,
          });
        }
      };
      await runLoop();
    }

    if (Array.isArray(offline_notifications)) {
      const runLoop = async () => {
        for (const item of offline_notifications) {
          const { type, body } = item;
          if (type === 'delete-message') {
            await updateMany($Messages, { uid: body.uid }, { deleted: true });

            wsserver.emit('client-deleted-message-acknow', {
              uid: body.uid,
              reciever_number: user.number,
            });
          }
        }
      };
      await runLoop();
    }

    if (users_status && Array.isArray(users_status)) {
      conversationsUpdate.forEach((elem, index) => {
        conversationsUpdate[index]['contact_status'] =
          users_status[elem.contact_number]?.status;
        conversationsUpdate[index]['profile_photo'] =
          SERVER_URL + '/backendserver/profileimages/' + elem.contact_number;
        conversationsUpdate[index]['bio'] =
          users_status[elem.contact_number]?.bio;
      });
      contactsUpdate.forEach((elem, index) => {
        contactsUpdate[index]['contact_status'] =
          users_status[elem.number]?.status;
        contactsUpdate[index]['profile_photo'] =
          SERVER_URL + '/backendserver/profileimages/' + elem.contact_number;
        contactsUpdate[index]['bio'] = users_status[elem.contact_number]?.bio;
      });
    }

    // offline_notifications,
    if (all_users && Array.isArray(all_users)) {
      all_users.forEach(async (user) => {
        const { number, user_name, is_active, last_active } = user;
        const contactIndex = contactsUpdate.findIndex(
          (contact) => contact.number === number
        );

        const conversationIndex = conversationsUpdate.findIndex(
          (conversation) => conversation.contact_number === number
        );

        if (contactIndex === -1) {
          const id = await insertOne($Contacts, { number, name: user_name });
          contactsUpdate.push({
            id,
            number,
            name: user_name,
            contact_status: is_active ? 'active' : last_active,
          });
        } else {
          contactsUpdate[contactIndex]['contact_status'] = is_active
            ? 'active'
            : last_active;
        }

        if (conversationIndex !== -1) {
          conversationsUpdate[conversationIndex]['contact_status'] = is_active
            ? 'active'
            : last_active;
          if (contactIndex === -1) {
            conversationsUpdate[conversationIndex]['contact'] =
              contactsUpdate[contactsUpdate.length - 1];
          }
        }
      });
    }

    setGroups(groups);
    setConversations(quikSort(conversationsUpdate, 'last_message_date'));
    setContacts(contactsUpdate);
  }
  async function setPendingToFalse({ uid, file_id, send_date }) {
    sendedAudio.currentTime = 0;
    sendedAudio.play();

    await updateMany(
      $Messages,
      { uid },
      { is_pending: false, send_date: new Date(send_date).toJSON() }
    );
  }
  async function setRecievedToTrue({ uid, recieve_date }) {
    await updateMany($Messages, { uid }, { is_recieved: true, recieve_date });
    wsserver.emit('client-recieved-message-acknowledge', {
      uid,
      sender_number: user.number,
    });
  }
  async function setReadToTrue({ uid, read_date, reciever_number }) {
    await updateMany($Messages, { uid }, { is_read: true, read_date });
    wsserver.emit('client-recieved-message-read-acknowledge', {
      uid,
      sender_number: user.number,
      reciever_number,
    });
  }
  async function handleClientDeleteMessage({
    uid,
    sender_number,
    is_group,
    group_id,
  }) {
    await updateMany($Messages, { uid }, { deleted: true });
    wsserver.emit('client-deleted-message-acknow', {
      uid,
      reciever_number: user.number,
    });
  }
  function handlePoke(sender_number) {
    const contact = contacts.find((el) => el.number === sender_number);
    toast('' + contact ? contact.name : sender_number);
    if (!sirenAudio.played) {
      sirenAudio.play();
    } else {
      sirenAudio.currentTime = 0;
      sirenAudio.play();
    }
  }
  function handleTyping(sender_number) {
    setConversations((ps) => {
      let copy = [...ps];
      const index = copy.findIndex((el) => el.contact_number === sender_number);
      if (index >= 0) {
        copy[index]['is_typing'] = true;
      }
      return copy;
    });

    if (selectedChat?.contact_number === sender_number) {
      setSelectedChat({ ...selectedChat, is_typing: true });
    }
  }
  function handleTypingStopped(sender_number) {
    setConversations((ps) => {
      let copy = [...ps];
      const index = copy.findIndex((el) => el.contact_number === sender_number);
      if (index >= 0) {
        copy[index]['is_typing'] = false;
      }
      return copy;
    });
    if (selectedChat?.contact_number === sender_number) {
      setSelectedChat({ ...selectedChat, is_typing: false });
    }
  }
  function handleUserstatus({ sender_number, status }) {
    setConversations((ps) => {
      let copy = [...ps];
      const index = copy.findIndex((el) => el.contact_number === sender_number);
      if (index >= 0) copy[index]['contact_status'] = status;
      return copy;
    });

    setContacts((ps) => {
      let copy = [...ps];
      const index = copy.findIndex((el) => el.number === sender_number);
      if (index >= 0) copy[index]['contact_status'] = status;
      return copy;
    });

    if (selectedChat?.contact_number === sender_number) {
      setSelectedChat({ ...selectedChat, contact_status: status });
    }
  }
  // emit
  async function sendMessage(message) {
    if (connectionStatus === 'disconnected') return;
    try {
      if (!message.is_group && selectedChat?.contact_number === user.number) {
        return;
      }

      let uid = uuidv4();

      if (message.file_name && message.body) {
        await insertOne($Files, {
          file_id: uid,
          blob: message.body,
        });
      }

      let newMessage = {
        uid,
        send_date: new Date().toJSON(),
        file_id: uid,
        sender_number: user.number,
        user: user.number,
        reciever_number: selectedChat.is_group
          ? null
          : selectedChat.contact_number,
        type: message.type,
        file_name: message.file_name,
        text: message.text,
        size: message.size,
        is_me: true,
        is_recieved: false,
        is_read: false,
        is_pending: true,
        conversation_id: selectedChat.id,
        is_group: selectedChat.is_group,
        group_id: selectedChat.group_id,
        token: user.token,
      };

      const messageId = await db.messages.add(newMessage);
      await db.conversations.update(selectedChat.id, {
        last_message_id: messageId,
        last_message_date: Date.now(),
        unread_messages_count: 0,
      });

      setConversations((conversations) => {
        const copy = [...conversations];
        const conversationIndex = copy.findIndex((el) => {
          if (selectedChat.is_group) {
            return el.group_id === selectedChat.group_id;
          } else {
            return el.contact_number === selectedChat.contact_number;
          }
        });
        if (conversationIndex === -1) {
          return [
            {
              ...selectedChat,
              last_message_id: messageId,
              last_message_date: newMessage.send_date,
              last_message: {
                ...newMessage,
                body: undefined,
              },
            },
            ...copy,
          ];
        } else {
          copy[conversationIndex].last_message_id = messageId;
          copy[conversationIndex].last_message_date = newMessage.send_date;
          copy[conversationIndex].last_message = {
            ...newMessage,
            body: undefined,
          };
          const finalResult = quikSort(copy, 'last_message_date');
          return finalResult;
        }
      });

      if (message.file_name && message.body) {
        const formData = new FormData();
        formData.set('file', message.body);
        try {
          const response = await server.post('/files', formData, {
            timeout: Date.now(),
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ` + user.token,
            },
          });
          console.log(response);
          await updateMany(
            $Files,
            { file_id: uid },
            { file_id: response.data?.fileId }
          );
          await updateMany(
            $Messages,
            { uid },
            { file_id: response.data?.fileId }
          );

          wsserver.emit('message-to-server', {
            ...newMessage,
            file_id: response.data?.fileId,
            type: response.data?.type,
            size: response.data?.size,
            is_file: true,
          });

          return;
        } catch (err) {
          console.log('Error', err);
        }
      }

      wsserver.emit('message-to-server', {
        ...newMessage,
        file_id: undefined,
      });
    } catch (err) {
      // delete file
      // delete message
    }
  }
  function poke() {
    wsserver.emit('poke', {
      sender_number: user.number,
      reciever_number: selectedChat.contact_number,
    });
  }
  function typing() {
    if (selectedChat.is_group) return;
    const payload = {
      sender_number: user.number,
      reciever_number: selectedChat.contact_number,
    };

    wsserver.emit('typing', payload);
    if (timeOutId && last_number === selectedChat?.contact_number)
      clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      wsserver.emit('typing-stopped', payload);
    }, 500);

    last_number = selectedChat?.contact_number;
  }
  function sendReadAcknow({ sender_number, uid }) {
    wsserver.emit('client-read-message', {
      sender_number,
      uid,
      read_date: new Date().toJSON(),
    });
  }
  function deleteMessage({ reciever_number, uid, is_group, group_id }) {
    wsserver.emit('client-deleted-message', {
      sender_number: user.number,
      reciever_number,
      uid,
      is_group,
      group_id,
    });
  }
  return {
    page,
    deleteMessage,
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
    wsserver,
  };
};

export default useSocket;

function filterConversation(rows) {
  return rows.filter((r) => typeof r.last_message_id === 'number');
}

function quikSort(arrp, key) {
  const arr = [...arrp];
  if (arr.length <= 1) return arr;
  const p = arr[0];
  const rightArr = [];
  const lefttArr = [];

  for (let i = 1; i < arr.length; i++) {
    if (new Date(p[key]).getTime() > new Date(arr[i][key]).getTime()) {
      rightArr.push(arr[i]);
    } else {
      lefttArr.push(arr[i]);
    }
  }

  return [...quikSort(lefttArr, key), p, ...quikSort(rightArr, key)];
}

function getFromLocalStorage(key) {
  return new Promise((resolve, reject) => {
    if (window && window.localStorage) {
      const data = window.localStorage.getItem(key);
      resolve(data);
    } else {
      reject('Cannot Access Local Storage');
    }
  });
}

function parseJson(string) {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(string));
    } catch (err) {
      reject(err);
    }
  });
}
