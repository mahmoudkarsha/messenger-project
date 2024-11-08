const User = require('../database/models/users');
const Group = require('../database/models/groups');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const handleNewMsg = require('./Functions/handleNewMsg');
const fs = require('fs');
const { fromBuffer } = require('file-type-cjs');

const users = {};
function addUser(user_number, contacts) {
    if (!users[user_number]) {
        users[user_number] = {
            status: 'active',
            subscribers: new Set(),
        };
    } else {
        users[user_number].status = 'active';
    }

    contacts.forEach((contact) => {
        if (!users[contact]) {
            users[contact] = {
                status: 'unknown',
                subscribers: new Set([user_number]),
            };
        } else {
            users[contact].subscribers.add(user_number);
        }
    });
}

module.exports = (io) => {
    return async (socket) => {
        try {
            const user_token = socket.handshake.query.token;
            const contacts = socket.handshake.query.contacts;
            const decoded = await promisify(jwt.verify)(user_token, process.env.SECRET);
            const user = await User.findOne({ number: decoded.user_number });

            if (!user) throw new Error('user_deleted_recently');
            if (user.is_banned) throw new Error('user_have_been_banned');

            socket.join(user.number);
            addUser(user.number, contacts.split(','), user.profile_photo);

            const subscribers = users[user.number].subscribers;
            subscribers.forEach((sub) => {
                io.to(sub).emit('user-status-changed', {
                    sender_number: user.number,
                    status: 'active',
                });
            });

            const users_status = {};
            contacts.split(',').forEach((contact) => {
                users_status[contact] = {
                    status: users[contact].status,
                    bio: users[contact].bio,
                    profile_photo: users[contact].profile_photo,
                };
            });

            await User.findByIdAndUpdate(user._id, { is_active: true });

            const groups = await Group.find({ members: user.number });

            socket.emit('connection-succeeded', {
                offline_inbox: user.offline_inbox || [],
                require_recieved_acknow: user.require_recieved_acknow || [],
                groups: groups || [],
                users_status: users_status || {},
                offline_read_messages: user.offline_read_messages || [],
                offline_notifications: user.offline_notifications || [],
            });

            socket.on('message-to-server', async (payload) => {
                try {
                    await handleNewMsg(payload, io);
                } catch (err) {
                    if (err instanceof TypeError) {
                        console.log('Type Error');
                    }
                }
            });

            socket.on('client-recieved-message', async (payload) => {
                const { sender_number, uid, recieve_date, reciever_number } = payload;
                io.to(sender_number).emit('message-acknowledge', {
                    uid,
                    recieve_date,
                });
                await User.findOneAndUpdate(
                    { number: reciever_number },
                    {
                        $pull: {
                            offline_inbox: { uid },
                        },
                    }
                );
                await User.findOneAndUpdate(
                    { number: sender_number },
                    {
                        $push: {
                            require_recieved_acknow: { uid, recieve_date },
                        },
                    }
                );
            });

            socket.on('client-recieved-message-acknowledge', async (payload) => {
                const { uid, sender_number } = payload;
                await User.findOneAndUpdate(
                    { number: sender_number },
                    {
                        $pull: {
                            require_recieved_acknow: { uid },
                        },
                    }
                );
            });

            socket.on('client-read-message', async (payload) => {
                const { sender_number, uid, read_date, reciever_number } = payload;
                io.to(sender_number).emit('message-read-acknowledge', {
                    uid,
                    read_date,
                    reciever_number,
                });

                await User.findOneAndUpdate(
                    { number: sender_number },
                    {
                        $pull: {
                            offline_read_messages: { uid },
                        },
                    }
                );

                await User.findOneAndUpdate(
                    { number: sender_number },
                    {
                        $push: {
                            require_read_acknow: { uid, read_date },
                        },
                    }
                );
            });

            socket.on('client-recieved-message-read-acknowledge', async (payload) => {
                const { uid, sender_number } = payload;

                await User.findOneAndUpdate(
                    { number: sender_number },
                    {
                        $pull: {
                            require_read_acknow: { uid },
                        },
                    }
                );
            });

            socket.on('client-deleted-message', async (payload) => {
                const { uid, sender_number, reciever_number, is_group, group_id } = payload;
                console.log('delete messagee');
                if (is_group) {
                    const group = Group.findById(group_id);
                    if (!group) return;

                    group.members.forEach(async (m) => {
                        await User.findOneAndUpdate(
                            { number: m },
                            {
                                $push: {
                                    offline_notifications: {
                                        type: 'delete-message',
                                        body: { uid, sender_number, is_group, group_id },
                                    },
                                },
                            }
                        );
                        io.to(m).emit('client-deleted-message', { uid, sender_number, is_group, group_id });
                    });
                    return;
                }
                await User.findOneAndUpdate(
                    { number: reciever_number },
                    {
                        $push: {
                            offline_notifications: {
                                type: 'delete-message',
                                body: { uid, sender_number, is_group, group_id },
                            },
                        },
                    }
                );
                io.to(reciever_number).emit('client-deleted-message', { sender_number, uid });
                io.to(sender_number).emit('client-deleted-message', { sender_number, uid });
            });

            socket.on('client-deleted-message-acknow', async (payload) => {
                const { uid, reciever_number } = payload;

                await User.findOneAndUpdate(
                    { number: reciever_number },
                    {
                        $pull: {
                            offline_notifications: { type: 'delete-message', 'body.uid': uid },
                        },
                    }
                );
            });

            socket.on('client-call', (payload) => {
                io.to(payload.reciever_number).emit('client-call', payload);
            });

            socket.on('client-call-answer', (payload) => {
                io.to(payload.reciever_number).emit('client-call-answer', payload);
            });

            socket.on('candidate', (payload) => {
                io.to(payload.reciever_number).emit('candidate', payload);
            });

            socket.on('call-ended', (payload) => {
                io.to(payload.reciever_number).emit('call-ended', payload);
            });

            socket.on('call-rejected', (payload) => {
                io.to(payload.reciever_number).emit('call-rejected', payload);
            });

            socket.on('poke', ({ sender_number, reciever_number }) => {
                io.to(reciever_number).emit('poke', sender_number);
            });

            socket.on('typing', ({ sender_number, reciever_number }) => {
                io.to(reciever_number).emit('typing', sender_number);
            });

            socket.on('typing-stopped', ({ sender_number, reciever_number }) => {
                io.to(reciever_number).emit('typing-stopped', sender_number);
            });

            socket.on('update-profile-image', async ({ buffer, token, sender_number }, response) => {
                // check the buffer and image size
                const allowedImageTypes = ['png', 'jpg', 'jpeg'];
                if (!Buffer.isBuffer(buffer)) throw new Error('Invalid Buffer');

                const mimeType = await fromBuffer(buffer);

                if (!mimeType || !allowedImageTypes.includes(mimeType.ext)) {
                    throw new Error('Invalid File Type');
                }

                // write to disk
                const link = sender_number + '.' + mimeType.ext;
                await fs.promises.writeFile('./profile_images/' + link, buffer);

                // update the database
                await User.findOneAndUpdate({ number: sender_number }, { profile_photo: link });

                // update users object
                if (user[sender_number]) {
                    users[sender_number].profile_photo = link;
                    users[sender_number].subscribers.forEach((sub) => {
                        io.to(sub).emit('user-update-profile-img', { link, sender_number });
                    });
                }

                response({
                    status: 'ok',
                });
                // send to all subscribers  user-update-profile-img => image-link user_number
            });

            socket.on('update-profile-bio', async ({ bio, token, sender_number }) => {
                // update the database
                await User.findOneAndUpdate({ number: sender_number }, { bio });
                // update users object
                if (user[sender_number]) {
                    users[sender_number].bio = bio;
                    users[sender_number].subscribers.forEach((sub) => {
                        io.to(sub).emit('user-update-profile-bio', { bio, sender_number });
                    });
                }
            });

            socket.on('disconnect', async () => {
                await User.findByIdAndUpdate(user._id, { is_active: false });
                users[user.number].status = new Date().toJSON();
                const subscribers = users[user.number].subscribers;
                subscribers.forEach((sub) => {
                    io.to(sub).emit('user-status-changed', {
                        sender_number: user.number,
                        status: new Date().toJSON(),
                    });
                });
            });
        } catch (err) {
            const errorObject = {};

            if (
                err instanceof jwt.JsonWebTokenError ||
                err instanceof jwt.NotBeforeError ||
                err instanceof jwt.TokenExpiredError
            ) {
                console.log('بيانات المستخدم غير صحيحة');
                errorObject.type = 'register';
                errorObject.message = 'بيانات المستخدم غير صحيحة';
            }

            socket.emit('USER_REGISTER_FAIL', errorObject);
            console.log('here', err);
        }
    };
};
