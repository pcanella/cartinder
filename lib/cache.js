module.exports = function () {

    return function (req, res, next) {
        var memcache = require('memcache');
        var client = new memcache.Client();
        client.port = 11211;
        client.host = 'localhost';
        next();
    };
};

