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
    console.log("Command -> Evento de order");
    saveOrder({...req.body}, ({err, result}) => {
        if(err){
	    console.log("Order event error: ",err);
            client.send({msg: "Houve um erro", err});
            return false;
        }
	console.log("Order event succeded");
        client.send({status: true});
    }) 

})




module.exports = router;
