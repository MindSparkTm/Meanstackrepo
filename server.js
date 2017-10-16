var express = require("express");
var multer = require('multer')
var app = express()
var path = require('path')

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
        database.close();
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
    var upload = multer({
        storage: storage,
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname)
            console.log(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Only images are allowed'), null)
            }
            callback(null, true)
            insertDocument(db, file.originalname, function () {
                db.close();
            });
        }
    }).single('userFile');
    upload(req, res, function(err) {
        res.end('File is uploaded')


    });


});


app.get("/fetchrecords",function(req,res){
    console.log("entered");

    findImages(db, function() {
        db.close();
    });

});
var insertDocument = function(db,filename, callback) {
    db.collection('imageinfo').insertOne( {
         myobj:{"imagename":filename}

}, function(err, result) {
        console.log("Inserted a document into the image collection.");


    });
};

var findImages = function(db, callback) {
    var cursor =db.collection('imageinfo').find( );
    cursor.each(function(err, doc) {
        if (doc != null) {
            console.dir("doc",doc);
        } else {
            callback();
        }
    });

};

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})