import React from 'react';
import { db } from '../../../Functions/methods/LocalDB/db';
import {
    ChatsListWrapper,
    UnreadMsgsCount,
    ConversationCard,
    ConversationInfo,
    LeftWrapperDiv,
    ContactName,
    LastMessageBody,
    RigthWrapperDiv,
    LastMessageDateTime,
    Active,
} from '../../../Assets/styled/main';
import moment from 'moment';
import RenderProfileImage from './RenderProfileImage';
import renderMessage from '../../../Functions/methods/Application/renderMessage';

export default function ConverstaionsList({
    conversations,
    selectedChat,
    setSelectedChat,
    setConversations,
    sendReadAcknow,
    locale,
}) {
    return (
        <ChatsListWrapper>
            {conversations.map((conversation) => {
                return (
                    <Cnv
                        is_selected={selectedChat?.id === conversation.id}
                        setSelectedChat={setSelectedChat}
                        setConversations={setConversations}
                        sendReadAcknow={sendReadAcknow}
                        conversation={conversation}
                        key={conversation.last_message_date}
                        locale={locale}
                    />
                );
            })}
        </ChatsListWrapper>
    );
}

function ConversationCardDiv({ is_selected, conversation, setConversations, setSelectedChat, sendReadAcknow }) {
    const handleConversationClick = (el) => async () => {
        if (el.unread_messages_count > 0) {
            const unread_messages = await db.messages
                .where({ conversation_id: el?.id })
                .reverse()
                .limit(el.unread_messages_count)
                .toArray();

            for (const unread_message of unread_messages) {
                sendReadAcknow({
                    uid: unread_message.uid,
                    sender_number: el.contact_number,
                });
            }

            await db.conversations.update(el.id, {
                unread_messages_count: 0,
            });

            setConversations((ps) => {
                return ps.map((conversation) => {
                    if (conversation.contact_number === el.contact_number)
                        return { ...conversation, unread_messages_count: 0 };

                    return conversation;
                });
            });
        }

        setSelectedChat(el);
    };
    return (
        <ConversationCard is_selected={is_selected} onClick={handleConversationClick(conversation)}>
            <RenderProfileImage number={conversation.contact_number} />
            {conversation.contact_status === 'active' && <Active></Active>}
            <ConversationInfo>
                <LeftWrapperDiv>
                    <ContactName is_selected={is_selected}>
                        {conversation.is_group && (conversation.group?.group_name || conversation.group_id)}
                        {(!conversation.is_group && conversation.contact?.name) || conversation.contact_number}
                    </ContactName>
                    <LastMessageBody is_selected={is_selected}>
                        {conversation.last_message.is_me && !conversation.is_typing && 'أنت :'}
                        {(conversation.is_typing && <p style={{ color: '#06d6a0' }}>يكتب الآن ...</p>) ||
                            renderMessage(conversation.last_message, true)}
                    </LastMessageBody>
                </LeftWrapperDiv>
                <RigthWrapperDiv>
                    <LastMessageDateTime is_selected={is_selected}>
                        {moment(conversation.last_message_date).calendar('')}

                        {conversation.unread_messages_count > 0 && (
                            <UnreadMsgsCount>{conversation.unread_messages_count}</UnreadMsgsCount>
                        )}
                    </LastMessageDateTime>
                </RigthWrapperDiv>
            </ConversationInfo>
        </ConversationCard>
    );
}

export const Cnv = React.memo(ConversationCardDiv, function (prevProps, nextProps) {
    // console.log(
    //   prevProps.conversation.last_message_id,
    //   nextProps.conversation.last_message_id
    // );
    if (prevProps.conversation.unread_messages_count !== nextProps.conversation.unread_messages_count) {
        return false;
    }

    if (prevProps.locale !== nextProps.locale) {
        return false;
    }

    if (prevProps.is_selected !== nextProps.is_selected) {
        return false;
    }

    if (prevProps.conversation.last_message_date !== nextProps.conversation.last_message_date) {
        return false;
    }

    return true;
});

// <ConversationCard
// is_selected={selectedChat?.id === conversation.id}
// key={i}
// onClick={handleConversationClick(conversation)}
// >
// <RenderProfileImage number={conversation.contact_number} />

// {conversation.contact_status === 'active' && <Active></Active>}
// <ConversationInfo>
//   <LeftWrapperDiv>
//     <ContactName is_selected={selectedChat?.id === conversation.id}>
//       {conversation.is_group &&
//         (conversation.group?.group_name || conversation.group_id)}
//       {(!conversation.is_group && conversation.contact?.name) ||
//         conversation.contact_number}
//     </ContactName>
//     <LastMessageBody
//       is_selected={selectedChat?.id === conversation.id}
//     >
//       {conversation.last_message.is_me &&
//         !conversation.is_typing &&
//         'أنت :'}
//       {(conversation.is_typing && (
//         <p style={{ color: '#06d6a0' }}>يكتب الآن ...</p>
//       )) ||
//         renderMessage(conversation.last_message, true)}
//     </LastMessageBody>
//   </LeftWrapperDiv>
//   <RigthWrapperDiv>
//     <LastMessageDateTime
//       is_selected={selectedChat?.id === conversation.id}
//     >
//       {moment(conversation.last_message_date).calendar('')}

//       {conversation.unread_messages_count > 0 && (
//         <UnreadMsgsCount>
//           {conversation.unread_messages_count}
//         </UnreadMsgsCount>
//       )}
//     </LastMessageDateTime>
//   </RigthWrapperDiv>
// </ConversationInfo>
// </ConversationCard>
