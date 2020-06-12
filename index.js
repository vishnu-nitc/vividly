
const express = require('express');
//const Joi = require('joi');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vividly')
    .then(() => console.log('Connected to mongoose'))
    .catch((err) => console.error('Could not connect to mongoose',err));

const app = express();


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customer', customers);


port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to ${port}`));