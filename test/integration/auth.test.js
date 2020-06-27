

const request = require('supertest');
const {User} = require('../../model/user');
const { Genre } = require('../../model/genre');
let server;
describe('auth middleware', () => {
    beforeEach(() => {server = require('../../index'); })
    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    });
    let token;
    const exec =  () => {
        return  request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1'});

    }
    beforeEach(()=> {
        token = new User().generateAuthToken();
    })
    it ('shoud return 401 if no token is provided', async () => {
        token = ''
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it ('shoud return 400 if no token is invalid', async () => {
        token = 'a'
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it ('shoud return 200 if no token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});