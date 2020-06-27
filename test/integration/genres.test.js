const request = require('supertest');
const {Genre} = require('../../model/genre');
const {User} = require('../../model/user');
const mongoose = require('mongoose')

let server;

describe('/api/genres', () => {
    beforeEach(() => {server = require('../../index'); })
    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'}
            ])
            
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
            
        });
    });
    describe('GET /:id',()=> {
        it('should return the genre of requested id ',async () => {
            const genre = new Genre({ name: 'genre1'});
            await genre.save();
            const res = await request(server).get('/api/genres/'+genre._id);
            expect(res.status).toBe(200);
            expect(res.body.name === 'genre1').toBeTruthy();
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404  of invalid_id is passed ',async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
            
        });
        it('should return 404  if no genre with given id exists ',async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/'+id);
            expect(res.status).toBe(404);
            
        });
    });
    describe('POST /', () => {
        let token;
        let name;
        const exec = async () => {
            return await  request(server)
              .post('/api/genres')
              .set('x-auth-token', token)
              .send({ name});
        }
        beforeEach ( ()=> {
            token = new User().generateAuthToken();
            name = 'genre1'
        })
        it('should return 401 if client is not logged in ', async () => {
            token = ''
            const res = await  exec();
           expect(res.status).toBe(401);            
        });
        it('should return 400 if genre is less than 5 characters ', async () => {
            name='1234'
            const res = await  exec();
            expect(res.status).toBe(400);            
          });
          it('should return 400 if genre is more than 50 characters ', async () => {
            name = new Array(52).join('a');
            const res = await  exec();
             expect(res.status).toBe(400);            
          });

          it('should save the genre if it is valid ', async () => {
            const res = await exec();
            const genre = await Genre.find({ name: 'genre1'});
             expect(genre).not.toBeNull();            
          });
          it('should return the genre if it is valid ', async () => {
             const res = await  exec();
             expect(res.body).toHaveProperty('_id');
             expect(res.body).toHaveProperty('name', 'genre1');           
          });
    });
    describe('PUT /:id', () => {
        let token;
        let id ;
        let newName;
        let genre;
        const exec = async () => {
            return await  request(server)
              .put('/api/genres/'+id)
              .set('x-auth-token', token)
              .send({ name: newName});
        }
        beforeEach ( async ()=> {
            const user = { _id:mongoose.Types.ObjectId().toHexString() , 
                isAdmin:true}
            token = new User(user).generateAuthToken();
            genre = new Genre({ name: 'genre1'});
            await genre.save();
            id = genre._id;
            newName = 'updateName';
        })

        it('should return 401 if client is not logged in ', async () => {
            token = ''
            const res = await  exec();
            expect(res.status).toBe(401);            
        });
        it('should return 403 if user is not admin ', async () => {
            token = new User({isAdmin: false}).generateAuthToken()
            const res = await  exec();
            expect(res.status).toBe(403);            
        });
        it('should return 400 if genre is less than 5 characters ', async () => {
            newName='1234'
            const res = await  exec();
            expect(res.status).toBe(400);            
        });
        it('should return 400 if genre is more than 50 characters ', async () => {
            newName = new Array(52).join('a');
            const res = await  exec();
            expect(res.status).toBe(400);            
        });
        it('should return 404 if id is not found ', async () => {
            id = mongoose.Types.ObjectId().toHexString();
            const res = await  exec();
            expect(res.status).toBe(404);            
        });
        it('should return 404 if id is invalid ', async () => {
            id = 1;
            const res = await  exec();
            expect(res.status).toBe(404);            
        });
        it('should update genre if input is valid ', async () => {
            await  exec();
            const updateGenre = await Genre.findById(genre._id);
            expect(updateGenre.name).toBe(newName);            
        });
        it('should return the updated genre if it is valid', async () => {
            const res = await  exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);            
        });
    });
    describe('DELETE /:id',() =>{
        let token;
        let id ;
        let genre;
        const exec = async()=> {
            return await  request(server)
              .delete('/api/genres/'+id)
              .set('x-auth-token', token)
              .send();
        }
        beforeEach ( async ()=> {
            token = new User({isAdmin: true}).generateAuthToken();
            genre = new Genre({ name: 'genre1'});
            await genre.save();
            id = genre._id;
        });
        it('should return 401 if client is not logged in ', async () => {
            token = ''
            const res = await  exec();
            expect(res.status).toBe(401);            
        });
        it('should return 403 if user is not admin ', async () => {
            token = new User({isAdmin: false}).generateAuthToken()
            const res = await  exec();
            expect(res.status).toBe(403);            
        });
        it('should return 404 if id is invalid ', async () => {
            id = 1;
            const res = await  exec();
            expect(res.status).toBe(404);            
        });
        it('should return 404 if id is not found ', async () => {
            id = mongoose.Types.ObjectId().toHexString();
            const res = await  exec();
            expect(res.status).toBe(404);            
        });
        it('should delete genre if id is valid ', async () => {
            await  exec();
            const genreId = await Genre.findById(id);
            expect(genreId).toBeNull();            
        });
        it('should delete genre if id is valid ', async () => {
            const res = await  exec();
            expect(res.body).toHaveProperty('_id',genre._id.toHexString());
            expect(res.body).toHaveProperty('name',genre.name);            
        });
    });
});