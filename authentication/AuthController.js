const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config');
const {User} = require('../dbmodels.js');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PikyFavorites');

/* 
 * Register a user
 */
let register = (req, res) => {
  
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    let query = User.findOne({ 'email': req.body.email}).then((user) => {
        if (user) {
            return res.status(400).send("User already registered");
        } else {
            let user = new User({
                email : req.body.email,
                password : hashedPassword
            });
            user.save().then((doc) => {
                /* Creating a token */
                let token = jwt.sign({ id: doc._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                /* Send back a token */
                res.status(200).send({ auth: true, token: token });
            }, (e) => {
                return res.status(500).send("There was a problem registering the user.");
            }); 
        }
    }, (e) => {
        return res.status(500).send("Database error");
    });
};

/* 
 * Login a user 
 */
let login = (req, res) => {
    /*Look for the user in the database */
    User.findOne({email: req.body.email}).then((user) => {
        if (!user) 
            return res.status(404).send('No user found.');
        let isPassValid = bcrypt.compareSync(req.body.password, user.password);
        if (!isPassValid) 
            return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    }, (e) => {
        res.status(500).send('Error on the server.');
    });
};

module.exports = {
    register: register,
    login: login
}