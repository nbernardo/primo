const router = require("express").Router();
const {saveItem, findItems, findById} = require("./dataccess");

router.get("/", (req, resp) => {
    resp.send("** CATALOG ** Service está no ar");
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

router.post("/", (req, client) => {
    
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


module.exports = router;