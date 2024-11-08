const mongoose = require('mongoose');

const offlineNotificationsSchema = new mongoose.Schema({
    send_date: Date,
    type: String,
    body: Object,
});

const offlineReadMessages = new mongoose.Schema({
    uid: String,
    read_date: Date,
});
const offlineMessageSchema = new mongoose.Schema({
    uid: String,
    send_date: Date,
    type: String,
    text: String,
    file_name: String,
    size: Number,
    reciever_number: { type: String, ref: 'User' },
    sender_number: { type: String, ref: 'User' },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    is_group: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        user_name: { type: String, index: true },
        role: { type: String, default: 'user' },
        session_id: { type: String, defualt: undefined },
        number: { type: String, unique: true },
        upload_size: { type: Number, default: 0 },
        max_upload_size: { type: Number, default: 0 },
        first_name: { type: String },
        middle_name: { type: String },
        last_name: { type: String },
        phone_number: { type: String },
        gender: { type: String, enum: ['male', 'female'] },
        hash: { type: String },
        state: { type: String },
        city: { type: String },
        center: { type: String },
        is_banned: { type: Boolean, default: false },
        banned_contacts: [String],
        is_available: { type: Boolean, default: true },
        is_active: { type: Boolean, default: false },
        last_active: { type: Date, default: Date.now },
        profile_photo: { type: String },

        offline_inbox: [offlineMessageSchema],
        require_recieved_acknow: [{ uid: String, recieve_date: Date }],

        offline_read_messages: [offlineReadMessages],
        require_read_acknow: [{ uid: String, read_date: Date }],

        offline_notifications: [offlineNotificationsSchema],

        //
        //
        can_create_groups: { type: Boolean, default: false },
        groups: [
            {
                group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
                role: { type: String, enum: ['admin', 'partner'] },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
