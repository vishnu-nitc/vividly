const mongoose = require('mongoose');
const wiston = require('winston');
const config = require('config');
module.exports = function () {
    const db =config.get('db');
    mongoose.connect(db)
    .then(() => wiston.info(`Connected to ${db}...`));
}