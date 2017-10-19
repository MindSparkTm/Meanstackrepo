var express = require("express");
var multer = require('multer')
var app = express()
var path = require('path')
app.use(express.static('public'))

var ejs = require('ejs')
app.set('view engine', 'ejs')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var db;
MongoClient.connect(url, (err, database) => {
    if (err) return console.log(err)

    database.createCollection("imageinfo", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });
    db = database;
});



app.get('/api/file', function(req, res) {
    res.render('pages/upload.ejs')
})

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/Images')
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

app.post('/api/file', function(req, res) {
    var filename ="";
    var upload = multer({
        storage: storage,
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);
            filename = file.originalname;
            console.log(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Only images are allowed'), null)
            }
            callback(null, true)

        }
    }).single('userFile');

    upload(req, res, function(err) {
         var result ="";
        result = res.finished;
        res.end('File is uploaded');

if(result=== false){
    console.log("Good Job ",filename);
    insertDocument(db,filename,function(req,res){
        console.log("response",res);
    })
}
else{
    console.log("fjjj");
}
    });


});


app.get("/fetchrecords",function(req,res){
    console.log("entered");
    findImages(db,function(res){
     console.log("res",res.length);
    });

    res.render('pages/display.ejs');

});



var insertDocument = function(db,filename, callback) {
    var myobj = {"imagename":filename};
    db.collection('imageinfo').insertOne(myobj, function(err, result) {
        if(err===null){
            callback("result",result);
        }
        else{
            callback("error",err);
        }


    });
};

var findImages = function(db, callback) {
    var s =[];
    db.collection('imageinfo', function(err, collection) {
        collection.find().toArray(function(err, items) {

            for(var i=0;i<items.length;i++){
                console.log("imagename",items[i].imagename);
                s.push(items[i].imagename);

            }

            if(i==items.length){
             callback(s);
            }
        });


    });



};

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})