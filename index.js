
const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const mongoose = require('mongoose');
const auth = require('./routes/auth')
const config = require('config');

if ( !config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtkey is not defined ');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vividly')
    .then(() => console.log('Connected to mongoose'))
    .catch((err) => console.error('Could not connect to mongoose',err));

const app = express();


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);

port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to ${port}`));