import React from 'react';
import { db } from '../../../Functions/methods/LocalDB/db';
import {
  GroupsListWrapper,
  ConversationCard,
} from '../../../Assets/styled/main';
import groupImage from '../../../Assets/imgs/group.jpg';

export default function GroupsList({
  selectedChat,
  setSelectedChat,
  groups,
  user,
}) {
  const handleGroupClick = (group) => async () => {
    const groupConversation = await db.conversations
      .where({ group_id: group._id })
      .toArray();

    if (!groupConversation.length) {
      const newConversation = {
        is_group: true,
        user: user.number,
        group_id: group._id,
        last_message_date: null,
        last_message_id: null,
        contact_number: null,
        unread_messages_count: 0,
        group: group,
      };
      const conversationId = await db.conversations.add(newConversation);
      setSelectedChat({
        id: conversationId,
        ...newConversation,
      });
    }
    setSelectedChat(groupConversation[0]);
  };
  return (
    <GroupsListWrapper>
      {groups.map((group) => {
        return (
          <ConversationCard onClick={handleGroupClick(group)}>
            <img src={groupImage} height={60} width={60} />
            {group.group_name}
          </ConversationCard>
        );
      })}
    </GroupsListWrapper>
  );
}
