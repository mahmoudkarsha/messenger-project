const mongoose = require('mongoose');

module.exports = mongoose
    .connect('mongodb://127.0.0.1:27017/messenger')
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err));
