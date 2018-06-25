
function connectDatabase () {

var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/portfolio';
var MongoClient = mongodb.MongoClient;

    MongoClient.connect(url, function(err, db) {
        if(err) {
          console.log('Unable to connect to the server ' + err);
          return false;
        } else {
         return db;
        }
     });
}

module.exports = connectDatabase();