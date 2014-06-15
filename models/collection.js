'use strict';
var promise = require('q'),
    db = require('../lib/db.js');

db.connect();

module.exports = function CollectionModel() {
    this.getCollectionForUser = function(collectionId) {
        var sql = 'SELECT * ' +
                  'FROM collections c ' +
                  'WHERE c.collectionId = ' + collectionId + ';';

        var collectionPromise = promise.defer();
        this.dbQuery(sql, collectionPromise);
        return collectionPromise.promise;

    };

    this.getUserName = function(userId) {
        var sql = 'SELECT username FROM users WHERE userid=' + userId;
          var collectionPromise = promise.defer();

        this.dbQuery(sql, collectionPromise);
        return collectionPromise.promise;

    };


    this.getUserCollectionInfo = function(userId){
        var sql = 'SELECT * from user_collection WHERE userid = ' + userId;
        var collectionPromise = promise.defer();

        this.dbQuery(sql, collectionPromise);

    };

    this.setUserCollectionInfo = function(insertId, userId){
          var sql = 'INSERT INTO user_collection (userId, collectionId) VALUES (' + userId + ',' + insertId + ')';
        var collectionPromise = promise.defer();

        this.dbQuery(sql, collectionPromise);

    };

    this.createCollectionForUser = function(name, userId, description, visibility){
        var sql = 'INSERT INTO collections (name, description, visibility) VALUES (' + name + ',' + description + ',' + visibility + ')';

        var collectionPromise = promise.defer(), self = this;

       this.dbQuery(sql, collectionPromise, function(t){
            self.setUserCollectionInfo(t, userId);
       });

     //  this.getUserCollectionInfo(

        //var getNewCollection = 'SELECT collectionId from 

    };

    this.dbQuery = function(sql, promise, callback){
        db.query(sql, function(rows) {
            if(rows.insertId !== undefined){
                callback(rows.insertId);
            }
            promise.resolve(rows);
        });
    };

};
