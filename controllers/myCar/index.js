'use strict';

var myCarModel = require('../../models/myCar');
var formidable = require('formidable');


module.exports = function (router) {

    var model = new myCarModel();

    router.get('/myCar/:id', function (req, res) {
      console.log(req.session.realUserId, req.route.params.id);
      // IF THIS USER IS LOGGED IN
      var idAsInt = parseInt(req.route.params.id, 10);

      model.userPageExists(idAsInt).then(function(result) {
        if (req.session.realUserId === idAsInt) {
          model.userEdit = true;
          res.render('myCar/index', model); 
        }else if (result === true) {
          res.render('myCar/index', model); 
        }else {
          res.render('errors/404', model);
        }
      });
    });

    router.post('/myCar', function(req, res) {
        //console.log(t.userid);
        var session = require('express-session');

        var path = require('path');
        var fs = require('fs');
         var form = new formidable.IncomingForm();
        var userIdImageFolder = path.resolve('public/images/' + req.session.realUserId);

        fs.mkdir(userIdImageFolder, function(err) {
          console.log(err);
        });
           
        form.uploadDir = userIdImageFolder;
        form.keepExtensions = true;

        form.parse(req, function(err, fields, files) {

            var getFileName = files.aFile.path.split('/');
            getFileName = getFileName[getFileName.length - 1];

            model.setUserImagePath(req.session.realUserId, getFileName);

        });

         res.render('myCar/index', model);
    });



  function gDriveUpload() {
    // get auth token based on refresh token
    var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2,
    refresh_token = '1/abO2YO2mfhTIdP_WqtA40hAz4VjLzC_h5WYMd7lYgaE', 
    client_id = '778477913013-denrnq8skkch907kca5kgek0e4lm146l.apps.googleusercontent.com', 
    client_secret = 'QrgOGqIhsk-bIjVMl0Lir17W',
    redirect_url = 'http://ft86.tokyo';

    var oauth2Client = new OAuth2(client_id, client_secret, redirect_url);

    console.log(oauth2Client);

oauth2Client.getToken(code, function(err, tokens) {
  // Now tokens contains an access_token and an optional refresh_token. Save them.
  if(!err) {
    oauth2Client.setCredentials(tokens);
    console.log(tokens);
  }else{
    console.log('ERROR', err);
  }
});

  }


    function uploadGoogle(type, size, file) {

          var boundary = '-------314159265358979323846';
  var delimiter = "\r\n--" + boundary + "\r\n";
  var close_delim = "\r\n--" + boundary + "--";

  var contentType = 'image/jpeg';
     var metadata = {
       "title": "TEST"
   };


    var multipartRequestBody =
        delimiter +
        'Content-Type: multipart/related\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        file +
        close_delim;

           var data = {'body': multipartRequestBody};

           console.log("PAST THIS");

        var needle = require('needle'),
        options = {
                headers: {
                        'Content-Type': "image/jpg",
                        'Content-Length': size,
                        'Authorization': 'Bearer ya29.eQDZ8ZrldyodhBwAAACXH7E_LnNGoVONgAM56WqvZhlZ36AoSCreNfJCv0_JCg'
                    },
                    json: true,
                    multipart: true
            };
        needle.post('https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart', data, options,  function(error, response) {
                console.log("GOOG", response);
                console.log("ERR", error);
            });
    }



        // function uploadImage(file) {
        //     var clientId = 'd89df0df0dd7bdf', options = {
        //         headers: {
        //                 'Content-Type': 'image/jpeg',
        //                 'Content-Length': 
        //                 'Authorization': 'Bearer ya29.eQCUlWcB_00OuxwAAAA6u3HeISJYjn_NgDteFpuUPFicpl1ItJi3GlnztWCl9g'}
        //     };
        //     var needle = require('needle');
        //     needle.post('https://api.imgur.com/3/image', 'image=' + file, options, function(error, response) {
        //         console.log("IMGUR", response);
        //     });
        // }

};
