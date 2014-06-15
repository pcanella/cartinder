'use strict';

var CollectionsModel = require('../models/collections');
var model = new CollectionsModel();

module.exports = function(app) {

    app.get('/collections', function(req, res) {
          res.header("Content-Type", "text/json");
        
        res.render('collections', model);
        var uid = model.getUserName(req.query.username);

        var modelPromise = model.getCollectionData(uid);
        modelPromise
            .then(function(model) {
                res.render('collections', {collection: {name: model[0].username}});
            })
            .fail(function(err) {
                console.log(err);
            });
    });

};
