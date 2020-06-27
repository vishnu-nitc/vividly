const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/log');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);




//throw new Error('Something failed on startup');
//const p = Promise.reject(new Error('Something Failed Miserbaly!'));
//p.then(() => console.log('done'));

port = process.env.PORT || 3000;

const server =app.listen(port, () => winston.info(`Listening to ${port}`));

module.exports = server;