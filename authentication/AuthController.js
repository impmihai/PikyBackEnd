const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config');
const {User} = require('../dbmodels.js');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Users');

module.exports = (req, res) => {
  
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    let user = new User({
        email : req.body.email,
        password : hashedPassword
    });
    user.save().then((doc) => {
        /* Creating a token*/
        let token = jwt.sign({ id: doc._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    }, (e) => {
        res.status(500).send("There was a problem registering the user.");
    }); 
};