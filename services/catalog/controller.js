const router = require("express").Router();
const {saveItem, findItems} = require("./dataccess");

router.get("/", (req, resp) => {
    resp.send("** CATALOG ** Service está no ar");
})

router.get("/item/", (req, client) => {

    findItems({}, (res, err) => {

        if(err){
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