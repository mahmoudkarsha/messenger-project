const AppError = require('../errHandler/appError');
const User = require('../../database/models/users');

exports.checkContact = catchAsync(async (req, res, next) => {
    const { number } = req.query;
    const contact = await User.findOne({ number });
    if (!contact) return next(new AppError('جهة الاتصال هذه غير موجودة', 404));

    res.json({
        status: 'success',
        exist: true,
    });
});

exports.usersList = catchAsync(async (req, res, next) => {
    //chech admin
    const users = await User.aggregate([
        {
            $project: {
                user_name: 1,
                number: 1,
            },
        },
    ]).exec();
    return res.status(200).json({
        status: 'success',
        result: users,
    });
});

exports.getUsersStatus = catchAsync(async (req, res, next) => {
    const offlineUsers = await User.find({ is_active: false });
    const activeUsers = await User.find({
        is_active: true,
    });

    const registeredUsers = await User.find({
        session_id: { $ne: null },
    });

    const notRegisteredUsers = await User.find({
        session_id: null,
    });

    res.json({
        status: 'success',
        activeUsers,
        offlineUsers,
        registeredUsers,
        notRegisteredUsers,
    });
});

exports.closeAllUsers = catchAsync(async (req, res, next) => {
    req.io.emit('close');
    res.json({ status: 'ok' });
});

function catchAsync(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
}
