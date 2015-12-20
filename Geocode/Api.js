var request = require("request");

//Geocode using Google API
function GeocodeAPI(keyInput,conf) {
	var endPointUrl = "";
	var key = keyInput;
	var config = config;
	var headers = [];
	
	this.init = function(){
		populateUrl(key);
	}
	
	//this.geocode = function(record,callback){
	//	fireRequest(getAddress(record),callback);
	//}
	
	this.geocodeTest = function(callback){
		var address = "1600+Amphitheatre+Parkway,+Mountain+View,+CA";
		this.geoCode(address,callback);
	}
	

	this.geoCode = function(address,index,callback){
		var url = endPointUrl + "&address=" + address;
		//console.log(url);
		
		request(url,function(err,response,body){
			if(err){
				console.log(err);
				return callback(err,null);
			}
			if(err && callback){
				console.log(err);
				callback(err,null);
			}
			if(callback){
				//console.log(body);
				console.log("***DONE***" + index);
				var resultObj = JSON.parse(body);
				if(resultObj.status == "OK"){
				  return callback(null,resultObj.results[0].geometry.location);
				}
				return callback(null,{lat:"",lng:""});
				
			}
		});
	}
	
	function populateUrl(key){
		endPointUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=" + key;
	}
	
};

module.exports = GeocodeAPI;