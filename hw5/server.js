var mongoClient = require('mongodb').MongoClient;

var assert = require('assert');

var express = require('express');

var async = require('async');

var app = express();

var url = 'mongodb://flip:dumb@ds147080.mlab.com:47080/movies';
var url2 = 'mongodb://flip:dumb@ds161890.mlab.com:61890/movie-reviews';

var bodyParser = require('body-parser');

var db;

var db2;

const MongoClient = require('mongodb').MongoClient;

var ObjectId = require('mongodb').ObjectId;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

MongoClient.connect(url, function (err, database) {
    MongoClient.connect(url2, function (err, database2) {
        if (err) return console.log(err);
        db = database;
        db2=database2;
        app.listen(3000);
    });
});

app.get('/movies', function (req, res) {
    var id  = req.headers.id;
    if(req.query.reviews == 'true') {
        async.parallel([
            function(callback) {
                db.collection('movies').find( {}).toArray(function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                });
            },
            function(callback) {
                db2.collection('movie-reviews').find({}).toArray(function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                });
            }
        ], function(err, results) {
            if (err){
                res.send(err);
            }
            else
            {
                var obj = { 'movie': results[0], 'reviews': results[1]};
                res.send(obj);
                res.end();
            }
        });

    }   

    else{
        db.collection('movies').find({}).toArray(function(err, result) {
            if (err) {
                return console.log(err);
            }
            res.send(result);
        });
    }
});

app.get('/movies/:id', function(req,res) {
    var id  = req.params.id;
    if(req.query.reviews == 'true') {
        async.parallel([
            function(callback) {
                db.collection('movies').find( {_id:ObjectId(id)}).toArray(function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                });
            },
            function(callback) {
                db2.collection('movie-reviews').find({movieid: id}).toArray(function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                });
            }
        ], function(err, results) {
            if (err){
                res.send(err);
            }
            else
            {
                var obj = { 'movie': results[0], 'reviews': results[1]};
                res.send(obj);
            }
        });
    }

    else{
        db.collection('movies').find( {_id: ObjectId(id)}).toArray(function(err, result) {
            if (err){
                return console.log(err);
            }
            res.send(result);
            res.end();
        }); 
    }
});

app.post('/movies', function (req, res) {

    if(req.query.reviews == 'true') {
        if(req.body.movieid && req.body.name && req.body.qoute && req.body.review) {
            db.collection('movies').find({_id : ObjectId(req.body.movieid) }).toArray(function(err, result){
                if (err) {
                    res.send('That movie is not in the database so you can not leave a review for it');
                }
                else{
                    db2.collection('movie-reviews').save(req.body, function(err, result) {
                        if (err){
                            res.send(err);
                        }
                        res.send('saved to database'); 
                    });
                    res.end();  
                }

                res.end();
            });
        }
        else{
            res.send('You are missing a required field');
            res.end();
        }
    }
    else {
        if(req.body.title && req.body.year && req.body.actors){
            db.collection('movies').save(req.body, function(err, result) {
                if (err){
                    return console.log(err);
                }
                res.send('saved to database');
            });
        }
        else{
            res.send('You are missing a required field');
        }
        res.end();
    }
});

app.delete('/movies/:id', function(req,res) {
    var id  = req.params.id;
    db.collection('movies').remove( {_id: ObjectId(id)}).then(function(err, result) {
        res.send('successfully deleted items');
        res.end();
    }); 
}); 
