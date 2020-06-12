const Joi  = require('joi');
const mongoose = require('mongoose');

const Customer = new mongoose.model('Customer', new mongoose.Schema({
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

}));

function validateCustomer(customer){
    const schema = {
        name: Joi.string().required().min(5).max(50),
        phone: Joi.string().required().min(4).max(50),
        isGold: Joi.boolean()
    }
    //console.log('validation done');
    return Joi.validate(customer, schema);
}


exports.Customer = Customer;
exports.validate = validateCustomer;