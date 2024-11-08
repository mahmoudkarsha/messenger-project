const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        file_name: String,
        type: String,
        extentions: String,
        size: Number,
        owners: [String],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('File', fileSchema);
