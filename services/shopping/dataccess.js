const {MongoClient} = require("mongodb");
const url = `${'mongodb://mongoservice:27017'}`;


module.exports.save = function(query, callback = ({err, result}) => {}){

    MongoClient.connect(url, (err, client) => {

        const table = client.db("promo").collection("shop");
        table.insertOne(query, (err, res) => {
            callback({err, result: res});
        })


    })

}
