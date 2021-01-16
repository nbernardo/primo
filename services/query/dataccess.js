const {MongoClient} = require("mongodb");
const url = `mongodb://${process.env.HOST}`;

console.log(`O Servico do Mongo será em ${url}`);


const testQuery = function(callback){

    MongoClient.connect(url, (err, client) => {

        if(err){
            console.log("Houve erro: ",err);
            return false;
        }

        const table = client.db("promo").collection("shop");
        table.insertOne({valor : "Primeiro teste da query", tipo: "Shop"}, (err, res) => {
            if(err){
                callback({err, data: res})
                return false;
            }
            callback({data: res});      
        })
    
    })

}


module.exports.testQuery = testQuery;