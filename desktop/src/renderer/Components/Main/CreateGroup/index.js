import React, { useState } from 'react';
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

import { AiFillEdit, AiFillDelete, AiFillCheckCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import profileImage from '../../../Assets/imgs/profilegrey.png';
import server, { SERVER_URL } from '../../../Functions/methods/Server/server';
import { BsFilterLeft } from 'react-icons/bs';
import { IoIosAdd } from 'react-icons/io';
import { MAIN_COLOR } from '../../../Assets/styled/colors';
import { toast } from '../../../Components/Toast';

export default function CreateGroup({ contacts, user }) {
    const [values, setValues] = useState({
        group_name: '',
        members: [user.number],
        owners: [user.number],
        is_channel: false,
    });

    const [filter, setFilter] = useState('');

    function handleToggleMember(number) {
        if (values.members.includes(number)) {
            setValues({
                ...values,
                members: values.members.filter((c) => c !== number),
            });
        } else {
            setValues({ ...values, members: [...values.members, number] });
        }
    }

    function handleGroupNameChange(e) {
        setValues({ ...values, group_name: e.target.value });
    }

    function handleCreateGroup() {
        if (values.members.length === 0 || values.group_name.length === 0) {
            toast('يرجى تعبئة الحقول');

            return;
        }
        server
            .post('/creategroup', values, {
                headers: { Authorization: 'Bearer ' + user.token },
            })
            .then((data) => {
                console.log('created');
                toast('تم انشاء المجموعه');
                setValues({
                    group_name: '',
                    members: [user.number],
                    owners: [user.number],
                    is_channel: false,
                });
            })
            .catch((err) => {
                setValues({
                    group_name: '',
                    members: [user.number],
                    owners: [user.number],
                    is_channel: false,
                });
                toast('Err');
                console.log(err);
            });
    }
    return (
        <div className="create-group-wrapper">
            <p className="create-group-label">Nave Grupe اسم المجموعه :</p>
            <input className="create-group-input" value={values.group_name} onChange={handleGroupNameChange} />

            <div
                style={{
                    marginTop: 20,
                    overflowY: 'scroll',
                }}
            >
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
                    .map((contact, i) => (
                        <ContactCardWrapper
                            style={{
                                marginTop: 30,
                                border: '1px solid ' + MAIN_COLOR,
                                borderRadius: 10,
                            }}
                            key={i}
                            onClick={() => {
                                handleToggleMember(contact.number);
                            }}
                        >
                            <FlexCenterDiv>
                                <Icon>
                                    {(values.members.includes(contact.number) && (
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
            </div>
            <button
                style={{ backgroundColor: MAIN_COLOR, border: 'none' }}
                className="create-group-btn"
                onClick={handleCreateGroup}
            >
                Ere انشاء المجموعه
            </button>
        </div>
    );
}
