'use strict';


var CreateuserModel = require('../../models/createUser');


module.exports = function (router) {

    var model = new CreateuserModel();


    router.get('/createUser', function (req, res) {
        
        res.render('createUser/index', model);
        
    });

};
