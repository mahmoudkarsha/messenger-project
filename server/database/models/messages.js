const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        reciever_number: String,
        sender_number: String,
        type: String,
        size: Number,
        text: String,
        is_group: Boolean,
        group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
        uid: String,
        message_id: String,
        send_date: Date,
        file_name: String,
        file_id: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Message', messageSchema);
