'use strict';


var ModsModel = require('../../models/mods');


module.exports = function (router) {

    var model = new ModsModel();


    router.get('/', function (req, res) {
        
        res.format({
            json: function () {
                res.json(model);
            },
            html: function () {
                res.render('mods/index', model);
            }
        });
    });

};
