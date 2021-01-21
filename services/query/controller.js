const router = require("express").Router();
const {testQuery, findInvoices} = require("./dataccess");

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

module.exports = router;