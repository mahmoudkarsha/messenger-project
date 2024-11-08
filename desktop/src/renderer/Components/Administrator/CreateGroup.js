import React, { useEffect, useState } from 'react';
import server from '../../Functions/methods/Server/server';
import { toast } from '../Toast';
import { Link } from 'react-router-dom';
import List from './List';

export default function CreateGroup({ userState }) {
    const [user, setUser] = userState;

    const [values, setValues] = useState({
        group_name: '',
        members: [],
        owners: [],
        is_channel: false,
    });

    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [filter, setFilter] = useState('');

    function createGroup() {
        server
            .post('/creategroup', values, {
                headers: { Authorization: 'Bearer ' + user.token },
            })
            .then((data) => {
                console.log('created');
                toast('Group Have Been Created');
            })
            .catch((err) => console.log(err));
    }
    useEffect(() => {
        server
            .get('/userslist', { headers: { Authorization: 'Bearer ' + user.token } })
            .then((data) => setUsers(data.data.result))
            .catch((err) => null);
        server
            .get('/usersstatus', {
                headers: { Authorization: 'Bearer ' + user.token },
            })
            .then((data) => {
                console.log(data.data);
                setStatistics(data.data);
            })
            .catch((err) => null);
    }, [user.token]);

    return (
        <div style={{ padding: 20, height: '100vh', backgroundColor: '#fefae0' }}>
            <Link to={'/'}>back</Link>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {statistics && (
                    <>
                        <List items={statistics.activeUsers} header={'active users'} />
                        <List items={statistics.offlineUsers} header={'offline users'} />
                        <List items={statistics.registeredUsers} header={'registered users'} />
                        <List items={statistics.notRegisteredUsers} header={'not registered users'} />
                    </>
                )}
            </div>
            <div>
                <button
                    style={{
                        padding: 10,
                        margin: 30,
                        display: 'block',
                        backgroundColor: '#ffb703',
                    }}
                    onClick={createGroup}
                >
                    إنشاء مجموعه
                </button>
                <input
                    style={{
                        padding: 10,
                        margin: 10,

                        width: 400,
                    }}
                    onChange={(e) => {
                        setValues({ ...values, group_name: e.target.value });
                    }}
                    placeholder="Group name"
                />
                <input
                    style={{
                        padding: 10,
                        margin: 10,
                    }}
                    placeholder="filter"
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />

                <input
                    style={{
                        padding: 10,
                        margin: 10,
                    }}
                    type="checkbox"
                    placeholder="filter"
                    onChange={(e) => {
                        setValues({ ...values, is_channel: e.target.checked });
                    }}
                />
                <div style={{ padding: 10 }}>
                    {values.members.map((num) => (
                        <span style={{ marginLeft: 10 }}>
                            <span
                                style={{
                                    padding: '2px 10px',
                                    borderRadius: '15px',
                                    backgroundColor: '#fb8500',
                                    color: '#fff',
                                }}
                            >
                                {num}
                            </span>
                        </span>
                    ))}
                </div>

                <div style={{ padding: 10 }}>
                    {values.owners.map((num) => (
                        <span style={{ marginLeft: 10 }}>
                            <span
                                style={{
                                    padding: '2px 10px',
                                    borderRadius: '15px',
                                    backgroundColor: '#fb8500',
                                    color: '#fff',
                                }}
                            >
                                {num}
                            </span>
                        </span>
                    ))}
                </div>
                {users
                    .filter((el) => el.number === filter)
                    .map((user) => {
                        return (
                            <div style={{ padding: 10 }}>
                                <input
                                    onChange={(e) => {
                                        setValues((s) => {
                                            const newMembers = s.members.includes(user.number)
                                                ? s.members.filter((num) => num !== user.number)
                                                : [user.number, ...s.members];
                                            return { ...s, members: newMembers };
                                        });
                                    }}
                                    style={{ marginLeft: 10 }}
                                    type="checkbox"
                                    id={user.number}
                                />

                                <input
                                    onChange={(e) => {
                                        setValues((s) => {
                                            const newMembers = s.members.includes(user.number)
                                                ? s.members.filter((num) => num !== user.number)
                                                : [user.number, ...s.members];
                                            return { ...s, owners: newMembers };
                                        });
                                    }}
                                    style={{ marginLeft: 10 }}
                                    type="checkbox"
                                    id={user.number}
                                />

                                <label htmlFor={user.number}>{user.user_name}</label>
                            </div>
                        );
                    })}

                <button
                    style={{
                        padding: 10,
                        display: 'block',
                        backgroundColor: '#ffb703',
                    }}
                    onClick={() => {
                        server
                            .post(
                                '/closeall',
                                {},
                                {
                                    headers: { Authorization: 'Bearer ' + user.token },
                                }
                            )
                            .then((data) => 1)
                            .catch((err) => console.log(err));
                    }}
                >
                    اغلاق
                </button>
            </div>
        </div>
    );
}
