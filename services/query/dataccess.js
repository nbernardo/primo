const {MongoClient} = require("mongodb");
const url = `mongodb://${process.env.HOST || 'localhost:27004'}`;

console.log(`O Servico do Mongo será em ${url}`);


const testQuery = function(callback){

    MongoClient.connect(url, (err, client) => {

        if(err){
            console.log("Houve erro: ",err);
            return false;
        }

        /*
        const table = client.db("promo").collection("shop");
        table.insertOne({valor : "Primeiro teste da query", tipo: "Shop"}, (err, res) => {
            if(err){
                callback({err, data: res})
                return false;
            }
            callback({data: res});      
        })
        */
    
    })

}

const findInvoices = function(callback = ({error, result}) => {}){

    MongoClient.connect(url, (err, client) => {

        const table = client.db("promo").collection("shop");
        table.find({"status": {$exists: true}, "cartItems": {$exists: true}}).toArray((err, res) => {
            
            if(err){
                callback({error: true});
                return;
            }

            callback({
                error: false,
                result: res
            });
        });

    })

}


const findInvoicesByClientId = function(clientId, callback = ({err, result}) => {}){

    MongoClient.connect(url,(err, client) => {

        const table = client.db("promo").collection("shop");
        table.find({"userId": clientId}, {status: 1, cartItems: 1, id: 1, userId: 1, deliveryDate: 1}).toArray((err, res) => {

            callback({err: err, result: res})

        })

    })

}


module.exports.testQuery = testQuery;
module.exports.findInvoices = findInvoices;
module.exports.findInvoicesByClientId = findInvoicesByClientId;