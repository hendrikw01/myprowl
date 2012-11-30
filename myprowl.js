/*
	myProwl
	
	Prowl API Library for node.
	For Prowl API version: 2011-01-30
	
	[MIT]
	
	https://github.com/*****
*/

var	request = require('request'),
	parser = require('xml2json'),
	qs = require('querystring'),
	EventEmitter = require('events').EventEmitter;

var app = new EventEmitter();
var apikey = null;
var providerkey = null;

// --- Set API keys ---
app.keys = {
	setApikey: function(key){ apikey = key;},
	setProviderkey: function(key){providerkey = key;}
}
// --- Add notification ---
app.add = {
	simple: function(application,event,description,cb){
		app.add.complex({application:application,event:event,description:description},cb);
	},
	complex: function(options,cb){
		var opts = {};
		if(validate("apikey",apikey,Number.MAX_VALUE,false)){opts.apikey = apikey;} // TODO: validate multiple keys "key[40],key[40],..."
		if(validate("providerkey",providerkey,40,true)){opts.providerkey = providerkey;}
		if(validate("priority",options.priority,2,true)){opts.priority = options.priority;} // TODO: validate range [-2,2]
		if(validate("url",options.url,512,true)){opts.url = options.url;}
		if(validate("application",options.application,256,false)){opts.application = options.application;}
		if(validate("event",options.event,1024,false)){opts.event = options.event;}
		if(validate("description",options.description,10000,false)){opts.description = options.description;}
		process(cb,"add","POST",opts);
	}
}
// --- Verify API key ---
app.verify = function(key,cb){
	var opts = {};
	if(validate("key",key,40,false)){opts.apikey = key;}
	if(validate("providerkey",providerkey,40,true)){opts.providerkey = providerkey;}
	process(cb,"verify","GET",opts);
}
// --- retrieve API key ---
app.retrieve = {
	token: function(cb){	// 1. Step
		var opts = {};
		if(validate("providerkey",providerkey,40,false)){opts.providerkey = providerkey;}
		process(cb,"retrieve/token","GET",opts);
	},
	apikey: function(token,cb){	// 2. Step
		var opts = {};
		if(validate("providerkey",providerkey,40,false)){opts.providerkey = providerkey;}
		if(validate("token",token,40,false)){opts.token = token;}
		process(cb,"retrieve/apikey","GET",opts);
	}
}

// --- Helpers ---
// Send API request
var process = function(cb,method,type,options){
	var callback = function (error, response, body){
		 if (!error && response.statusCode == 200) {
		 	// API response is in xml -> convert
			cb(error,parser.toJson(body,{object:true}).prowl);
  		}else if(!error){
  			var err = new Error("API error");
			err.http_code = response.statusCode;
			err.apiResponse = parser.toJson(body,{object:true}).prowl;
			err.body = body;
  			cb(err,null);
  		}else{
  			cb(error,null);
  		}
	};
	if(type == "POST") {
		request.post('https://api.prowlapp.com/publicapi/'+method, {form:options}, callback);
	}else if(type == "GET"){
		request.get('https://api.prowlapp.com/publicapi/'+method+"?"+qs.stringify(options), callback);
	}
};
// Validate API input
var validate = function(key,value,maxLength,optional){
	if(value == null && !optional){
		throw Error(key+" is required for this type of API call.");
	}else if(value == null && optional){
		return false;
	}
	if(value.length > maxLength) {
		throw Error(key+" is longer ("+value.length+") then the maximum of "+maxLength+".");
	}else if(value.length == 0 && !optional){
		throw Error(key+" can not be empty.");
	}
	return true;
};

// ready
module.exports = app
