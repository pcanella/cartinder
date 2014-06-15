'use strict';

var promise = require('q'),
    db = require('../lib/db.js');

db.connect();


module.exports = function CollectionsModel() {


    this.getUserName = function(username) {
        var sql = 'SELECT username FROM users WHERE userid=' + username;
        var collectionPromise = promise.defer();

        this.dbQuery(sql, collectionPromise);
        return collectionPromise.promise;
    };

    // this.getCollectionData = function(userId){

    // var sql = 'SELECT * FROM users u JOIN user_collection uc ON u.userId = uc.userIdJOIN collections c ON c collectionId = uc.collectionId
    //     JOIN item_collection ic ON ic.collectionId = uc.collectionId
    //     JOIN items i ON i.itemId = ic.itemId WHERE u.userid =' + userId;

    //     var collectionPromise = promise.defer();

    //     this.dbQuery(sql, collectionPromise);
    //     return collectionPromise.promise;
    // };

    this.dbQuery = function(sql, promise, callback){
        db.query(sql, function(rows) {
            if (rows.insertId !== undefined) {
                callback(rows.insertId);
            }
            promise.resolve(rows);
        });
    };
};