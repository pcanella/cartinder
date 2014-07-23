'use strict';


var RegisterModel = require('../../models/register');


module.exports = function (router) {

    var model = new RegisterModel();


    router.get('/', function (req, res) {
        
        res.format({
            json: function () {
                res.json(model);
            },
            html: function () {
                res.render('register/index', model);
            }
        });
    });

};
