const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  cors = require('cors');
const mongoose = require('mongoose');


const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/UsersDB');

let app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/test', (req, res) => {
	res.send('it works');
});


app.listen(port, () => {
	console.log('Trimiteti fratii mei pe portul 3000');
});