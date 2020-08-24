const mongodb = require('mongodb');
const {MongoClient, ObjectID} = mongodb;

const dbUrl = "mongodb://127.0.01:27017";
const dbName = "cr";
var mdb = new Object;
MongoClient.connect(
	dbUrl, 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(error, client) =>{
		if (error) {return console.log(error);}
		else {
			
		}
});