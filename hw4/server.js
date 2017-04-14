var mongoClient = require('mongodb').MongoClient;

var assert = require('assert');

var express = require('express');

var app = express();

var url = 'mongodb://flip:Oldskool420@ds147080.mlab.com:47080/movies';

var bodyParser = require('body-parser');

var db;

const MongoClient = require('mongodb').MongoClient;

var ObjectId = require('mongodb').ObjectId;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

MongoClient.connect(url, function (err, database) {
    if (err) return console.log(err);
    db = database;
    app.listen(3000);
});

app.get('/movies', function (req, res) {
    db.collection('movies').find({}).toArray(function(err, result) {
        if (err) {
            return console.log(err);
        }
        res.send(result);
        res.end();
    });
});

app.get('/movies/:id', function(req,res) {
    var id  = req.params.id;
    db.collection('movies').find( {_id: ObjectId(id)}).toArray(function(err, result) {
        if (err){
            return console.log(err);
        }
        res.send(result);
        res.end();
    })   
});

app.post('/movies', function (req, res) {

    if(req.body.title && req.body.year && req.body.actors){
        db.collection('movies').save(req.body, function(err, result) {
            if (err){
                return console.log(err);
            }
            console.log('saved to database');
        })
    }
    else{
        console.log('You are missing a required field')
    }
    res.end();
})

app.delete('/movies/:id', function(req,res) {
    var id  = req.params.id;
    db.collection('movies').remove( {_id: ObjectId(id)}).then(function(err, result) {
        if (err) {
            return console.log(err);
        }
        console.log('successfully deleted items');
        res.end();
    })   
});
