var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    util = require('util');

http.createServer(_handler).listen(3000);
console.log('Server running at http://127.0.0.1:3000/');

function _handler(req, res) {

    var root = "..",
        url = "",
        contentType = "text/plain",
        filePath = "";

  	if (req.method !== 'GET') { //If the request method doesn't equal 'GET'
  	    res.writeHead(405); //Write the HTTP status to the response head
	      res.end('Unsupported request method', 'utf8'); //End and send the response
  	    return;
  	}

    console.log('URL Request: ' + req.url);

  	if ('.' + req.url !== './') {
  	    filePath = root + req.url;
        console.log('Requested file: ' + filePath);
  	    fs.exists(filePath, serveRequestedFile);
  	}
    else {
  	    res.writeHead(400);
  	    res.end('A file must be requested', 'utf8');
  	    return;
  	}

  	function serveRequestedFile(file) {
  	    if (file === false) {
          res.writeHead(404);
	        res.end();
	        return;
  	    }

  	    var stream = fs.createReadStream(filePath);

  	    stream.on('error', function(error) {
	        res.writeHead(500);
	        res.end();
	        return;
  	    });

  	    var mimeTypes = {
	        '.js' : 'text/javascript',
	        '.css' : 'text/css',
	        '.gif' : 'image/gif',
          '.html' : 'text/html'
  	    };

  	    contentType = mimeTypes[path.extname(filePath)];

  	    res.setHeader('Content-Type', contentType);
  	    res.writeHead(200);

  	    util.pump(stream, res, function(error) {
  	        //Only called when the res is closed or an error occurs
  	        res.end();
  	        return;
  	    });
  	}

}
