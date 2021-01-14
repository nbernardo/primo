const router = require("express").Router();
const bcrypt = require("bcrypt");

const {find, deleteOne, save, saveAddress} = require("./dataccess");

router.get("/", (req, res) => {

    res.send("User Service está no ar");
    /*
    save(14,{obj: "http://192.168.1.2:3000/template/img/promos/images/pao_273x180.jpg"});
    save(13,{obj: "http://192.168.1.2:3000/template/img/promos/images/paes_273x180.png"});
    res.send("Chamando a rota inicial");
    */

})


router.post("/login", (req, client) => {

    const {telefone,senha} = req.body;

    find({query: {telefone}}, ( async (res) => {

        if((senha == undefined || senha == null || senha == "")){
            console.log("Senha não enviada");
            client.send({status: false, data: []});
            return false;
        }

        if(res.length == 1){

            const isTrue = await bcrypt.compare(senha || "",res[0].senha);
            console.log(isTrue);
            client.send({
                status: isTrue,
                data: res.length > 0 ? res[0] : [],
            });    

        }

        /*
        if(isPassCorrect){
            client.send(res);
        }else
            client.send({
                status: false,
                msg: `Utilizador ou senha inválida`
            });
            */

    }))

})


router.post("/address", (req, client) => {

    const dados = {...req.body};
    
    saveAddress(dados, ({err, res}) => {
        
        const {result: {ok, nModified}} = res;
        if(ok){
            client.send({
                status: "ok"
            });
            return;
        }

        if(err){

            client.status(204).send({
                erros:{
                    ...err
                },
                result: {
                    ...result
                }
            })

        }
    });
    

})

router.get("/find/:id", (req, res) => {

    find({query}, (data) => {

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

    save({...dados, senhaConf: ''},(err, result) => {

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