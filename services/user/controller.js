const router = require("express").Router();
const bcrypt = require("bcrypt");

const {find, deleteOne, save, saveAddress, userCheck, saveResetToken, updatePassword} = require("./dataccess");

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

    console.log("Lá no login ");

    find({query: {telefone}}, ( async (res) => {

        if((senha == undefined || senha == null || senha == "")){
            console.log("Senha não enviada: ", senha);
            client.send({status: false, data: []});
            return false;
        }

        if(res.length >= 1){

            const isTrue = await bcrypt.compare(senha || "",res[0].senha);
            console.log("Senha valida:");
            console.log(isTrue);
            client.send({
                status: isTrue,
                data: isTrue ? res[0] : [],
            });
            return true;

        }
        client.send({status: false, data: []})

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

    const senhaGen = Math.random().toString().substr(0,6).replace(".","1");

    const senha = bcrypt.hashSync(senhaGen, salt);

    const dados = ({nomeCompleto,telefone,email} = req.body);
    dados.senha = senha;

    save({...dados, senhaConf: ''},(err, result) => {

        const {insertedIds, result: {ok}} = result;

        if(ok){
            const objectId = insertedIds['0'];
            resp.send({status: "ok",id: objectId});

            sendCreationSMS({telefone, nomeCompleto, client: resp, senha: senhaGen});
            return;    
        }

        if(err){
            resp.status(204).send({erros: {...err}, result: {... result}});
        }

    });

})


const sendCreationSMS = function({telefone, nomeCompleto, client, senha}){

    let smsObject = {
            clientName: telefone,
            phoneNumber: telefone,
            onError: (msg) => {
                //console.log(`Conta criada: ${msg}`);
                //client.send({error: true, result: `Houve um erro ao enviar o SMS: ${msg}`});
            },
            onSuccess: (msg) => {
                
                console.log(`Mensagem de sucesso: ${msg}`);
                //client.send({
                //            error: false, 
                //            result: `Conta para ${telefone} foi criada com sucesso`, 
                //            value: ``
                //        });
            },
            content: `Caro(a) ${nomeCompleto}, segue a sua senha abaixo:\n${senha} \n\nTabalhamos para o seu conforto`
    }

    sendSMSToClient(smsObject);

}


router.get("/checkuser/:userphone", (req, client) => {

    const userPhone = req.params.userphone;
    userCheck(userPhone, (res) => {

        if(res){
            client.send({exists: true});
            return true;
        }
        client.send({exists: false});

    })

})


const sanatizeNumber = (phoneNumber) => {

    let userNumber = phoneNumber.toString();
    if(userNumber.indexOf("00244") == 0){
        userNumber = userNumber.replace("00244","");
    }
    
    if(userNumber.indexOf("+244") == 0){
        userNumber = userNumber.replace("+244","");
    }

    return userNumber;

}


router.get("/resetpassword/:userphone", (req, client) => {

    const userPhone = sanatizeNumber(req.params.userphone);
    userCheck(userPhone, (res) => {

        if(res){

            const token = Math.random().toString().split(".")[1].substr(0,6);
           
            let smsObject = {
                    clientName: res.telefone,
                    phoneNumber: res.telefone,
                    onError: (msg) => {
                        console.log(`Mensagem de falha: ${msg}`);
                        client.send({error: true, result: `Houve um erro ao enviar o SMS: ${msg}`});
                    },
                    onSuccess: (msg) => {
                        saveResetToken(res.telefone, token);
                        console.log(`Mensagem de sucesso: ${msg}`);
                        client.send({
                                    error: false, 
                                    result: `
                                                Token enviado por SMS para o número ${res.telefone}, pressione
                                                <span style="height: 22px; padding-left:5px; padding-right:5px; border:1px solid green;" onclick="(new UserViewController()).setResetToken()" style="color: black !important;">aqui</span> 
                                                para digite o código recebido
                                            `, 
                                    token: true,
                                    value: `${token}${(new Date()).getTime()}`
                                });
                    },
                    content: `Token para redefinir senha: ${token}`
            }

            sendSMSToClient(smsObject);

            return true;
        }
        client.send({exists: false});

    })

})


router.post("/reset/:userphone", (req, client) => {

    console.log("Passou no reset");

    const userToken = req.params.userphone;
    const {password} = req.body;

   
    const salt = bcrypt.genSaltSync(10);
    const senha = bcrypt.hashSync(password, salt);

    updatePassword(userToken, senha, (err, res) => {

        if(err){
            console.log(err);
            client.send({err: true, msg: `Houve um erro ao recuperar a senha`});
            return false;
        }
        client.send({err: false, msg: `Senha recuperada com sucesso`, result: res});

    });
    


});


const sendSMSToClient = function({

    clientName, phoneNumber, onError, onSuccess, content

}){

    const tm = require("textmagic-rest-client");
    let client = new tm("sonybernardo_10@hotmail.com","cwn44VYuCQ1hqva4JKMmUUw0o9Gjr4");

    client.Messages.send({text: `${content}`, phones: `00244${phoneNumber}`, from: "RestPro"}, (err, res) => {
        
        if(err){
            onError(err);
            return false;
        }

        onSuccess(res);

        
    })

}

/*
const sendSMSToClient = function({

    clientName, phoneNumber, onError, onSuccess, content

}){

    console.log(`Conteudo enviado: ${content}`);
    console.log(`Numero: ${phoneNumber}`);

    const https = require('https');

    let postData = JSON.stringify({
    'from': 'PPRIMO',
    'to' : [`+244${phoneNumber}`],
    'body': content
    });

    let options = {
        hostname: 'api.bulksms.com',
        port: 443,
        path: '/v1/messages',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'Authorization': 'Basic RUUxMzQ1Qjc5RkE4NEUzREFENDg4ODhDNzc3OEIyMDYtMDItMDpocTlTX1BQOENTWEgjbSNfS2FkTzNYOXNTcWpXSQ==' 
        }
    };

    let req = https.request(options, (resp) => {

        console.log('statusCode:', resp.statusCode);
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            console.log("Response:", data);
            onSuccess(data);
        });

    });

    req.on('error', (e) => {
        console.error("Houve um erro");
        console.error(e);
        onError(e);
    });

    req.write(postData);
    req.end();

}
*/


module.exports = router;