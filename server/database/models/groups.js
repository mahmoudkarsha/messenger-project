const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
    {
        creator: { type: String, ref: 'User' },
        owners: [{ type: String, ref: 'User' }],
        group_name: String,
        members: [{ type: String, ref: 'User' }],
        is_channel: Boolean,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Group', groupSchema);
