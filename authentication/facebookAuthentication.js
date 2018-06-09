const passport = require('passport-facebook');

passport.use(new FacebookStrategy({
    clientID: 380718762332360,
    clientSecret: d9672f97daf98c3bebd64e949c260363,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));