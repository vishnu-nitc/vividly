const {Customer, validate} = require('../model/customer');
const express = require('express');
const Joi  = require('joi');
const mongoose = require('mongoose');
const router = express.Router();




router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name').lean();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id).lean();
    if (!customer) return res.status(404).send("requested id is notpresent");
    res.send(customer); 
});

router.post('/', async (req, res) => {
   const { error } = validate(req.body);
   if ( error ) return res.status(400).send(error.details[0].message);
   let customer = new Customer ( { name: req.body.name,
                                   phone: req.body.phone, 
                                   isGold: req.body.isGold});
   customer = await customer.save();
   res.send(customer);
});
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if ( error) return res.status(400).send(error.details[0].message);
    const customer =await Customer.findByIdAndUpdate(req.params.id, 
        { name: req.body.name, 
          phone: req.body.phone, 
          isGold: req.body.isGold
        },{ new: true});
    if ( !customer) return res.status(404).send("requested id is not present");
    res.send(customer);
} );

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if ( !customer) return res.status(404).send("requested id is not present");
    res.send(customer);
    
});



module.exports = router;
