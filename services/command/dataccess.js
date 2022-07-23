const {MongoClient} = require("mongodb");
const url = `mongodb://${process.env.HOST || 'localhost:27004'}`;

console.log(`Command Service mongo is connecting on ${url}`);

const saveOrder = (query,callback = ({err, result}) => {}) => {

    MongoClient.connect(url, (err, client) => {

        const table = client.db("promo").collection("shop");
        table.insertOne(query, (err, res) => {
            callback({err, result: res});
        })

    })

}


module.exports.confirmDelivery = function({id, userId, status},callback = ({result, err}) => {}){

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


module.exports.saveOrder = saveOrder;
