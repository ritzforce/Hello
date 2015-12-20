var config = require("./config");
var util = require("util");
var Location = require("./location").loc;
var path = require("path");
var GoogleAPI = require("./Api");
var fs = require("fs");

console.log("------Using API Key------");
console.log(config.apiKey);

var api = new GoogleAPI(config.apiKey,config);
api.init();
console.log("----Google api initialized----");

//console.log(Location);

//var hotel = new Location(path.join(__dirname,"NEWYORK.csv"),config);
//hotel.read();
console.log("----Reading Files-------");

fs.readdir(path.resolve(__dirname + "/files"),function(err,files){
	if(err){
		console.log(err);
		return;
	}
    return fileCollectionFound(files);
});
var locationArray = [];

function fileCollectionFound(files){
	files.forEach(function(file){
		locationArray.push(new Location(file,api,config));
	});
	
	locationArray.forEach(function(location){
		location.read();
	});
	
}