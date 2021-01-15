const router = require("express").Router();
const {save} = require("./dataccess");

router.post("/", (req, client) => {

    console.log(req);

    const {userId, cartItems, deliveryDate} = req.body;

    save({userId, cartItems, deliveryDate}, (res) => {
        console.log(res);
        client.send({result: res.result, obj: res});
    })

}); 


router.get("/", (req, client) => {

    console.log("Chamada a url raiz");
    client.send(`*** Shopping service is running ***`);

})



module.exports = router;