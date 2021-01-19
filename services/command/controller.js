const router = require("express").Router();
const {saveOrder, confirmDelivery} = require("./dataccess");

router.get("/", (req, client) => {

    console.log("*** Command Service *** está up");
    client.send("*** Command Service *** está no ar");

})

router.post("/", (req, client) => {

    console.log("*** Command Service *** chamado");
    client.send("*** Command Service *** Postou no Command ");

})

router.post("/order", (req, client) => {

    saveOrder({...req.body}, ({err, result}) => {
        if(err){
            client.send({msg: "Houve um erro", err});
            return false;
        }
        client.send({status: true})
    }) 

})

router.put("/order/status", (req, client) => {

    console.log("*** Command Dados *** - Dados do: ");
    console.log(req.body);

    const {id, userId, status} = req.body;
    confirmDelivery({id, userId, status}, (res) => {
        client.send(res);
    })


})




module.exports = router;