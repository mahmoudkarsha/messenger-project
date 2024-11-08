const User = require('../../database/models/users');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../errHandler/appError');

function catchAsync(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
}

exports.register = catchAsync(async (req, res, next) => {
    const {
        user_name,
        number,
        first_name,
        middle_name,
        last_name,
        phone_number,
        gender,
        password,
        password_confirm,
        state,
        city,
        center,
    } = req.body;
    const hash = password;
    const newUser = await User.create({
        user_name,
        number,
        first_name,
        middle_name,
        last_name,
        phone_number,
        gender,
        hash,
        state,
        city,
        center,
    });

    return res.status(201).json({
        status: 'success',
        user: newUser,
    });
});

exports.login = catchAsync(async function (req, res, next) {
    const { number, password, sessionId } = req.body;
    console.log(number, password);
    let user = await User.findOne({ number });

    if (!user || user.hash !== password) return next(new AppError('خطأ في اسم المستخدم أو كلمة المرور', 404));

    if (user.session_id && user.session_id !== sessionId) {
        return res.status(403).json({
            status: 'fail',
            message: 'user already logged in',
        });
    }

    await User.findOneAndUpdate({ number }, { session_id: sessionId });

    const token = jwt.sign({ user_number: user.number }, process.env.SECRET, {
        expiresIn: '3000d',
    });

    return res.status(200).json({
        status: 'success',
        result: { token, user_number: user.number, role: user.role },
    });
});

exports.protectAdminOnly = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('أنت غير مسجل للدخول ', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    const user = await User.findOne({ number: decoded.user_number });
    if (!user) {
        return next(new AppError('User have been removed recently', 401));
    }

    if (user.role !== 'superadmin') {
        return next(new AppError('Access Denied', 401));
    }

    req.user = user;
    next();
});

exports.ensureToken = catchAsync(async (req, res, next) => {
    let { token } = req.body;
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    const freshUser = await User.findOne({ number: decoded.user_number });
    if (!freshUser) {
        return next(new AppError('User have been removed recently', 401));
    }
    return res.status(200).json({
        status: 'success',
        user: req.body,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('أنت غير مسجل للدخول ', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    const user = await User.findOne({ number: decoded.user_number });
    if (!user) {
        return next(new AppError('User have been removed recently', 401));
    }
    req.user = user;
    next();
});

exports.restricted = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('أنت غير مسجل للدخول ', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    const user = await User.findOne({ number: decoded.user_number });
    if (!user) {
        return next(new AppError('User have been removed recently', 401));
    }
    if (!user.can_create_groups) {
        return next(new AppError('Not permitted', 403));
    }
    req.user = user;
    next();
});
