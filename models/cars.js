'use strict';
var promise = require('q'),
    db = require('../lib/db.js');

db.connect();

module.exports = function CarModel() {
    this.getCar = function(carId) {
        var collectionPromise = promise.defer();
        var sql = 'SELECT * ' + 'FROM standard_cars c ' + 'WHERE c.id = ' + carId + ';';
        db.query(sql, function(rows) {
                        //console.log(rows);
                        collectionPromise.resolve(rows);
                    });
                return collectionPromise.promise;

    };

    // this.getUserName = function(userId) {
    //     var sql = 'SELECT username FROM users WHERE userid=' + userId;
    //       var collectionPromise = promise.defer();

    //     this.dbQuery(sql, collectionPromise);
    //     return collectionPromise.promise;

    // };


    // this.getUserCollectionInfo = function(userId){
    //     var sql = 'SELECT * from user_collection WHERE userid = ' + userId;
    //     var collectionPromise = promise.defer();

    //     this.dbQuery(sql, collectionPromise);

    // };

    // this.setUserCollectionInfo = function(insertId, userId){
    //       var sql = 'INSERT INTO user_collection (userId, collectionId) VALUES (' + userId + ',' + insertId + ')';
    //     var collectionPromise = promise.defer();

    //     this.dbQuery(sql, collectionPromise);

    // };

    // this.createCollectionForUser = function(name, userId, description, visibility){
    //     var sql = 'INSERT INTO collections (name, description, visibility) VALUES (' + name + ',' + description + ',' + visibility + ')';

    //     var collectionPromise = promise.defer(), self = this;

    //    this.dbQuery(sql, collectionPromise, function(t){
    //         self.setUserCollectionInfo(t, userId);
    //    });

     //  this.getUserCollectionInfo(

        //var getNewCollection = 'SELECT collectionId from 

    //};

       this.dbQuery = function(sql, promise, callback){

        db.query(sql, function(rows) {
            // if(rows.insertId !== undefined){
            //     callback(rows.insertId);
            // }
            callback(rows);
            promise.resolve(rows);
        });
    };

};
