const User = require('../../database/models/users');
const File = require('../../database/models/files');
const Group = require('../../database/models/groups');
const Message = require('../../database/models/messages');

const {
    invalidExtention,
    senderNotFound,
    bannedUsr,
    invalidBuffer,
    bigSizeError,
    recieverNotFound,
} = require('./errorMessages');
module.exports = async function (payload, io) {
    try {
        let {
            // token,
            body,
            is_group,
            uid,
            sender_number,
            reciever_number,
            type,
            file_name,
            text,
            size,
            group_id,
            file_id,
            is_file,
        } = payload;

        const senderUsr = await User.findOne({ number: sender_number });
        if (!senderUsr) throw new Error(senderNotFound);

        let group = {};
        if (is_group) {
            group = await Group.findById(group_id);
        } else {
            const recieverUsr = await User.findOne({ number: reciever_number });
            if (!recieverUsr) throw new Error(recieverNotFound);
            if (Array.isArray(recieverUsr.banned_contacts) && recieverUsr.banned_contacts.includes(sender_number))
                throw new Error(bannedUsr);
        }

        if (is_file && file_id) {
            await File.findByIdAndUpdate(file_id, {
                owners: is_group ? group.members : [sender_number, reciever_number],
            });
        }

        const send_date = Date.now();

        const message = {
            sender_number,
            type,
            size,
            text,
            uid,
            send_date,
            file_name,
            file_id,
        };

        const toSender = { uid, file_id, send_date };
        io.to(sender_number).emit('server-recieved-message', toSender);

        if (is_group) {
            message.group_id = group_id;
            message.is_group = true;

            group.members
                .filter((num) => num != sender_number)
                .forEach(async (number) => {
                    await User.findOneAndUpdate(
                        { number },
                        {
                            $push: {
                                offline_inbox: message,
                            },
                        }
                    );

                    io.to(number).emit('message-from-server', {
                        ...message,
                        reciever_number: number,
                    });
                });
        } else {
            message.reciever_number = reciever_number;
            await User.findOneAndUpdate(
                { number: reciever_number },
                {
                    $push: {
                        offline_inbox: message,
                    },
                }
            );

            await Message.create(message);

            const toReciever = message;
            io.to(reciever_number).emit('message-from-server', toReciever);
        }
    } catch (err) {
        console.log(err);
    }
};

/* 
rar
52 61 72 21 1A 07 00 
52 61 72 21 1A 07 01 00

png
89 50 4e 47 0d 0a 1a 0a 

jpg
ff d8 ff e0

zip
50 4b 03 04

pdf 
25 50 44 46

.doc word
D0 CF 11 E0 A1 B1 1A E1

excel .xls
D0 CF 11 E0 A1 B1 1A E1


*/
