const express = require('express');
const {Rental, validate} = require('../model/rental');
const {Customer} = require('../model/customer');
const {Movie} = require('../model/movie');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = express.Router();
const auth = require('../middleware/auth');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut').lean();
    res.send(rentals);
});

router.post('/', auth, async(req, res) => {
    const { error } = validate(req.body);
    if ( error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if ( !movie ) return res.status(400).send('Movie not existed');

    const customer = await Customer.findById(req.body.customerId);
    if ( !customer ) return res.status(400).send('Customer not existed');

    if (movie.numberInStock === 0) return res.status(400).send('Movie notin stock');

    let rental = new Rental({
        customer: {
            _id:customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id:movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id},{
                $inc: { numberInStock: -1 }
            })
            .run();
    res.send(rental);

    } catch (ex) {
        res.status(500).send('Somethig failed');
    }
    


});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id).lean();
    if (!rental) return res.status(404).send("Invalid rental id");
    res.send(rental);
});

module.exports = router;