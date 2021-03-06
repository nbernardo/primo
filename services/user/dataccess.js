const {MongoClient, ObjectId} = require("mongodb");
const url = "mongodb://localhost:27001/";


const find = ({table, database, query}, callback) => {

    MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {

        const _query = query || "";
        const useDb = client.db(database || "promo");
        useDb.collection(table || "user").find(_query).toArray((err, data) => {

            if(err){
                console.log("Houve um erro ao buscar os dados");
                return;
            }
            client.close();
            callback(data);

        })
    
    });

}

const save = (objValue, callback) => {

    MongoClient.connect(url, (err, client) => {

        const obj = objValue;

        const table = client.db("promo").collection("user");
        table.insertMany([
            {...obj}
        ], (err, result) => {
            callback(err, result);
            client.close();
        })

    })
}

const remove = (id) => {

    MongoClient.connect(url, (err, client) => {

        const table = client.db("promo").collection("user");
        table.deleteOne({id: id});
        client.close();

    })

}


module.exports.find = find;
module.exports.deleteOne = remove;
module.exports.save = save;
