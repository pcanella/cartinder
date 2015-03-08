'use strict';

var myCarModel = require('../../models/myCar'),
    formidable = require('formidable'),
    path = require('path'),
    glob = require('glob'),
    fs = require('fs'),
    memcache = require('../../lib/cache'),
    passport = require('passport');

module.exports = function(router) {

    var model = new myCarModel();

    router.get('/myCar/:id', function(req, res) {

        console.log(req.session.passport);

        var userFbId = (req.session.passport && req.session.passport.user && req.session.passport.user.userid) ? req.session.passport.user.userid : '';


        // IF THIS USER IS LOGGED IN
        var idAsInt = parseInt(req.route.params.id, 10), // just parses the :id
            baseUrl = req.protocol + '://' + req.get('host');
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
                model.getUserIdFromFacebookId(userFbId, function(result) {
                    if (userFbId !== '')
                        obj.userIdFromFacebookId = result;
                    callback(null, obj);
                });
            },

            function(obj, callback) {
                model.getFaceBookIdFromUserId(idAsInt, function(result) {
                    if (idAsInt !== '')
                        obj.facebookId = result;
                    callback(null, obj);
                });
            },

            function(obj, callback) {
                model.getUserCar(idAsInt, function(result) {
                    if (idAsInt !== '')
                        obj.carData = result[0];
                    callback(null, obj);
                });
            },

            function(obj, callback) {
                model.getUserNameFromPageId(idAsInt, function(result) {
                    if (idAsInt !== '' && result)
                        obj.userNamesForPage = result;
                    callback(null, obj);
                });
            },

            function(err, result, done) {
                if (err)
                    console.log("ERR!", err);

                if (userFbId !== '' && obj.userIdFromFacebookId !== '') {
                    var uID = (obj.userIdFromFacebookId) ? obj.userIdFromFacebookId[0].user_id : '';
                    req.session.passport.user.pageId = uID;
                } else {
                    var uID = '';
                }
                model.carData = obj.carData;
                model.firstName = (obj.userNamesForPage) ? obj.userNamesForPage['facebook-firstname'] : '';
                model.lastName = (obj.userNamesForPage) ? obj.userNamesForPage['facebook-lastname'] : '';
                model.id = idAsInt;
                serveImages(obj.facebookId[0]['facebook-id'], baseUrl, function(imageFiles) {
                    model.userImages = imageFiles;
                    if (uID === idAsInt) {
                        model.userEdit = 'true';
                        res.render('myCar/index', model);
                    } else if (obj.userPageExists === true) {
                        model.userEdit = 'false';
                        res.render('myCar/index', model);
                    } else {
                        model.userEdit = 'false';
                        res.render('errors/404', model);
                    }
                });

                // result now equals 'done'
                callback(null, done);

            }
        ]);
    });

    router.post('/myCar/:id/:imageId/delete', function(req, res) {

        // TODO: Add CSRF token generated on pageload!

        model.getFaceBookIdFromUserId(req.route.params.id, function(result) {
            if (req.session.passport.user.uuid === req.body.uuid && req.session.passport.user.userid === result[0]['facebook-id']) {
                var t = path.resolve('public/images/' + result[0]['facebook-id'] + '/' + req.route.params.imageId);
                glob(t, {}, function(err, matches) {
                    if (matches.length > 0) {
                        console.log('MATCH!', matches);
                        fs.unlink(matches[0], function() {
                            console.log('successfully destroyed', req.route.params.imageId);
                            res.write(JSON.stringify({
                                'facebook-id': req.route.params.id,
                                'filename': req.route.params.imageId
                            }));
                            res.end();
                        });
                    }
                });
                //});
            } else {
                res.write('{"errorMessage": Access denied-- you are not the current logged in user"}');
                res.end();
            }

        });
    });

    router.post('/myCar/:id', function(req, res) {
        //console.log(t.userid);
        var fs = require('fs');
        var form = new formidable.IncomingForm();
        var userIdImageFolder = path.resolve('public/images/' + req.session.passport.user.userid);

        fs.mkdir(userIdImageFolder, function(err) {
            console.log(err);
        });

        form.uploadDir = userIdImageFolder;
        form.keepExtensions = true;

        form.parse(req, function(err, fields, files) {

            if (err) {
                console.log("Form parse ERR", err);
            }

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