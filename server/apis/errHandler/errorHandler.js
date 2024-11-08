const AppError = require('./appError');

exports.errorHandler = (err, req, res, next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.MODE === 'dev') {
        developmentMode(err, res);
    } else {
        if (err.code === 11000) err = handleDuplicatedErrors(err);
        if (err.type === 'entity.parse.failed') err = handleReqBody();
        if (err.code === 'credentials_required') err = handleJWT(err);
        if (err.name === 'JsonWebTokenError') err = handleInvalidToken(err);
        if (err.name === 'TokenExpiredError') err = handleExpiredToken(err);
        if (err.name === 'NotBeforeError') err = handleExpiredToken(err);

        productionMode(err, res);
    }
};

//////////////////////////////////'

function developmentMode(err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
    });
}

function productionMode(err, res) {
    if (err.isOperetional) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            errors: 'Something went wrong',
        });
    }
}

//============> database erroes
function handleDuplicatedErrors(err) {
    const value = err.message
        .match(/(["'])(\\?.)*?\1/)[0]
        .split('"')
        .join('');
    const message = 'موجود بالفعل  ' + value;
    return new AppError(message, 400);
}

//===============> Jwt Errors
function handleJWT(err) {
    const message = `انت غير مسجل للدخول`;
    return new AppError(message, 401);
}
function handleInvalidToken(err) {
    const message = `خطأ في البيانات`;
    return new AppError(message, 401);
}
function handleExpiredToken(err) {
    const message = `انتهت الجلسة أعد تسجيل الدخول `;
    return new AppError(message, 401);
}

//===============> body errors
function handleReqBody() {
    const message = `خطأ في ارسال البيانات`;
    return new AppError(message, 400);
}
