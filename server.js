/**
 * Created by user on 08-01-2017.
 */
const express = require('express');
const bodyParser= require('body-parser');
const app = express();
var db;
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
dirname = "C:/Users/user/WebstormProjects/untitled/public";
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

MongoClient.connect('mongodb://raaj:mom12345@ds145868.mlab.com:45868/employee', (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(3000, () => {
    console.log('listening on 3000')
})
});





app.get('/id',function(req,res){
    var c = req.query.name;
    db.collection("quotes").findOne({name: new ObjectId(c)},
        function(err, res) {

            if (err) console.log(err);

            if(res!=null){
                console.log(res)
                return false;
            }

            if(res==null){
                return false;
            }

        });

});

app.get('/name',function(req,res){
    var c = req.query.name;
    db.collection("quotes").find({"name":c}).toArray(function(err,docs){
        if(!err){
            console.log(docs);
        }
    });


});



app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
        var s = [];
    // renders index.ejs
        for(var i=0;i<result.length;i++){
        console.log(result[i].name);
        s.push(result[i].name);
        }
    res.render('pages/home.ejs', {quotes: s})
})
})

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
res.redirect('/')
})
})


