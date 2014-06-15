'use strict';

var CollectionModel = require('../models/collection');
var model = new CollectionModel();

module.exports = function(app) {

    // C in CRUD
    app.post('/collection', function(req, res) {
        model.createCollectionForUser(req.body.name, req.body.userId, req.body.description, req.body.visibility); 
    });

    // R in CRUD
    app.get('/collection', function(req, res) {
          res.header("Content-Type", "application/json");
    });

};
