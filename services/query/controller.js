const router = require("express").Router();
const {testQuery, findInvoices, findInvoicesByClientId} = require("./dataccess");

router.get("/invoice", (req, client) => {

    findInvoices(({error, result}) => {

        client.send(result);

    })

})

router.get("/", (req, client) => {

    console.log("*** Query Service está no ar ***");

    testQuery((res) => {

        client.send(res);

    })

})


router.get("/user/invoice/:id", (req, client) => {

    const clientId = req.params.id;
    console.log(`Id enviado: ${clientId}`);

    findInvoicesByClientId(clientId, ({err, result}) => {

        if(err){
            client.send({error: true, errContent: err});
            return false;
        }

        //let finalResult = result.length;
        //console.log("CHeio de amor: ",result);
        client.send(result);

    })

})


module.exports = router;