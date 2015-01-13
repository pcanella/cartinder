'use strict';

 var kraken = require('kraken-js'),
 millionsServed = require('./lib/millionsServed'),
 options = {};

 var express = require('express');
 var app = express();
 var passport = require('passport');



options.configure = function configure(nconf, next) {
    // Async method run on startup.
    next(null);
};


options.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
    server.use(millionsServed());
};


options.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
    server.use(express.static(__dirname + '/public'));
    server.use(passport.initialize());
    server.use(passport.session()); 
    server.use(app.router);
};


options.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};

console.log(kraken);

if (require.main === module) {
    kraken.create(options).listen(function (err, server) {
        if (err) {
            console.error(err.stack);
        }        
    });
}

// var express = require('express'),
//     kraken = require('kraken-js');

// var app = express();
// app.use(kraken.create(options));
// app.listen(8000);


module.exports = options;

process.on('SIGINT', function() {
    process.exit();
});

process.on('uncaughtException', function() {
    // console.log(err);
});


// 'use strict';


// var kraken = require('kraken-js'),
//     app = require('express')(),
//     // options = require('./lib/spec')(app),
//     // userLib = require('./lib/user')(),
//     port = process.env.PORT || 8000;



// var t = app.use(kraken.create());

// t.listen(port, function(err) {
//     console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
// });


var livereload = require('livereload2');
// start up livereload server
var server = livereload.createServer({
    exts: [
        'dust'
    ]
});
server.watch(__dirname + '/config');
server.watch(__dirname + '/consumers');
server.watch(__dirname + '/controllers');
server.watch(__dirname + '/locales');
server.watch(__dirname + '/models');
server.watch(__dirname + '/public');
