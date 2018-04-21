let mongoose = require('mongoose');

/* 
 * Model for the object that will be inserted
 * in the database
 */
let User = mongoose.model('User', {

    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
	favorites: []
});

module.exports = {User};