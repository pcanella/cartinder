'use strict';


var RegisterwithfbModel = require('../../models/registerWithFB');


module.exports = function(router) {

    var model = new RegisterwithfbModel();

    var passport = require('passport'),
        FacebookStrategy = require('passport-facebook').Strategy;
    passport.initialize();

    passport.use(new FacebookStrategy({
            clientID: '676992922389202',
            clientSecret: 'e89737971dd2dd7b3aece95cac11a2ba',
            callbackURL: "http://localhost:8000/auth/facebook/callback" // change later!
        },
        function(accessToken, refreshToken, profile, next) {
            // User.findOrCreate({ facebookId: profile.id }, function(err, user) {
            // if (err) { return done(err); }
            // });
            var needle = require('needle'),
                data = {
                    userid: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    authToken: accessToken
                };
            //console.log(data);

            needle.post(
                "http://localhost:8000/register",
                data
            );
            next(null, data);
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    //router.get('/auth/facebook', passport.authenticate('facebook'));

    router.get('/auth/facebook', //function(res, req){
        function(req, res) {
            passport.authenticate('facebook', function(err, user, info) {
                console.log(err, user, info);
            })(req, res)
        });


    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    router.get('/auth/facebook/callback', function(req, res, done) {
        console.log('auth/facebook/callback maaaan');
        passport.authenticate('facebook', {
            successRedirect: '/myCar/29',
            failureRedirect: '/login'
        })(req, res, done);
    });


    router.get('/registerWithFB', function(req, res) {

        res.format({
            json: function() {
                res.json(model);
            },
            html: function() {
                res.render('registerWithFB/index', model);
            }
        });
    });

};