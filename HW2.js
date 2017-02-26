/*
      Greg Peters Homework 2 WebAPI CSCI 3800
*/

var express = require('express');

// Creates an Express application
var app = express();

//base urn
app.all('/', function (req, res) {
	res.status(403).send('No URN given');
	res.end();
});

//get method
app.get('/gets', function (req, res) {
  if(Object.keys(req.query).length > 0) {
    res.send(returnHeadersParams(req));
  } else {
    res.send('No query params');
  }    

});

//post method
app.post('/posts', function (req, res) {
  if(Object.keys(req.query).length > 0) {
    res.send(returnHeadersParams(req));
  } else {
    res.send('No query params');
  }
});

//put method
app.put('/puts', function (req, res) {
  if(Object.keys(req.query).length > 0) {
    res.send(returnHeadersParams(req));
    } else {
      res.send('No query params');
    }
});

//delete method
app.delete('/deletes', function (req, res) {
  if(Object.keys(req.query).length > 0) {
    res.send(returnHeadersParams(req));
  } else {
    res.send('No query params');
  }
});

function returnHeadersParams (req) {
    var params = req.query;
    for (var header in req.headers) {
        params[header] = req.headers[header];
    }
    
    return JSON.stringify(params, null, '\t');
}

//catch all
app.all('*', function (req, res) {
  res.status(403).send('URN is not supported');
});

app.listen('80');
//app listsen port 3000
var server = app.listen(80, function() {
	console.log('Server listening on port 80')
});