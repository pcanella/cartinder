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

    this.getUserNameFromPageId = function(page_id) {
        var aPromise = promise.defer();
        var sql = 'SELECT `facebook-firstname`, `facebook-lastname` FROM users WHERE `user_id`=' + page_id;
        db.query(sql, function(rows) {
            aPromise.resolve(rows);
        });
        return aPromise.promise;

    }

    this.getUserNameFromFacebookId = function(fb_id) {
        var unamePromise = promise.defer();
        var sql = 'SELECT `facebook-firstname`, `facebook-lastname` FROM users WHERE `facebook-id`=' + fb_id;
        db.query(sql, function(rows) {
            unamePromise.resolve(rows);
        });
        return unamePromise.promise;

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

    this.getUserIdFromFacebookId = function(facebook_id) {
        console.log('getUserIdFromFacebookId');
        var fbPromise = promise.defer();
        if (facebook_id !== '') {
            var sql = 'SELECT user_id from users WHERE `facebook-id` =' + facebook_id;
            db.query(sql, function(rows) {
                if (typeof rows === 'undefined') {
                    console.log(rows, 'crap!!!, undefined');
                    fbPromise.resolve(false);
                } else {
                    fbPromise.resolve(rows);
                }
            });
        } else {
            fbPromise.resolve(false);
        }
        return fbPromise.promise;
    };

    this.userPageExists = function(id) {
        console.log('userpageexists');
        var userPagePromise = promise.defer();
        var sql = 'SELECT user_id from users WHERE `user_id` =' + id;
        db.query(sql, function(rows) {
            if (typeof rows === 'undefined') {
                console.log('ugh');
                userPagePromise.resolve(false);
            };
            if (rows.length > 0) {
                userPagePromise.resolve(true);
            } else {
                userPagePromise.resolve(false);
            }
        });
        return userPagePromise.promise;
    };

    this.dbQuery = function(sql, promise, callback) {

        db.query(sql, function(rows) {
            callback(rows);
            promise.resolve(rows);
        });
    };

};