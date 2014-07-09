'use strict';

var CollectionModel = require('../../models/user_cars');
var model = new CollectionModel();

module.exports = function(app) {

    //C in CRUD
    app.post('/user_cars', function(req, res) {
        console.log(req);
        model.setUserCar(req.body.userId, req.body.carId); 
    });

    // R in CRUD
    app.get('/users', function(req, res) {
          res.header("Content-Type", "application/json");

        //res.render('cars', model);
console.log(req.query);
 var modelPromise = model.getCar(req.query.carId);

        modelPromise.then(function(model) {
         res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(model[0]));
    })
        .fail(function(err) {
            console.log(err);
        });

    });

};
