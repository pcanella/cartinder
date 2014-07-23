'use strict';


var LoginModel = require('../../models/login');


module.exports = function (router) {

    var model = new LoginModel();


    router.get('/login', function (req, res) {
        
        res.format({
            json: function () {
                res.json(model);
            },
            html: function () {
                res.render('login/index', model);
            }
        });
    });

};
