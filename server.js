'use strict';
require('./loadConfig.js');
const fs = require('fs');
const Hapi = require('hapi');
const rentsAPI = require('./rents-api.js');
const chalk = require('chalk');
const percentile = require('stats-percentile');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 40115 
});


server.register([{register:require('vision')}, {register:require('inert')}], (err) => {
  if (err){
    throw err;
  }
  server.views({
        engines: {
            html: require('handlebars')
        },
        helpersPath: 'views/helpers',
        relativeTo: __dirname,
        path: 'views'
    });
});


server.route({
    method: 'GET',
    path:'/', 
    handler:function(request, reply){
      console.log(chalk.blue('[%s] %s'), request.method, request.path);
//      return reply.view('index', {places:null, json:JSON.stringify(null)});
      fs.readFile('./poi.json', 'utf-8', function(err, data){
        if (err){
          throw err;
        }
        try{
          data = JSON.parse(data);
          console.log(data);
        }
        catch (e){
          console.log(chalk.red("Something bad happen when parsing POI JSON file"));
          throw new Error('JSON parse error');
        }
        Promise.all(rentsAPI.getRents(data.places))
        .then(function(data){
          console.log(data.filter(function(item){return item.price;}))
          var prices = data.filter(function(item){return item.price;}).map(function(item){return item.price;});
          var levels = {
            low : percentile.calc(prices, 33),
            avgLow : percentile.calc(prices, 45),
            avg : percentile.calc(prices, 55),
            avgHigh : percentile.calc(prices, 67),
            high : percentile.calc(prices, 90)
          };
          
          console.log("percentiles", levels);
          data.forEach(function(place, idx){
            data[idx].colour = place.getRentColour(levels);
          });
          
          
          console.log(data);
          reply.view('index', {places:data, json:JSON.stringify(data)});
        })
        .catch(function(err){
          reply(':(' + err);
        });
      });
    }
});


server.route({
    method: 'GET',
    path: '/{file}.css',
    handler: function (request, reply) {
      reply.file("./static/css/"+request.params.file+".css");
    }
});

server.route({
    method: 'GET',
    path: '/{file}.js',
    handler: function (request, reply) {
      reply.file("./static/js/"+request.params.file+".js");
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
