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
var obj={
            'cars': []
        };

    app.get('/', function (req, res) { 

var url = require('url');
var url_parts = url.parse(req.url, true);
var query = url_parts.query;
console.log(req.query);
 
request("http://www.autotrader.com/cars-for-sale/Subaru/BRZ/San+Jose+CA-95125?&startYear=2012&endYear=2015&makeCode1=Subaru&modelCode1=BRZ&searchRadius=100&showcaseOwnerId=100008316&startYear=1981&Log=0&showcaseListingId=371588101&showcaseOwnerId=100008316&captureSearch=true&Log=0", function (error, response, body) {
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

