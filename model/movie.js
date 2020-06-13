const Joi  = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre')



const Movie = new mongoose.model('Movies', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255
    }
    
}));

function validateMovie(movie){
    const schema = {
        title : Joi.string().min(5).max(50).required(),
        genreId : Joi.objectId().required(), // client need to send id of genre , but mongoose has genre.becuase model is embedding genre 
        numberInStock : Joi.number().min(0).required(),
        dailyRentalRate : Joi.number().min(0).required()
    };
    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;