# myprowl -- Prowl API Library for node

## Description

Wrapper for Prowl's third-party API in version 2011-01-30
* add
* verify
* create API keys

More info and API/Provider Key registration: https://www.prowlapp.com/

## Install

<pre>
  npm install myprowl
</pre>

## It`s simple

Add a notification with the required parameters.

```javascript
var prowl = require('./myprowl');
prowl.keys.setApikey("API-KEY");
prowl.add.simple("myApp","TestEvent","myDescription", function(error,response){
	if(!error){
		console.log("OK, remaining: "+response.success.remaining+
					" , resetdate: "+response.success.resetdate);
	}else{
		console.log(error);
	}
});
```

## Take Control

Add a notification with optional parameters.

```javascript
var prowl = require('./myprowl');
prowl.keys.setApikey("API-KEY");
prowl.add.complex({
		priority: 1,
		url: "http://http://nodejs.org",
		application: "TestApp",
		event: "TestEvent",
		description: "TestDescription"
	}, 
	function(error,response){
	if(!error){
		console.log("OK, remaining: "+response.success.remaining+
					" , resetdate: "+response.success.resetdate);
	}else{
		console.log(error);
	}
});
```

## Verify API keys

Verify an API key that is provided by a user.

```javascript
var prowl = require('./myprowl');
prowl.verify("USER-API-KEY",function(error,response){
	if(!error){
		console.log("valid");
		console.log(response);
	}else{
		console.log(error);
	}
});
```

## Create API keys for users

Allow applications to create API keys for users.

### 1. Step: Get a registration token.

```javascript
var prowl = require('./myprowl');
prowl.keys.setProviderkey("Provider-KEY");
prowl.retrieve.token(function(error,response){
	if(!error){
		console.log("OK, remaining: "+response.success.remaining+
					" , resetdate: "+response.success.resetdate);
		console.log("Token: "+response.retrieve.token);
		console.log("Redirect user to url: "+response.retrieve.url);
	}else{
		console.log(error);
	}
});
```

### 2. Step: Get the key.

```javascript
var prowl = require('./myprowl');
prowl.keys.setProviderkey("Provider-KEY");
prowl.retrieve.apikey("TOKEN",function(error,response){
	if(!error){
		console.log("OK, remaining: "+response.success.remaining+
					" , resetdate: "+response.success.resetdate);
		console.log("API key: "+response.retrieve.apikey);
	}else{
		console.log(error);
	}
});
```

## Methods

### keys.setApikey(key)

Set the API Key for your application. The key is used for all API calls.

* `key` - 40-byte hexadecimal string or multiple keys separated by commas.

### keys.setProviderkey(key)

Set the Provider Key for your application. The key is used for all API calls.

* `key` - 40-byte hexadecimal string.

### add.simple(app,event,description,callback)

* `app` - Name of the application. [256 chars]
* `event` - Name of the event or the subject. [1024 chars]
* `description` - Description [10000 chars]
* `callback` - callback(error,response)

### add.complex(options,callback)

* `options`
    * `priority` - Notification priority. [-2,2] (Optional)
    * `url` - URL which will be attached to the notification. [512 chars] (Optional)
    * `app` - Name of the application. [256 chars]
    * `event` - Name of the event or the subject. [1024 chars]
    * `description` - Description [10000 chars]
* `callback` - callback(error,response)

### retrieve.token(callback)

* `callback` - callback(error,response)

### retrieve.apikey(token,callback)

* `token` - Token returned from retrieve.token.
* `callback` - callback(error,response)
