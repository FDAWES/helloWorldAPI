var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var router = require("./router");

//Instantiate a new StringDecoder object
var DECODER = new StringDecoder("utf-8");

// Instantiate a new HTTP server
var httpServer = http.createServer(unifiedServer);

function unifiedServer(req, res){
  // Parse the URL
  var parsedUrl = url.parse(req.url, true);

  // Get the Path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+s/g, "");

  // Get the querystring as an object
  var qsObject = parsedUrl.query;

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Get the Headers
  var headers = req.headers;

  // Buffer to store the payload
  var buffer = '';

  // Building the payload...
  req.on("data", function(data){
    buffer += DECODER.write(data);
  });

  //Upon Payload completion...
  req.on('end', function(){
    var data = {
      trimmedPath,
      method,
      qsObject,
      headers,
      payload: buffer
    }

    // Choose the right handler based on the route
    var handler = router[trimmedPath] ? router[trimmedPath] : router.notFound;

    handler(data, function(status, payload){
      // Check for valid status type or default it to 200
      status = typeof(status) == "number" ? status : 200;

      // Check for valid payload or set default as empty object
      payload = typeof(payload) == "object" ? payload : {};

      // Convert the payload to a JSON string
      var payloadString = JSON.stringify(payload);

      //Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);

      res.end(payloadString);

      // Object to log out
      var requestResponseInfo = {
        path,
        method,
        qsObject,
        buffer,
        status,
        payloadString
      };

      // Log out the entire request response information
      console.log(JSON.stringify(requestResponseInfo, null, 2));
    })
  });
}

//Listen UP ServerMan!
httpServer.listen(config.httpPort, function(){
  console.log(`Listening on port ${config.httpPort} in the ${config.envName}`)
});