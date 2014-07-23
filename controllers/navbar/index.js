'use strict';


var NavbarModel = require('../../models/navbar');


module.exports = function (router) {

    var model = new NavbarModel();


    router.get('/', function (req, res) {
        
        res.format({
            json: function () {
                res.json(model);
            },
            html: function () {
                res.render('navbar/index', model);
            }
        });
    });

};
