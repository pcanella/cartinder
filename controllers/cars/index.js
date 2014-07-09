'use strict';

var CollectionModel = require('../../models/cars');
var model = new CollectionModel();

module.exports = function(app) {

    // C in CRUD
    // app.post('/collection', function(req, res) {
    //     model.createCollectionForUser(req.body.name, req.body.userId, req.body.description, req.body.visibility); 
    // });

    // R in CRUD
    app.get('/cars', function(req, res) {
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
