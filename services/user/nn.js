const {MongoClient, ObjectId} = require("mongodb");
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
 
	 client.db("promo").collection("promo").find().toArray((err, res) => { console.log(res)})

})
