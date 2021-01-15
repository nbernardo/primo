const {MongoClient} = require("mongodb");
const url = `mongodb://localhost:27003`;


module.exports.save = function(query, callback){

    MongoClient.connect(url, (err, client) => {

        const table = client.db("promo").collection("shop");
        table.insertOne(query, (err, res) => {
            callback(res);
        })


    })

}