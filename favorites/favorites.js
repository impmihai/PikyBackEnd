const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ObjectID = require('mongodb');

const config = require('../config');
const {User} = require('../dbmodels.js');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PikyFavorites');

/*
 * Add a new favorite in the favorites field in User
 */
let addFavorites = (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) 
        return res.status(401).send("No token provided.");
    /* Verify if the token received is correct */
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            return res.status(500).send("Failed to authenticate token.");
        /* Verify if the picture is already in favorites */
        User.findById(decoded.id).then((user) => {
            existingFav = user.favorites.filter(favs => favs.url === req.body.url);
            if (existingFav.length) {
                return res.status(400).send("Already favorited.");
            } else {
                /* Create a image object in store it in user */
                let new_url = {url: req.body.url};
                User.findByIdAndUpdate(decoded.id, {
                    $push: {            //Updating DB
                        favorites: new_url
                    }
                }, {
                    returnOriginal: false   //Return updated document instead of the original one
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

/*
 * Method that returns all the images that
 * the user favorited
 */

let allFavorites = (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) 
        return res.status(401).send("No token provided.");
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            return res.status(500).send("Failed to authenticate token.");
        /* Return the favorites of the user that sent th request*/
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

/*
 * Method that removes a specific favorites from the user
 */
let removeFavorites = (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) 
        return res.status(401).send("No token provided.");
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            return res.status(500).send("Failed to authenticate token.");
        /* Search for the specific favorite, if it's found, remove it */
        let new_url = {url: req.body.url};
        User.findByIdAndUpdate(decoded.id, {
            $pull: {                //Updating DB
                favorites: new_url
            }
        }, {
            returnOriginal: false   //Return updated document instead of the original one
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

