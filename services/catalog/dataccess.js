const {MongoClient} = require("mongodb");

const IP_ADDR = `localhost`;
const service = "CATALOG";
const url = `mongodb://${IP_ADDR}:27003`;



module.exports.saveItem = function(query, callback = (res, err) => {}){

    MongoClient.connect(url, {useUnifiedTopology: true}, (errConnect, client) => {

        if(errConnect){
            console.error(`Houve um erro ao conectar o serviço ${service} no mongo`);
            console.error(`Erro: ${errConnect}`);
            return false;
        }

        const db = client.db("promo");
        db.collection("item").insertOne(query, (errQuery, res) => {

            if(errQuery){
                console.error(`Houve um erro ao tentar criar un novo item no mongo`);
                console.error(`Erro: ${errQuery}`);
                return;
            }

            callback(res, errQuery);

        })

    })

}


module.exports.findItems = function(query, callback = (res, err) => {}){

    MongoClient.connect(url,(err, client) => {

        const db = client.db("promo");
        db.collection("item").find().toArray((err, res) => {
            callback(res, err);
        })

    })

}