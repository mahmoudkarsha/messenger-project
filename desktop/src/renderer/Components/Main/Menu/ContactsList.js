import React, { useState } from 'react';
import {
  findOne,
  $Conversations,
  insertOne,
} from '../../../Functions/methods/LocalDB/db';
import {
  ContactsListWrapper,
  ContactCardWrapper,
  ContactInfo,
  Name,
  Number,
  FlexCenterDiv,
  Icon,
  Active,
  SearchWrapper,
  SearchIcon,
  SearchInput,
} from '../../../Assets/styled/main';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import profileImage from '../../../Assets/imgs/profilegrey.png';
import { SERVER_URL } from '../../../Functions/methods/Server/server';
import { BsFilterLeft } from 'react-icons/bs';
import { IoIosAdd } from 'react-icons/io';
import Modal from '../../Modal';
import ContactActions from './ContactActions';
import RenderProfileImage from './RenderProfileImage';
import ContactDelete from './ContactDelete';

export default function ContactsList({
  setSelectedChat,
  setContacts,
  setConversations,
  contacts,
  user,
}) {
  const [searchText, setSearchText] = useState('');

  const [editModal, setEditModal] = useState({
    opened: false,
    id: null,
    initialState: {},
  });

  const [deleteModal, setDeleteModal] = useState({
    opened: false,
    id: null,
  });

  const handleContactClick = (contact) => async () => {
    const result = await findOne($Conversations, {
      contact_number: contact.number,
    });
    if (!result) {
      const newConversation = {
        user: user.number,
        contact_number: contact.number,
        last_message_id: null,
        last_message_date: null,
        unread_messages_count: 0,
        is_group: false,
        group_id: null,
      };
      const additem = await insertOne($Conversations, newConversation);
      setSelectedChat({
        id: additem,
        ...newConversation,
        contact,
      });
      return;
    }
    setSelectedChat({ ...result, contact_status: contact.contact_status });
  };

  return (
    <ContactsListWrapper>
      <Modal
        is_opened={editModal.opened}
        close_modal={() => setEditModal({})}
        header="Têkilî biguherînin"
        height={''}
        width={'600px'}
      >
        <ContactActions
          setContacts={setContacts}
          setConversations={setConversations}
          edit
          id={editModal.id}
          initialState={editModal.initialState}
          user={user}
        />
      </Modal>

      <Modal
        is_opened={deleteModal.opened}
        close_modal={() => setDeleteModal({})}
        header="حذف جهة الاتصال"
        width={'400px'}
      >
        <ContactDelete
          setContacts={setContacts}
          id={deleteModal.id}
          user={user}
          close_modal={() => setDeleteModal({})}
          initialState={deleteModal.initialState}
        />
      </Modal>

      <SearchWrapper>
        <SearchIcon>
          {(searchText.length && <IoIosAdd size={21} />) || (
            <BsFilterLeft size={21} />
          )}
        </SearchIcon>
        <SearchInput onChange={(e) => setSearchText(e.target.value)} />
      </SearchWrapper>
      {contacts
        .filter((c) => {
          if (searchText) {
            return c.name.toLowerCase().includes(searchText.toLowerCase());
          }
          return true;
        })
        .map((contact, i) => (
          <ContactCardWrapper key={i}>
            <FlexCenterDiv onClick={handleContactClick(contact)}>
              {contact.contact_status === 'active' && <Active />}
              <RenderProfileImage number={contact.number} />
              <ContactInfo>
                <Name>{contact.name}</Name>
                <Number>{contact.number}</Number>
              </ContactInfo>
            </FlexCenterDiv>

            <FlexCenterDiv>
              <Icon
                onClick={() =>
                  setEditModal({
                    opened: true,
                    initialState: contact,
                    id: contact.id,
                  })
                }
              >
                <AiFillEdit color="#33333377" />
              </Icon>
              <Icon
                onClick={() =>
                  setDeleteModal({
                    opened: true,
                    initialState: contact,
                    id: contact.id,
                  })
                }
              >
                <AiFillDelete color="#33333377" />
              </Icon>
            </FlexCenterDiv>
          </ContactCardWrapper>
        ))}
    </ContactsListWrapper>
  );
}

/* 


     <Icon>
              <AiFillDelete
                onClick={() =>
                  setDeleteModal({
                    opened: true,
                    id: contact.id,
                  })
                }
                color="#ff000077"
              />
            </Icon>
*/
