const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ObjectID = require('mongodb');

const config = require('../config');
const {User} = require('../dbmodels.js');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PikyFavorites');

let addFavorites = (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) 
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        User.findByIdAndUpdate(decoded.id, {
            $push: {
                favorites: req.body.url
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            if (!result) 
                return res.status(400).send("Couldn't update favorites.");
            res.status(200).send("Favorites updated");
        }, (e) => {
            res.status(500).send("There was a problem finding the user.");
        });
    });
};

module.exports = {
    favorites: addFavorites
}

