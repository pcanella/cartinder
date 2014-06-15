var mysql = require('mysql');
var db = {
    connection: null,
    debug: false,

    connect: function() {
        this.connection = mysql.createConnection({
            host: '192.168.33.10',
            user: 'admin',
            password: 'cocacola',
            database: 'collection'
        });
        this.connection.connect();
    },

    disconnect: function() {
        this.connection.end();
    },

    query: function(sql, callback) {
        if (this.debug) {
            console.log(sql);
        }
        this.connection.query(sql, function(err, rows, fields) {
            if (err) {
                console.log('error');
                console.log(err);
            }
            if (this.debug) {
                console.log(fields);
                console.log(rows);
            }
            callback(rows);
        });
    }
};
module.exports = db;
