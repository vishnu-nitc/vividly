const Joi  = require('joi');
const mongoose = require('mongoose');
const genreSchema = new mongoose.Schema({
    //id: Number,
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = new mongoose.model('Genre',genreSchema);


function validateGenres(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return result = Joi.validate(genre, schema);

}


exports.Genre = Genre;
exports.validate = validateGenres;
exports.genreSchema = genreSchema;