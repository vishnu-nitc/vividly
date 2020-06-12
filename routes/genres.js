const {Genre, validate} = require('../model/genre');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');







//if (id.match(/^[0-9a-fA-F]{24}$/)) { --- take care about this
    // Yes, it's a valid ObjectId, proceed with `findById` call.
 // }

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name').lean();
    res.send(genres);
});

router.get('/:id', async(req, res) => {
    const genre = await Genre.findById(req.params.id);
    if ( !genre) return res.status(404).send("requested id is not present");
    res.send(genre);
} )

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if ( error) return res.status(400).send(error.details[0].message);
    let genre = new Genre ({name: req.body.name});
    genre = await genre.save();
    res.send(genre);

})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if ( error) return res.status(400).send(error.details[0].message);
    const genre =await Genre.findByIdAndUpdate(req.params.id, 
        { name: req.body.name}, { new: true})
    if ( !genre) return res.status(404).send("requested id is not present");
    res.send(genre);
} )

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if ( !genre) return res.status(404).send("requested id is not present");
    res.send(genre);
    
})


module.exports = router;