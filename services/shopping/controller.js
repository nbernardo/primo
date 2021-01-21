const router = require("express").Router();
const fetch = require("node-fetch");

const {save, confirmDelivery} = require("./dataccess");
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


router.put("/order/status", (req, client) => {

    let {id, userId, status} = req.body;
    id = isNaN(id) == false ? parseInt(id) : id;

    console.log({id, userId, status});
    console.log("*** Command Shopping *** - Dados do alteração: ");
    
    const handleConfirmDelivered = ({err, result}) => {
        client.send(result);
    }

    const handleDeliveredEvent = (res) => {
        confirmDelivery({id, userId, status}, handleConfirmDelivered);
    }

    emitDeliveredEvent({id, userId, status}, handleDeliveredEvent);

})

const emitDeliveredEvent = (data, callback = (result) => {}) => {

    fetch(`${commandURL}/order/status`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type" : "application/json"
        }
    }).then(r => {
        callback(r);
    })

}


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