'use strict';

var http = require('http');
var request = require("request");
var q = require('q');

var IndexModel = require('../models/index');
   
   var cheerio = require('cheerio'),
    $ = cheerio.load('<h2 class="title">Hello world</h2>');

   

    $.html();


module.exports = function (app) {


    var model = new IndexModel();
// var url = require('url');


    app.get('/', function (req, res) { 

var url = require('url');
var url_parts = url.parse(req.url, true);
var query = url_parts.query;

var params = {
    'make': req.query.make.toUpperCase() || '',
    'model': req.query.model.toUpperCase() || '',
    'zip': req.query.zip || '95125',
    'startYear': req.query.startYear || '1981',
    'endYear': req.query.endYear || '2014',
    'radius': req.query.radius || '1000'
};

var requestURL = 'http://www.autotrader.com/cars-for-sale/' + params.make + '/' + params.model + '/' + 'San+Jose+CA-95125?zip=' + params.zip + '&startYear=' + params.startYear + '&endYear=' + params.endYear + '&makeCode1=' + params.make + '&modelCode1=' + params.model + '&searchRadius=' + params.radius;

/*PARAMS
 *
 *  Make
 *  Model
 *  Zip
 *  startYear
 *  endYear
 *  radius
 *
'http://www.autotrader.com/cars-for-sale/' + params.make + '/' + params.model + '/' + 'San+Jose+CA-95125?zip=' + params.zip + '&startYear=' + params.startYear + '&endYear=' + params.endYear + '&makeCode1=' + params.make + '&modelCode1=' + params.model + '&searchRadius=' + radius


 */
request(requestURL, function (error, response, body) {
    var obj={
            'cars': []
        };
    if (!error) {

        

        var t = "'" + body + "'";
        $ = cheerio.load(t);
        q($('.listing-results .listing').each(function(index) {
            var self = this;
            var getInfo = function(str){
            return $(self).find(str).text().replace(/(\r\n|\n|\r)/gm," ").replace(/^\s\s*/, '').replace(/\s\s*$/, '')
        };

                if($(this).find('.ymm').text() !== ''){
                  var p = {"title" : getInfo('.ymm'),
                    "dealer" : getInfo('.owner-title'),
                    "distance" : getInfo('.distance-cont'),
                    "color" : getInfo('.color span'),
                    "prim_price": getInfo('.primary-price:first-child'),
                    "other_price": getInfo('.price-amount')
                  };
                obj.cars.push(p);
               }
        })).done(function() {
            model.data = JSON.stringify(obj);
            res.render('index', model);

        });



    } else {
        console.log(error);
    }
});

        //res.write(JSON.stringify(obj));


    });
};

