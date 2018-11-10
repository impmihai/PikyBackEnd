const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  cors = require('cors');
const mongoose = require('mongoose');
const util = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {User} = require('./dbmodels.js'); // User Model
const {register, login} = require('./authentication/AuthController.js');
const {addFavorites, removeFavorites, allFavorites} = require('./favorites/favorites.js');

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PikyFavorites');

let app = express();
app.use(cors()); // Necessary for front-end(post, get)
app.use(bodyParser.json());

let Bing = require('node-bing-api')({accKey: "85bd0f27d7cd48758a2f51e93b308f7b"});
/* 
 * Simple post method for the images
 */
app.post('/images', (request, response) => {
	console.log(request.body);
	let query = request.body.query;
	Bing.images(query, (err, res, body) => {
			let urls = [];
			let size = body.value.length;
			for (let i = 0; i < size; i++) {
				urls.push(body.value[i].contentUrl);
			}
			response.send({
				url: urls
			});
		},
		{	
			count: 1,
			adult: 'Moderate'
		}
	);
});

/* 
 *Get method for the feed pictures 
 */
app.get('/jessica', (request, response) => {
	console.log("got get on jessica");
	let query = "donate blood";
	Bing.images(query, (err, res, body) => {
			let urls = [];
			let size = body.value.length;
			for (let i = 0; i < size; i++) {
				urls.push(body.value[i].contentUrl);
			}
			response.send({
				url: urls
			});
		},
		{
			count: 1,
			adult: 'Moderate' //Moderate filtered
		}
	);
});
/*
 * Endpoints
 */

app.post('/register', register);
app.post('/login', login);
app.post('/addFavorites', addFavorites);
app.post('/removeFavorites', removeFavorites);
app.get('/allFavorites', allFavorites);


app.listen(port, () => {
	console.log('Trimiteti fratii mei pe portul 3000');
});
