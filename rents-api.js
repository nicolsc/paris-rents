const request = require('request-promise');
const chalk = require('chalk');

var Place = function(infos){
  this.name = infos.name;
  this.category = infos.category;
  this.radius = infos.radius || 0.5;
};
Place.prototype.getRent = function(){
 console.log('Get data for %s', this.name, this.radius);
 return new Promise(function(resolve, reject){
  request.get({
    uri: process.env.API_ENDPOINT,
    debug:true,
    qs:{
      token: process.env.API_TOKEN,
      q: this.name,
      radius : this.radius
    },
    json:true
  })
  .then(function(data){
    console.log(chalk.green('Got data :)'));
    this.lat = data.latitude;
    this.lng = data.longitude;
    //if (data.total > 3){
      this.price = data.avgPricePerSqm;
    //}
    this.fullName = data.name;
    this.entries = data.total;
    this.updated = data.lastSnapshot;
    
    resolve(this);
  }.bind(this))
  .catch(function(err){
    console.warn(this.name, chalk.yellow(err));
    reject(err);
  }.bind(this));
  }.bind(this));
};

Place.prototype.getRentColour = function(levels){
  if (this.price === null || !levels || !levels.low || !levels.high){
    return '#FFFFFF';
  }
  

  
  if (this.price < levels.low) return '#005500';
  if (this.price < levels.avgLow) return '#00BB00';
  if (this.price < levels.avg) return '#1212FF';
  if (this.price < levels.avgHigh) return '#FFF000';
  if (this.price < levels.high) return '#ffa500';
  if (this.price > levels.high) return '#FF5555';
  return '#000000';
};
module.exports = {
  //return an array of Promises
  getRents:function(places){
    return places.map(function(item){
      var place = new Place(item);
      return place.getRent();
    });
  }
};