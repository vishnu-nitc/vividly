const Joi  = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            isGold: { type:Boolean,
                       default: false },
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        
        }),
        required: true
    },
    movie : {
        type : new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 50
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                minlength: 0,
                maxlength: 255
            }
            
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        minlength: 0
    }
});
rentalSchema.statics.lookup = function(customerId,movieId){
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}
rentalSchema.methods.return = function(){
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days')
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(rental, schema);
}
exports.Rental = Rental;
exports.validate = validateRental;