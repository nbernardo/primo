const router = require("express").Router();
const {saveOrder} = require("./dataccess");

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




module.exports = router;