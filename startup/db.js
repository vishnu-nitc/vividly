const mongoose = require('mongoose');
const wiston = require('winston');
module.exports = function () {
    mongoose.connect('mongodb://localhost/vividly')
    .then(() => wiston.info('Connected to mongoose'));
}