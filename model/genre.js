const Joi  = require('joi');
const mongoose = require('mongoose');

const Genre = new mongoose.model('Genre',new mongoose.Schema({
    //id: Number,
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));


function validateGenres(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return result = Joi.validate(genre, schema);

}


exports.Genre = Genre;
exports.validate = validateGenres;