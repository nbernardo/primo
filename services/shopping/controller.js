const router = require("express").Router();
const fetch = require("node-fetch");


const {save, confirmDelivery} = require("./dataccess");
const commandURL = `http://${process.env.CMD_URL || "localhost:4005/event"}`;

router.post("/", (req, client) => {
    const data = ({userId, cartItems, deliveryDate} = req.body);

    const handleSaveOrder = ({err, result}) => {
        //console.log(res);
        client.send({result: result.result, obj: result});
        console.log("Passou no primeiro:");
        
        //sendOnThewaySMS()
        
        console.log("Aqui vai mais um");
        
    }

    const handleOrderEmit = () => {
        save(data, handleSaveOrder);
    }

    emitOrderEvent(data,handleOrderEmit)

}); 


router.put("/order/status", (req, client) => {

    let {id, userId, status, userPhone, userName} = req.body;
    id = isNaN(id) == false ? parseInt(id) : id;

    //console.log({id, userId, status});
    console.log("*** Command Shopping *** - Dados do alteração: ");
    
    const handleConfirmDelivered = ({err, result}) => {
        sendOnThewaySMS(userPhone, userName, client, result);
        //client.send(result);
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


const sendOnThewaySMS = function(telefone, nomeCompleto, client, result){

    console.log("O numero destino: ",telefone);

    let smsObject = {
            clientName: telefone,
            phoneNumber: telefone,
            onError: (msg) => {
                console.log(`Conta criada: ${msg}`);
                client.send({error: true, result: `Houve um erro, tene novamente: ${msg}`});
            },
            onSuccess: (msg) => {
                
                console.log(`Mensagem de sucesso: ${msg}`);
                client.send({
                            error: false, 
                            result: `O cliente foi ${telefone} foi notificado por SMS que receberá a sua encomenda em breve, por favor, seja responsável`, 
                            value: ``
                        });
            },
            content: `Caro(a) ${nomeCompleto}, estamos trazendo a sua encomenda`
    }

    sendSMSToClient(smsObject);

}


const sendSMSToClient = function({

    clientName, phoneNumber, onError, onSuccess, content

}){

    console.log(`Conteudo enviado: ${content}`);
    console.log(`Numero: ${phoneNumber}`);

    const https = require('https');

    let postData = JSON.stringify({
    'from': 'PPRIMO',
    'to' : [`+244${phoneNumber}`],
    'body': content,
    'encoding': 'UNICODE'
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