'use strict';

var CollectionModel = require('../../models/user_cars');
var model = new CollectionModel();

module.exports = function(app) {

    // C in CRUD
    // app.post('/collection', function(req, res) {
    //     model.createCollectionForUser(req.body.name, req.body.userId, req.body.description, req.body.visibility); 
    // });

    // R in CRUD
    app.get('/carview', function(req, res) {
          res.header("Content-Type", "text/html");
        

    var modelPromise = model.getUserCar(1);

        modelPromise.then(function(model) {
        res.render('carview', model[0]);
    })
        .fail(function(err) {
            console.log(err);
        });

    });

};
