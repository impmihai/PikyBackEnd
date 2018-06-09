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
        return res.status(401).send("No token provided.");
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            return res.status(500).send("Failed to authenticate token.");
        User.findById(decoded.id).then((user) => {
            existingFav = user.favorites.filter(favs => favs.url === req.body.url);
            if (existingFav.length) {
                return res.status(400).send("Already favorited.");
            } else {
                let new_url = {url: req.body.url};
                User.findByIdAndUpdate(decoded.id, {
                    $push: {
                        favorites: new_url
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
            }
        });
    });
};


let allFavorites = (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) 
        return res.status(401).send("No token provided.");
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            return res.status(500).send("Failed to authenticate token.");
        User.findById(decoded.id)
        .then((result) => {
            if (!result) 
                return res.status(400).send("Couldn't find favorites.");
            res.status(200).send(result.favorites);
        }, (e) => {
            res.status(500).send("There was a problem finding the user.");
        });
    });
};


let removeFavorites = (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) 
        return res.status(401).send("No token provided.");
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            return res.status(500).send("Failed to authenticate token.");
        let new_url = {url: req.body.url};
        User.findByIdAndUpdate(decoded.id, {
            $pull: {
                favorites: new_url
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            if (!result) 
                return res.status(400).send("Couldn't unfavorite.");
            res.status(200).send("Picture unfavorited");
        }, (e) => {
            res.status(500).send("There was a problem finding the user.");
        });
        
    });
};

module.exports = {
    addFavorites: addFavorites,
    removeFavorites: removeFavorites,
    allFavorites: allFavorites
}

