import React from 'react';
import { Submit } from '../../../Assets/styled/addcontact';
import { toast } from '../../../Components/Toast';
import { $Contacts, DeleteById } from '../../../Functions/methods/LocalDB/db';

export default function ContactDelete({ setContacts, close_modal, id, initialState }) {
    async function handleDelete() {
        try {
            const deletedContact = await DeleteById($Contacts, id);
            toast('تم الحذف');
            setContacts((ps) => {
                return ps.filter((c) => c.id !== id);
            });
            close_modal();
        } catch (err) {}
    }

    return (
        <div
            style={{
                padding: 10,
            }}
        >
            <p>حذف جهة الاتصال </p>
            <p>{initialState?.name}</p>
            <Submit onClick={handleDelete}>تأكيد</Submit>
        </div>
    );
}
