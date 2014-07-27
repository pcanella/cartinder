'use strict';


var RegisterModel = require('../../models/register');
var model = new RegisterModel();

module.exports = function (app) {

    app.post('/register', function (req, res) {
        var fb_info = req.body,
        token = fb_info.authToken;
        //modelPromise = model.setFbId(req.body.userid);

        // console.log(fb_info);

        // console.log(checkAccessToken(token));

res.header("Content-Type", "application/json");
model.checkIfRegistered(req.body.userid).then(function (result) {

    console.log("IS USER IN DB?", result);

    if(result === true) {
            res.render('register', {'message': 
                "{'userAlreadyRegistered' : 'true', 'status' : 'You are ALREADY registered, going to sign in page...'}"
                });
    }else {
            model.setFbId(req.body.userid).then(function() {
            res.render('register', 
                {'message': "{'userAlreadyRegistered' : 'false', 'status' : 'Awesome, you are now registered!'}"
            });
        }).fail(function(err) {
                console.log(err);
            });            
        }
    });

});

    var checkAccessToken = function(token) {
        var t = app.get('https://graph.facebook.com/me?fields=id&access_token=' + token);
        console.log("VALID?", t);
        if(t.id)
            return true;
        else 
            return false;
    };
    
};
