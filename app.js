const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  cors = require('cors');
const mongoose = require('mongoose');
const util = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {User} = require('./dbmodels.js');
const AuthController = require('./authentication/AuthController.js');

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

app.post('/users', AuthController);


app.listen(port, () => {
	console.log('Trimiteti fratii mei pe portul 3000');
});