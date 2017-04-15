var sys = require("sys");
var http = require("http");
var url = require("url");
var callback;
var response;

http.createServer(function(request, response){
	var resText = "";
	var path = url.parse(request.url, true);
    var cb = function(err, data, response2){
		response2.write(data.toString());
		response2.end();
    };
    
	callback = cb;

	if (path.pathname == '/get'){
        GitHubcheck(request, cb, response);
        return;
    }else{
		resText = "That is not a valid request.";
	}

	response.write(resText);
	response.end();

}).listen(9000, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Node listening', host, port);
});

function GitHubcheck(request, cb, response2) {
	response = response2;
	var requestNew = require('request');
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;

	console.log(query.request);

	if (JSON.stringify(query, null, 4) === "{}"){
		response2.write("No query parameter");
	}

	var headers = {
		'user-agent':  'Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/21.0'
	};

	var options = {
		headers: headers,
		'url': 'https://api.github.com' + (JSON.stringify(query, null, 4)=== "{}" ? "" : query.request)
	};

	requestNew(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			innerCallback(body, cb)
		}
	});
}

function innerCallback(body){
	callback(null, body, response);
}