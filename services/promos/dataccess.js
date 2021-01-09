const {MongoClient, ObjectId} = require("mongodb");

/*
const environments = {
    dev : {
        port: 27001
    },
    prod: {
        port: 27017
    }
}
*/
//const url = `mongodb://localhost:${environments[process.env.ENVIRONMENT].port}/`;
const PORT = 27001;
const url = `mongodb://localhost:${PORT}/`;
console.log(`Mongo correndo na porta ${PORT}`);


const find = ({table, database, query}, callback) => {

    MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {

        const _query = query || "";
        const useDb = client.db(database || "promo");
        useDb.collection(table || "promo").find(_query).toArray((err, data) => {

            if(err){
                console.log("Houve um erro ao buscar os dados");
                return;
            }
            client.close();
            callback(data);

        })
    
    });

}

const save = (_table, objValue) => {

    MongoClient.connect(url, (err, client) => {

        const obj = objValue;

        const table = client.db("promo").collection(_table);
        table.insertMany([
            {...obj}
        ], (err, result) => {
            client.close();
        })

    })
}

const remove = (id) => {

    MongoClient.connect(url, (err, client) => {

        const table = client.db("promo").collection("promo");
        table.deleteOne({id: id});
        client.close();

    })

}


module.exports.findPromos = find;
module.exports.deleteOne = remove;
module.exports.save = save;
