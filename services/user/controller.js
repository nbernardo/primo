const router = require("express").Router();
const bcrypt = require("bcrypt");

const {find, deleteOne, save} = require("./dataccess");

router.get("/", (req, res) => {

    res.send("User Service está no ar");
    /*
    save(14,{obj: "http://192.168.1.2:3000/template/img/promos/images/pao_273x180.jpg"});
    save(13,{obj: "http://192.168.1.2:3000/template/img/promos/images/paes_273x180.png"});
    res.send("Chamando a rota inicial");
    */

})

router.get("/find/:id", (req, res) => {

    find({}, (data) => {

        res.send(data)

    })

})

saveRequest = []

router.post("/", (req, resp) => {

    const randomSalt = 10;
    const salt = bcrypt.genSaltSync(randomSalt);
    const senha = bcrypt.hashSync(req.body.senha, salt);

    const dados = ({nomeCompleto,telefone,email} = req.body);
    dados.senha = senha;

    const {headers, body} = req;

    console.log(req);

    save({...dados},(err, result) => {

        const {insertedIds, result: {ok}} = result;

        if(ok){
            const objectId = insertedIds['0'];
            resp.send({
                status: "ok",
                id: objectId
            });
            return;    
        }

        if(err){
            resp.status(204).send({
                erros: {
                    ...err
                },
                result: {
                    ... result
                }
            });
        }

    });

})

module.exports = router;