'use strict';


var kraken = require('kraken-js'),
    app = {};


app.configure = function configure(nconf, next) {
    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(app).listen(function (err, server) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;

process.on('SIGINT', function() {
    process.exit();
});

process.on('uncaughtException', function() {
    // console.log(err);
});



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
