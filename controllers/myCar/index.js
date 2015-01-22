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
                model.userPageExists(idAsInt, function(result) {
                    obj.userPageExists = result;
                    callback(null, obj);
                });
            },

            function(obj, callback) {
                model.userPageExists(idAsInt, function(result) {

                    obj.userPageExists = result;
                    callback(null, obj);
                });
            },

            function(obj, callback) {
                model.getUserIdFromFacebookId(userFbId, function(result) {
                    if (userFbId !== '')
                        obj.userIdFromFacebookId = result;
                    callback(null, obj);
                });
            },

            function(obj, callback) {
                model.getUserNameFromPageId(idAsInt, function(result) {
                    console.log('lolll', result);
                    if (idAsInt !== '')
                        obj.userNamesForPage = result;
                    callback(null, obj);
                });
            },

            function(err, result, done) {
                if (userFbId !== '' && obj.userIdFromFacebookId !== '') {
                    var uID = (obj.userIdFromFacebookId) ? obj.userIdFromFacebookId[0].user_id : '';
                    req.session.passport.user.pageId = uID;
                } else {
                    var uID = '';
                }
                model.firstName = obj.userNamesForPage['facebook-firstname'];
                model.lastName = obj.userNamesForPage['facebook-lastname'];
                console.log(obj.userNamesForPage['facebook-lastname']);
                //console.log(JSON.stringify(userNamesForPage));
                if (uID === idAsInt) {
                    model.userEdit = 'true';
                    res.render('myCar/index', model);
                } else if (obj.userPageExists === true) {
                    model.userEdit = 'false';
                    res.render('myCar/index', model);
                } else {
                    res.render('errors/404', model);
                }
                // result now equals 'done'
                callback(null, done);

            }
        ]);
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