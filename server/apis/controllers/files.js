const File = require('../../database/models/files');
const User = require('../../database/models/users');
const allowedTypes = require('../../sockets/Functions/allowedTypes');
const fs = require('fs');
const { fromBuffer } = require('file-type-cjs');

exports.getFile = catchAsync(async (req, res, next) => {
    const number = req.user.number;
    const fileId = req.params.id;

    const fileInDataBase = await File.findById(fileId);
    if (!fileInDataBase) throw new Error();

    const isOwner = fileInDataBase.owners.includes(number);
    if (!isOwner) throw new Error();

    const extention = fileInDataBase.extentions;
    res.download('./uploads/' + fileId + '.' + extention);
});

exports.getProfileImage = async (req, res, next) => {
    const number = req.params.number;
    const user = await User.findOne({ number });
    const file = user?.profile_photo;
    if (!file) {
        res.download('./profile_images/' + 'default.png');
        return;
    }
    res.download('./profile_images/' + file);
};

function catchAsync(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
}

exports.uploadFile = catchAsync(async (req, res, next) => {
    const file = req.file;
    if (!file) throw new Error('');
    const { buffer, originalname } = file;

    if (!Buffer.isBuffer(buffer)) throw new Error(invalidBuffer);
    const mimeType = await fromBuffer(buffer.slice(0, 200));
    if (!mimeType || !allowedTypes(mimeType.ext)) throw new Error('');

    const type = mimeType.mime;
    const size = buffer.length;

    if (size > 200 * 1024 * 1024 * 10) throw new Error('');

    const storedFile = await File.create({
        owners: [],
        extentions: mimeType.ext,
        file_name: originalname,
        type,
        size,
    });

    await fs.promises.writeFile('./uploads/' + storedFile._id + '.' + mimeType.ext, buffer);

    res.json({
        status: 'ok',
        fileId: storedFile._id,
        size,
        type,
    });
});
