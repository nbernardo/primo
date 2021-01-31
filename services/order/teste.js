const tm = require("textmagic-rest-client");

let client = new tm("sonybernardo_10@hotmail.com","cwn44VYuCQ1hqva4JKMmUUw0o9Gjr4");

texto = "Aqui conseguimos fazer com qualque texto, mesmo que têm so açentos com caracteres especiais";
client.Messages.send({text: texto, phones: "00244925927412", from: "RestPro"}, (err, res) => {
    
    console.log("QUanto ao erro: ", err);

    console.log("Funcionou", res);
})

//client.Messages.send({text: "Ola depois", phones: "00244925927412"}, );



/*
const https = require("https");


const dado = JSON.stringify({
    "text": "Teste de envio de mensagem para a movicel",
    "phones": "+244925927412"
  })


let req = https.request({
    hostname: 'https://rest.textmagic.com',
    port: 443,
    path: "/api/v2/messages",
    method: 'POST',
    headers: {
        "Content-type" :"application/json",
        "X-TM-Username" : "sonybernardo_10@hotmail.com",
        "X-TM-Key" : "cwn44VYuCQ1hqva4JKMmUUw0o9Gjr4",
        "Content-Length": dado.length
    },

    
}, (res) => {
    let data = '';
    
    res.on('data', (d) => {
        data += d;
    })

    res.on('end', () => {
        console.log("Dados processados: ", data);
    })

})

req.on("error", (err) => {
    console.log("Houve erro ao enviar: ", err);
})

req.write(dado);
req.end()

*/