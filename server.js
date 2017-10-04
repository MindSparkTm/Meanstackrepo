var express = require('express');
var unirest = require('unirest');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var fd = require("./EatoutServices.js");
var ejs = require('ejs');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var url ='mongodb://localhost:27017/mydb';


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
var url = "mongodb://localhost:27017/mydb";





app.listen(8500, function () {
});

app.get("/category",function(req,res) {

    fd.itemcategory().then(function (v) {
        console.log(v);
        res.send(v);

    });

});


app.get("/videodata",function(req,res) {

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { name: "raaj", address: "1" };
  db.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
});


app.post("/videodata",function(req,res) {

  console.log(req.body);

});


app.get("/findata",function(req,res){

 console.log(req.query.id);
 var d = req.query.id;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   // var myobj = { name: "Company Inc", address: "Highway 37" };

  else {}
  	console.log("CONNECTED");

  	db.collection("customers").findOne({'name':d}, function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });



  });


});
