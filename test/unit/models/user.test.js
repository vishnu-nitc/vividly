

const { User } = require("../../../model/user");
const config = require('config');
const jwt  = require("jsonwebtoken");
const mongoose = require('mongoose');
//const { delete } = require("../../../routes/auth");

describe('user.generateAuthToken',() => {
    it('should return valid JWT',() => {
        const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin:true}
        const user = new User( payload);
        //console.log(user);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        //console.log(decoded);
        //delete decoded.iat;
        //console.log(decoded);
        expect(decoded).toMatchObject(payload);
    });
});