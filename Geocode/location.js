var csv = require("fast-csv");
var fs = require("fs");
var util = require("util");
var path = require("path");
var async = require("async");


function Location(fileName,api,config){
	var fileName = fileName;
    var googleApi = api;
	var records = [];
	var config = config;
		
	//Read the file In memory
	this.read = function(){
	    var that = this;
		readFile(path.join(__dirname,"files",fileName),function(err,recordArr){
			//console.log(recordArr);
			that.readComplete(recordArr); 
		});
	}
	
	this.readComplete = function(recordArr){
		//console.log(recordArr);
		console.log("Read Complete..." + fileName);
		this.geoCode(recordArr);
	}
	
	this.getAddress = function(addressConfig,record){
		var address = [];
		var header = [addressConfig.street1,addressConfig.street2,addressConfig.city,
		              addressConfig.state,addressConfig.country,addressConfig.zip];
		
		header.forEach(function(column){
			if(record[column]){
				address.push(record[column]);
			}
		});
		//return address.join(",");
		return encodeURIComponent(address.join(","));
	}
	
	this.geoCode = function(recordArr){
		var addressFieldConfig = getAddressFields(config);
		recordArr.shift();
		console.log("=============Address Configuration=================");
		console.log(addressFieldConfig);
		
		var that = this;
		/*
		recordArr.forEach(function(record){
			var address = that.getAddress(addressFieldConfig,record);
			googleApi.geoCode(address,function(err,result){
				console.log("---Record---");
				record.latitude = result.lat;
				record.longitude = result.lon;
			});
		});
		*/
		function callback(){
			
		}
		var counter = 0;
		async.eachLimit(recordArr,1,function(record,callback){
			var address = that.getAddress(addressFieldConfig,record);
			googleApi.geoCode(address,++counter,function(err,result){
				if(!err && result) {
					record.latitude = result.lat;
					record.longitude = result.lng;
				}
				else {
					record.latitude = "";
					record.longitude = "";
				}
				return callback();
			});			
		},function(err){
			console.log("All records geocoded for " + fileName);
			console.log('------------Geocoding complete-------------------------');
			that.write(recordArr);
		});
		
	}
	
	function getAddressFields(){
		var extName = path.extname(fileName);
		var nameOnly = path.basename(fileName);
		
		var configKey = nameOnly.substring(0,nameOnly.length - extName.length);
		
		
		return config[configKey];
	}
	function getNewFileName(fileName){
		var extName = path.extname(fileName);
		var nameOnly = path.basename(fileName);
		
		var newFileName = nameOnly.substring(0,nameOnly.length - extName.length);
		return newFileName+ "Geocode" + ".csv";
	}
	
	
	
	this.write = function(recordArr){
		var csvStream = csv.createWriteStream({headers: true,trim:true});
		//var newFileName = "";
		var newFileName = "";
		if(config.overwrite){
			newFileName = fileName;
		}
		else {
			newFileName = getNewFileName(fileName);
		}
		
    	var writableStream = fs.createWriteStream(path.join(__dirname,"output",newFileName));

		writableStream.on("finish", function(){
  			console.log("File Write Complete " + newFileName + " in output Folder");
			console.log('-------------------------------------');
		});

		csvStream.pipe(writableStream);
		for(var i = 0; i < recordArr.length;i++){
			csvStream.write(recordArr[i]);
		}
		csvStream.end();

	}
	
	function readFile(fileName,callback) {
		 var stream = fs.createReadStream(fileName);
		 var headerRead = false;
		 var headerArray = [];
		 var recordArr = [];
		 var csvStream = csv({ignoreEmpty:true,trim:true}).on("data", function(data){
            //headerRead = 
			if(util.isArray(data)){
              if(!headerRead){
				  headerArray = data;
				  headerRead = true;
				  //console.log(data);
				  //return;
			  }
			  var record = {};
			  for(var i=0; i < data.length;i++){
				 record[headerArray[i]] = data[i];
			  }
			  recordArr.push(record);
        	}
    	})
    	.on("end",function(data){
        	console.log("File Reading complete..." + fileName);
			console.log('-------------------------------------');
			callback(null,recordArr);
    	});
	
    	stream.pipe(csvStream);
	}	
};

module.exports.loc = Location;