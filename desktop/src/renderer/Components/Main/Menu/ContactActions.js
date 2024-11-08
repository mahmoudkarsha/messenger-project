import React, { useEffect, useState } from 'react';
import { Form, Input, Submit } from '../../../Assets/styled/addcontact';
import {
  insertOne,
  $Contacts,
  updateById,
  findOne,
} from '../../../Functions/methods/LocalDB/db';
import server, { SERVER_URL } from '../../../Functions/methods/Server/server';
import { AxiosError } from 'axios';
import { toast } from '../../Toast';

const addInitialState = {
  name: '',
  number: '',
};
function ContactActions({
  user,
  setContacts,
  setConversations,
  edit,
  initialState,
  id,
}) {
  const [values, setValues] = useState(edit ? initialState : addInitialState);

  useEffect(() => {
    if (initialState) setValues(initialState);
  }, [initialState]);

  const onContactInputChange = (name) => (e) =>
    setValues({ ...values, [name]: e.target.value });

  async function addContact() {
    try {
      if (!values.name || !values.number) throw new Error('يرجى تعبئة الحقول');

      //check if exist on server
      // await server.get('/checkcontact?number=' + values.number);
      const res = await fetch(SERVER_URL + '/backendserver/checkcontact');

      //add to database
      const newContact = {
        name: values.name,
        number: values.number,
        user: user.number,
      };

      if (edit) {
        updateById($Contacts, id, newContact);
        addToState();
      } else {
        const isExist = await findOne($Contacts, { number: newContact.number });
        if (isExist) {
          toast('Ev nav Heye');
        } else {
          var newId = await insertOne($Contacts, newContact);
          addToState();
        }
      }

      function addToState() {
        // setContacts
        setContacts((contacts) => {
          if (edit) {
            return contacts.map((c) => {
              if (c.id === id)
                return {
                  ...c,
                  ...newContact,
                };
              return c;
            });
          } else {
            return [...contacts, { id: newId, ...newContact }];
          }
        });
        // setConversations

        setConversations((conversation) => {
          return conversation.map((c) => {
            if (c.contact_number === newContact.number)
              return {
                ...c,
                contact: {
                  ...newContact,
                },
              };
            return c;
          });
        });
        toast(edit ? 'تم تعديل' : 'تم اضافة ' + values.name);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast('هذا الرقم غير موجود');
      } else {
        toast(err.message);
      }
    } finally {
      setValues(edit ? initialState : addInitialState);
    }
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    addContact();
  };
  return (
    <Form onSubmit={onFormSubmit}>
      <Input
        value={values.name}
        placeholder="الاسم nav"
        onChange={onContactInputChange('name')}
      />
      <Input
        readOnly={!!edit}
        value={values.number}
        placeholder="الرقم nimre"
        onChange={onContactInputChange('number')}
      />
      <Submit>Erê - تأكيد</Submit>
    </Form>
  );
}

export default ContactActions;
