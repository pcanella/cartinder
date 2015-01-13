'use strict';


var RegisterModel = require('../../models/register');
var model = new RegisterModel();
var promise = require('q');
var session = require('express-session');
var memcache = require('memcache');


module.exports = function (app) {

    app.post('/register', function (req, res) {
       
        var fb_info = req.body,
        token = fb_info.authToken;
        var t = app.use(session({
                secret: 'keyboard cat',
                name: 'userid'
            }));

        checkAccessToken(token, res).then(function(access) {
            if (access.id) {
                console.log('SUCCESS!');
              
        model.checkIfRegistered(req.body.userid).then(function (result) {
            //console.log(model.getUserId(req.body.userid));
            if(result === true) {
                res.render('register', {'message': 
                    '{"userAlreadyRegistered" : "true", "status" : "You are ALREADY registered, going to sign in page..."}'
                });
            }else {
                model.setFBData(fb_info).then(function() {

                    model.getUserId(fb_info.userid).then(function(result) {

                        client.set('realuserId', result[0].user_id);

                        //console.log('REALUSERID', req.session.realUserId);
                    });

                    res.render('register', 
                        {'message': '{"userAlreadyRegistered": "false", "status" : "Awesome, you are now registered!"'
                    });
                    }).fail(function(err) {
                            console.log(err);
                        });            
            }
        });
    } else{
        console.log("ERROR", access);
        res.render('register', {'message': "{'status': 'Sorry, you are invalid'}"});
    }
});

});

    var checkAccessToken = function(token, res) {
        console.log('checking....');
        var prom = promise.defer();

        var needle = require('needle');

        needle.get('https://graph.facebook.com/me?fields=id&access_token=' + token, function(error, response) {
        if (!error && response.statusCode == 200){
            res.session.registered = 'YES!';
            prom.resolve(response.body);
        }else{
            prom.resolve(response.statusCode);
            console.log("ERR", response.statusCode);
        }
});

    return prom.promise;

};
        // if(t.id)
        //     return true;
        // else 
        //     return false;
    
};