const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  cors = require('cors');
const mongoose = require('mongoose');
const util = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {User} = require('./dbmodels.js');
const {register, login} = require('./authentication/AuthController.js');
const {addFavorites, removeFavorites, allFavorites} = require('./favorites/favorites.js');

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PikyFavorites');

let app = express();
app.use(cors());
app.use(bodyParser.json());

let Bing = require('node-bing-api')({accKey: "001a918c0dc345938b9ca76c2ab97574"});

/* 
 * Simple post method for the images
 */
app.post('/images', (request, response) => {

	let query = request.body.query;
	Bing.images(query, (err, res, body) => {
			response.send({
				url: body.value[0].contentUrl
			});
		},
		{
			count: 1,
			adult: 'Moderate'
		}
	);
});

app.get('/jessica', (request, response) => {

	let query = "Jessica Nigri";
	Bing.images("Jessica Nigri", (err, res, body) => {
			let urls = [];
			let size = 0;
			if (body.value.length > 10) {
				size = 10;
			} else {
				size = body.value.length;
			}
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
/* Rute */

app.post('/register', register);
app.post('/login', login);
app.post('/addFavorites', addFavorites);
app.post('/removeFavorites', removeFavorites);
app.get('/allFavorites', allFavorites);


app.listen(port, () => {
	console.log('Trimiteti fratii mei pe portul 3000');
});