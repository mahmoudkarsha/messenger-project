import React, { useState } from 'react';
import styled from 'styled-components';
import {
    ContactsListWrapper,
    ContactCardWrapper,
    ContactInfo,
    Name,
    Number,
    FlexCenterDiv,
    Icon,
    SearchWrapper,
    SearchIcon,
    SearchInput,
} from '../../../Assets/styled/main';
import { keyframes } from 'styled-components';
import fadeIn from 'react-animations/lib/fade-in';
import { findOne, $Conversations, insertOne } from '../../../Functions/methods/LocalDB/db';
import { SERVER_URL } from '../../../Functions/methods/Server/server';
import RenderProfileImage from './RenderProfileImage';

import { AiFillEdit, AiFillDelete, AiFillCheckCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { MAIN_COLOR } from '../../../Assets/styled/colors';

const bounceAnimation = keyframes`${fadeIn}`;

export default function GroupInfo({ setSelectedChat, selectedChat, contacts, setTab, user }) {
    const [filter, setFilter] = useState('');
    const [members, setMembers] = useState([]);

    const renderGroupMembers = (num) => {
        if (num === user.number) return 'Ez - أنا';

        const contact = contacts.find((el) => el.number === num);
        if (contact) {
            return contact.name;
        } else {
            return num;
        }
    };

    const handleContactClick = (num) => async () => {
        if (num === user.number) return;
        const result = await findOne($Conversations, {
            contact_number: num,
        });
        if (!result) {
            const newConversation = {
                user: user.number,
                contact_number: num,
                last_message_id: null,
                last_message_date: null,
                unread_messages_count: 0,
                is_group: false,
                group_id: null,
            };
            const additem = await insertOne($Conversations, newConversation);

            const contact = contacts.find((el) => el.number === num);

            setTab('conversations');
            setSelectedChat({
                id: additem,
                ...newConversation,
                contact,
            });
            return;
        }
        setSelectedChat(result);
    };

    const handleToggleMember = (num) => {
        if (members.includes(num)) {
            setMembers(members.filter((m) => m !== num));
        } else {
            setMembers([...members, num]);
        }
    };

    if (!selectedChat.is_group) {
        setTab('conversations');
        return null;
    }

    return (
        <GroupInfoWrapper>
            {/*      <PanelContainer>
                <PanelOverlay />
                <Panel>
                    <p className="create-group-label">جهات الاتصال الخاصة بك :</p>

                    <input
                        className="create-group-input"
                        placeholder="بحث ضمن جهات الاتصال"
                        onChange={(e) => {
                            setFilter(e.target.value);
                        }}
                    />

                    {contacts
                        .filter((el) => {
                            if (filter.length) {
                                return el.name.toLowerCase().includes(filter.toLowerCase());
                            }
                            return true;
                        })
                        .map((contact) => (
                            <ContactCardWrapper
                                style={{
                                    marginTop: 30,
                                    border: '1px solid ' + MAIN_COLOR,
                                    borderRadius: 10,
                                }}
                                key={contact.number}
                                onClick={() => {
                                    handleToggleMember(contact.number);
                                }}
                            >
                                <FlexCenterDiv>
                                    <Icon>
                                        {(members.includes(contact.number) && (
                                            <AiFillCheckCircle size="34" color={MAIN_COLOR} />
                                        )) || <AiOutlinePlusCircle size="34" color={MAIN_COLOR} />}
                                    </Icon>
                                    <ContactInfo>
                                        <Name>{contact.name}</Name>
                                        <Number>{contact.number}</Number>
                                    </ContactInfo>
                                </FlexCenterDiv>
                            </ContactCardWrapper>
                        ))}
                </Panel>
            </PanelContainer> */}
            <GroupName>{selectedChat?.group?.group_name}</GroupName>
            <GroupMembers>
                <P>المشرفين Admins :</P>
                {selectedChat.group &&
                    selectedChat.group.owners &&
                    Array.isArray(selectedChat.group.owners) &&
                    selectedChat.group?.owners?.map((el) => {
                        return (
                            <ContactCardWrapper key={el}>
                                <FlexCenterDiv onClick={handleContactClick(el)}>
                                    <RenderProfileImage number={el} />
                                    <ContactInfo>
                                        <Name>{renderGroupMembers(el)}</Name>
                                    </ContactInfo>
                                </FlexCenterDiv>
                            </ContactCardWrapper>
                        );
                    })}
                <P>أعضاء المجموعة :</P>
                {selectedChat?.group?.members.map((el) => {
                    return (
                        <ContactCardWrapper key={el}>
                            <FlexCenterDiv onClick={handleContactClick(el)}>
                                <RenderProfileImage number={el} />
                                <ContactInfo>
                                    <Name>{renderGroupMembers(el)}</Name>
                                    <Number>{el}</Number>
                                </ContactInfo>
                            </FlexCenterDiv>
                        </ContactCardWrapper>
                    );
                })}
            </GroupMembers>
        </GroupInfoWrapper>
    );
}

const GroupInfoWrapper = styled.div`
    margin-right: 70px;
    overflow-y: scroll;
    animation: 1s ${bounceAnimation};
    height: calc(100% - 140px);
    width: 100%;
    position: relative;
`;
const GroupName = styled.p`
    font-size: 23px;
    text-align: center;
    padding: 10px;
    font-weight: 700;
    color: #666;
`;

const GroupMembers = styled.div`
    padding: 10px;
`;
const GroupMember = styled.div``;
const P = styled.p`
    font-size: 14px;
    color: #999;
    margin-top: 20px;
`;

const PanelContainer = styled.div`
    position: absolute;
    height: 100%;
    width: calc(100% - 65px);
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Panel = styled.div`
    width: 90%;
    padding: 20px;
    background-color: #fff;
    border-radius: 20px;
    height: 80%;
    overflow-y: scroll;
    border: 1px solid #333;
    z-index: 20;
`;

const PanelOverlay = styled.div`
    background-color: transparent;
    position: absolute;
    height: 100%;
    width: calc(100%);
    z-index: 2;
`;
