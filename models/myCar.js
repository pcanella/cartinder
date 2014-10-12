'use strict';
var promise = require('q'),
    db = require('../lib/db.js');

db.connect();

module.exports = function myCarModel() {
    this.setProfileImage = function(user_id, image_id) {
        var promise = promise.defer();
        var sql = 'INSERT INTO user_cars (user_id, car_id) VALUES(' + user_id + ',' + car_id + ');';
        db.query(sql, function(rows) {
                        promise.resolve(rows);
                    });
                return promise.promise;

    };

    this.checkValidProfile = function(id) {
        var id = this.getUserIdFromFacebookId(id);
        console.log(id);
        var promise = promise.defer();
        var sql = 'INSERT INTO user_cars (user_id, car_id) VALUES(' + user_id + ',' + car_id + ');';
        db.query(sql, function(rows) {
                        promise.resolve(rows);
                    });
                return promise.promise;
    };

    // TODO: Add a check - if they have other pics, don't make profile_image true, else make profile image true
    this.setUserImagePath = function(user_id, filepath) {
        var imagePromise = promise.defer();
        var sql = 'INSERT INTO user_images (`user_id`, `image_loc`, `profile_image`) VALUES(' + user_id + ',"' + filepath + '", false)';
        db.query(sql, function(rows) {
            imagePromise.resolve(rows);
        });
        return imagePromise.promise;
    };

    this.getUserIdFromFacebookId = function(facebook_id) {
        var imagePromise = promise.defer();
        var sql = 'SELECT user_id from users WHERE `facebook-id` =' + facebook_id;
        db.query(sql, function(rows) {
            imagePromise.resolve(rows);
        });
        return imagePromise.promise;
    };

    this.userPageExists = function(id){
        var userPagePromise = promise.defer();
        var sql = 'SELECT user_id from users WHERE `user_id` =' + id;
        db.query(sql, function(rows) {
            if (rows.length > 0)
                userPagePromise.resolve(true);
            else
                userPagePromise.resolve(false);
        });
        return userPagePromise.promise;
    };

       this.dbQuery = function(sql, promise, callback) {

        db.query(sql, function(rows) {
            // if(rows.insertId !== undefined){
            //     callback(rows.insertId);
            // }
            callback(rows);
            promise.resolve(rows);
        });
    };

};
