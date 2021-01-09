const router = require("express").Router();
const {findPromos, deleteOne, save} = require("./dataccess");

router.get("/", (req, res) => {

    /*
    save(14,{obj: "http://192.168.1.2:3000/template/img/promos/images/pao_273x180.jpg"});
    save(13,{obj: "http://192.168.1.2:3000/template/img/promos/images/paes_273x180.png"});
    res.send("Chamando a rota inicial");
    */

})

router.get("/list", (req, res) => {

    findPromos({}, (data) => {

        res.send(data)

    })

})

module.exports = router;