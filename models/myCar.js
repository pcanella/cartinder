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

    this.getUserNameFromPageId = function(page_id, callback) {
        console.log('getUserNameFromPageId');
        var sql = 'SELECT `facebook-firstname`, `facebook-lastname` FROM users WHERE `user_id`=' + page_id;
        db.query(sql, function(rows) {
            return callback(rows[0]);
        });
    }

    this.getUserNameFromFacebookId = function(fb_id) {
        var unamePromise = promise.defer();
        var sql = 'SELECT `facebook-firstname`, `facebook-lastname` FROM users WHERE `facebook-id`=' + fb_id;



        db.query(sql, function(err, rows, fields) {
            if (err) throw err;
            console.log('The solution is: ', rows[0].solution);
        });

        // db.query(sql, function(rows) {
        //     console.log('testing!', rows);
        //     unamePromise.resolve(rows);
        // });
        // return unamePromise.promise;

    }

    // TODO: Add a check - if they have other pics, don't make profile_image true, else make profile image true
    this.setUserImagePath = function(fb_id, user_id, filepath) {
        var imagePromise = promise.defer();
        var sql = 'INSERT INTO user_images (`facebook_id`, `user_id`, `image_loc`, `profile_image`) VALUES(' + fb_id + ',"' + user_id + '","' + filepath + '", false)';
        db.query(sql, function(rows) {
            imagePromise.resolve(rows);
        });
        return imagePromise.promise;
    };

    this.getUserIdFromFacebookId = function(facebook_id, callback) {
        console.log('getUserIdFromFacebookId');
        if (facebook_id !== undefined && facebook_id !== '') {
            var sql = 'SELECT user_id from users WHERE `facebook-id` =' + facebook_id;
            db.query(sql, function(rows) {
                return callback(rows);
            });
        } else {
            return callback(null);
        }
    };

    this.userPageExists = function(id, callback) {
        console.log('userpageexists');
        var userPagePromise = promise.defer();
        var sql = 'SELECT user_id from users WHERE `user_id` =' + id;
        db.query(sql, function(rows) {
            if (rows.length > 0) {
                return callback(true);
            } else {
                return callback(false);
            }
        });
    };

    this.dbQuery = function(sql, promise, callback) {

        db.query(sql, function(rows) {
            callback(rows);
            promise.resolve(rows);
        });
    };

};