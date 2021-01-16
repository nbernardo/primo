const router = require("express").Router();
const fetch = require("node-fetch");

const {save} = require("./dataccess");
const commandURL = `http://${process.env.CMD_URL || "localhost:4005/event"}`;

router.post("/", (req, client) => {

    console.log(req);

    const data = ({userId, cartItems, deliveryDate} = req.body);

    const handleSaveOrder = ({err, result}) => {
        //console.log(res);
        client.send({result: result.result, obj: result});
    }

    const handleOrderEmit = () => {
        save(data, handleSaveOrder);
    }

    emitOrderEvent(data,handleOrderEmit)

}); 

const emitOrderEvent = (data, callback) => {

    fetch(`${commandURL}/order`, {
        body: JSON.stringify({...data}),
        method: "POST",
        headers: {
            "Content-type" : "application/json"
        }
    })
    .then(r => {
        callback();
    });
    
}


router.get("/", (req, client) => {

    console.log("Chamada a url raiz");
    client.send(`*** Shopping service is running ***`);

})



module.exports = router;