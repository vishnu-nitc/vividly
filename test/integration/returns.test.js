const {Rental} = require('../../model/rental');
const {Movie} = require('../../model/movie');
const {User} = require('../../model/user')
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');


let server ;
describe('/api/returns/', () => {
    
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;
    beforeEach( async() => {
        server = require('../../index'); 
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345'},
            numberInStock: 10
        });
        await movie.save();
        rental = new Rental( {                //populating the data
            customer: {
                _id : customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }

        }) ; 
        await rental.save()  
    });
    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });
    const exec = () =>{
        return  request(server)
                    .post('/api/returns')
                    .set('x-auth-token',token)
                    .send({ customerId, movieId})
    }
    
    it ('Return 401 eroor if client is not logged in' , async() => {
        token= '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it ('Return 400 eroor if customer id is not provided' , async() => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it ('Return 400 eroor if movie id is not provided' , async() => {
        movieId= '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it ('Return 404 eroor if no rental for given customerid or movieid  is not found' , async() => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it ('Return 400 eroor if rental is already processed' , async() => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it ('Return 200 eroor if valid request is made' , async() => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it ('should set the return date if input is valid' , async() => {
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10* 1000);
    });
    it ('should calculate the rantal fee if input is valid' , async() => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });
    it ('should increase the movie stock if input is valid' , async() => {
        const res = await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(11);
    });
    it ('should return the rental if input is valid' , async() => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','movie'])
        )
    });
});