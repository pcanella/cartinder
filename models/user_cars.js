'use strict';
var promise = require('q'),
    db = require('../lib/db.js');

db.connect();

module.exports = function UserCarsModel() {
    this.setUserCar = function(user_id, car_id) {
        var collectionPromise = promise.defer();
        var sql = 'INSERT INTO user_cars (user_id, car_id) VALUES(' + user_id + ',' + car_id + ');';
        db.query(sql, function(rows) {
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
