///////////////////////////////////////////////////////////
// Service Size nodeJS script for PaaS
//
// Ben Cochran 
// June 25, 2014
//
// Dependencies:
//		nodeJS http://nodejs.org/ 
//
// To start server:
//  	node theAppServer.js portNumber client_id client_secret
//
// Starting with a simple way to authenticate using the dev 
// keys.
// Get Auth Key:  
//		http://host:portNumber/auth


//
// Init
//if ( process.argv.length < 5 ){
//	console.log("Usage: node portNumber theAppServer.js client_id client_secret");
//	process.exit(1);
//}

//var serverPortNumber = parseInt (process.argv[2]);	
//var client_id=process.argv[3];
//var client_secret=process.argv[4];

var serverPortNumber = "8080";	
var client_id="PUT_YOUR_KEY_HERE";
var client_secret="PUT_YOUR_SECRET_HERE";

var http = require("http");
var https = require("https");

//
// Util Functions
function makeRequestHTTPS (hostURL, method, data, onResponse)
{
	var dataString = data;
	
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    
	var options = {
  		host: hostURL,
  		port: 443,
  		path: method,
  		method: 'POST',
  		headers: headers,
  		
  		// only for dev!
  		rejectUnauthorized: false,
        requestCert: true,
        agent: false
	};	

	var req = https.request(options, function(res) {
  		res.setEncoding('utf8');
  		var responseString = '';
  		
  		res.on('data', function (data) {
    		responseString += data;
  		});
  		
  		res.on('end', function() {
  			onResponse (responseString);
    	});
  });

  req.write( dataString );
  req.end();
} 

//
// Start and run the server 	                  				  	
http.createServer(function(request, response) {
    //response.writeHead(200, {"Content-Type": "text/html"});
    response.setHeader('Content-Type', 'application/json');
    
    // TOOD: add the allow domains as in input param 
    response.setHeader('Access-Control-Allow-Origin', '*');	
 
    console.log ('REQUEST: ' + request.url);

    var reqParts = request.url.split ('/');
    if ( reqParts.length >= 1 )
    { 
      switch ( reqParts[1].toLowerCase() ) 
      {
        case 'auth'   : console.log ("Method: Auth" );
        				makeRequestHTTPS ( 
        					'developer.api.autodesk.com', 
	              			'/authentication/v1/authenticate',
	              			'client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials',
	               			function (responseFromAutodesk) {
	                  			console.log(responseFromAutodesk); 	                  				    
	                  			response.end (responseFromAutodesk);
	               			});
        				break;           	     
		
        //case 'thumb'  : console.log ("Get the Thumbnail." );
        //				  console.log ("TODO");
        //                break;

        //case 'upload' : console.log ("Upload design data."); 
        //				  console.log ("TODO");        				  
        //                break;
		
        default     : response.end("I am not sure what to do with this request ... ");
      }
    }
}).listen(serverPortNumber);

