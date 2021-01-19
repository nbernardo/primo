const {MongoClient} = require("mongodb");
const url = `${process.env.DB_HOST || 'mongodb://localhost:27003'}`;


module.exports.save = function(query, callback = ({err, result}) => {}){

    MongoClient.connect(url, (err, client) => {

        const table = client.db("promo").collection("shop");
        table.insertOne(query, (err, res) => {
            callback({err, result: res});
        })


    })

}



module.exports.confirmDelivery = function({id, userId, status},callback = ({err, result}) => {}){

    MongoClient.connect(url, (err, client) => {

        const table = client.db("promo").collection("shop");
        table.updateOne({id, userId}, {$set: {status: status}}, (err, res) => {

            if(err){
                callback({err: true, result: err});
                return false;
            }
            callback({result: res});

        })

    })

}