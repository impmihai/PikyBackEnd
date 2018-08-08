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
    favorites: [{
        url: {
            type: String,
            minlength: 1,
            trim: true
        }
    }]
    /* TO DO: add to user model
     *  uploadedPictures[]:pictureId
     *  likedPhothos[]:picutureId
     *  commentedOn[]:pictureId
     */
});

/* TO DO: add new model for image
 * likes[]:userId
 * comments[]:{string,userId}
 * url/data - string / grid fs
 */

module.exports = {User};
