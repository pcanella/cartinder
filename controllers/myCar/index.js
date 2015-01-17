'use strict';

var myCarModel = require('../../models/myCar');
var formidable = require('formidable');
var path = require('path');
var glob = require('glob');
var memcache = require('../../lib/cache');
var passport = require('passport');

module.exports = function(router) {

    var model = new myCarModel();

    router.get('/myCar/:id', function(req, res) {

        var userFbId = (req.session.passport && req.session.passport.user && req.session.passport.user.userid) ? req.session.passport.user.userid : '';


        // IF THIS USER IS LOGGED IN
        var idAsInt = parseInt(req.route.params.id, 10), // just parses the :id
            baseUrl = req.protocol + '://' + req.get('host');
        serveImages(userFbId, baseUrl, function(imageFiles) {
            model.userImages = imageFiles;
        });

        var waterfall = require('async-waterfall');
        var obj = {};

        waterfall([

            function(callback) {
                obj.userPageExists = model.userPageExists(idAsInt);
                callback(null, obj);
            },
            function(arg1, callback) {
                obj.userIdFromFacebookId = model.getUserIdFromFacebookId(userFbId);
                callback(null, obj);
            },
            function(arg1, callback) {
                obj.pageId = model.getUserNameFromPageId(idAsInt);
                // arg1 now equals 'three'
                callback(null, obj);
            }
        ], function(err, result) {
            console.log(obj);
            if (obj.userIdFromFacebookId !== '' || obj.userIdFromFacebookId !== null) {
                var uID = (obj.userIdFromFacebookId) ? obj.userIdFromFacebookId[0].user_id : '';
                req.session.passport.user.pageId = uID;
            } else {
                var uID = '';
            }
            if (uID === idAsInt) {
                model.userEdit = 'true';
                model.
                //console.log("model", model);
                res.render('myCar/index', model);
            } else if (obj.userPageExists === true) {
                model.userEdit = 'false';
                //console.log("model", model);
                res.render('myCar/index', model);
            } else {
                res.render('errors/404', model);
            }
            // result now equals 'done'
        });

        //model.userPageExists(idAsInt).then(function(result) {
        //model.getUserIdFromFacebookId(userFbId).then(function(actualUserId) {
        // if (actualUserId !== '' || actualUserId !== null) {
        //     var uID = (actualUserId) ? actualUserId[0].user_id : '';
        //     req.session.passport.user.pageId = uID;
        // } else {
        //     var uID = '';
        // }
        // if (uID === idAsInt) {
        //     model.userEdit = 'true';
        //     model.
        //     //console.log("model", model);
        //     res.render('myCar/index', model);
        // } else if (result === true) {
        //     model.userEdit = 'false';
        //     //console.log("model", model);
        //     res.render('myCar/index', model);
        // } else {
        //     res.render('errors/404', model);
        // }
        //})

        //        })
        // .then(function(done) {
        //     done();
        // });
    });

    router.post('/myCar', function(req, res) {
        //console.log(t.userid);
        var fs = require('fs');
        var form = new formidable.IncomingForm();
        console.log(req.session.passport.user.pageId);
        var userIdImageFolder = path.resolve('public/images/' + req.session.passport.user.userid);

        console.log(userIdImageFolder);

        fs.mkdir(userIdImageFolder, function(err) {
            console.log(err);
        });

        form.uploadDir = userIdImageFolder;
        form.keepExtensions = true;

        form.parse(req, function(err, fields, files) {

            var getFileName = files.aFile.path.split('/');
            getFileName = getFileName[getFileName.length - 1];

            model.setUserImagePath(req.session.passport.user.userid, req.session.passport.user.pageId, getFileName);

        });

        res.render('myCar/index', model);
    });



    function serveImages(userId, baseUrl, fn) {
        var images = [],
            t = path.resolve('public/images/' + userId);
        glob(t + "/*", function(er, files) {

            files.forEach(function(file) {
                var newURI = file.split('public');
                newURI = baseUrl + newURI[1];
                images.push({
                    'image': newURI
                });
            });
            return fn(images);
        });




    }
};