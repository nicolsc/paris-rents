#Mapping Paris' rent prices




##Data

* Use the API from [RentsWatch](http://blog.rentswatch.com/api/)
* Geocoding of the PoI is done by the API


##Install

Prerequisites : 

* [NodeJS](http://nodejs.org)

Dependencies :

* [hapijs](http://npmjs.org/hapijs)
* [chalk](http://npmjs.org/chalk)
* [handlebars](http://npmjs.org/handlebars)
* [inert](http://npmjs.org/inert)
* [request-promise](http://npmjs.org/request-promise)
* [stats-percentile](http://npmjs.org/stats-percentile)
* [vision](http://npmjs.org/vision)




```
	$ npm install
```	
 
##Configure

###API token

You need to get your own [RentsWatch](http://rentswatch.com) API token, and create your config file as follow :

```
module.exports = {
  API_TOKEN: '{{token}}',
  API_ENDPOINT: 'http://{{api endpoint}}'
};

```

###Set your own PoIs

Update the `poi.js` to map your own point of interests  
Change map's default center & zoom in `static/js/map.js`

##Run

```
	$ npm run
```

##Improve

Feel free to submit any issue or PR :)
