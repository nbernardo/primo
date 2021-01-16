const router = require("express").Router();
const {testQuery} = require("./dataccess");

router.get("/", (req, client) => {

    console.log("*** Query Service está no ar ***");

    testQuery((res) => {

        client.send(res);

    })


})

module.exports = router;