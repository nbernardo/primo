const router = require("express").Router();
const {saveItem, findItems, findById, findItemsByType, update} = require("./dataccess");

router.get("/", (req, resp) => {
    resp.send("** CATALOG ** Service está no ar");
})


router.put("/item/:id", (req, client) => {

    let id = req.params.id;
    const {nomeProduto, precoProduto, categoriaProduto, pontosProduto, available} = req.body;
    const updateProduct = {
                            nome: nomeProduto, 
                            preco: precoProduto, 
                            type: categoriaProduto, 
                            pontos: pontosProduto, 
                            available: available
                        };

    update(id, updateProduct, (res) => {

        client.send(res);

    });

})


router.get("/item/:id", (req, client) => {

    const produtcId = req.params.id;
    findById(produtcId, (res) => {

        //console.log(`Obteined result: ${res}`);
        client.send(res)

    })

})


router.get("/item/", (req, client) => {
    
    findItems({}, (res, err) => {

        if(err){ 
            console.log("Passou ", res);
            client.status(204).send({
                erros: {...err},
                result: {...res}
            });
            return;
        }

        client.send({ status: "ok", data: res});

    })

})




router.post("/item", (req, client) => {

    saveItem({...req.body}, (res, err) => {

        console.log("Passou");
        console.log(res);

        if(err){
            client.status(204).send({
                    erros: {...err},
                    result: {...res}
            });
            return false;
        }

        client.send({
            result: res,
            status: "ok"
        });

    })
    

})





router.get("/item/type/:type", (req, client) => {
    
    //console.log(`Valor achado: ${req.params.typeobj}`);
    

    findItemsByType(req.params.type, (res, err) => {

        if(err){ 
            console.log("Passou ", res);
            client.status(204).send({
                erros: {...err},
                result: {...res}
            });
            return;
        }

        client.send({ status: "ok", data: res});

    })

})


module.exports = router;