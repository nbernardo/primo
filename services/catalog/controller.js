const router = require("express").Router();
const path = require("path");

const {saveItem, findItems, findById, findItemsByType, update} = require("./dataccess");

router.get("/", (req, resp) => {
    resp.send("** CATALOG ** Service está no ar");
})


router.put("/item/:id", (req, client) => {

    let id = req.params.id;
    const {nomeProduto, precoProduto, categoriaProduto, pontosProduto, available} = req.body;
    const updateProduct = {
                            nome: nomeProduto, 
                            preco: precoProduto, 
                            type: categoriaProduto, 
                            pontos: pontosProduto, 
                            available: available
                        };

    update(id, updateProduct, (res) => {

        client.send(res);

    });

})


router.get("/item/:id", (req, client) => {

    const produtcId = req.params.id;
    findById(produtcId, (res) => {

        //console.log(`Obteined result: ${res}`);
        client.send(res)

    })

})


router.get("/item/", (req, client) => {
    
    findItems({}, (res, err) => {

        if(err){ 
            console.log("Passou ", res);
            client.status(204).send({
                erros: {...err},
                result: {...res}
            });
            return;
        }

        client.send({ status: "ok", data: res});

    })

})


const getImgExtension = (content = "") => {

    const foundType = content.toLowerCase();

    const types = {
        "data:image/png": "png",
        "data:image/jpeg": "jpg",
        "data:image/jpg": "jpg"
    }

    return types[foundType];

}

const getImgSign = (content = "") => {

    const foundType = content.toLowerCase();

    const types = {
        "data:image/png": `data:image/png;base64,`,
        "data:image/jpeg": `data:image/jpeg;base64,`,
        "data:image/jpg": `data:image/jpg;base64,`
    }

    return types[foundType];

}


const getDirName = (path) => {

    return path.dirname(path);

}


const saveImage = (imgContent, nomeImg, callback = () => {}) => {

    let imgType = "";
    try{
        imgType = imgContent.toString().split(";base64,")[0];
    }catch(e){}

    const imageExtension = getImgExtension(imgType);
    const imagemSignature = getImgSign(imgType);

    const finalImgContent = imgContent.replace(imagemSignature,"");
    const filePath = path.join(__dirname,"/images/item");
    
    require("fs").writeFile(`${filePath}/${nomeImg}.${imageExtension}`,finalImgContent,'base64', (err) => {

        //console.log("Houve um erro", err);
        //client.send(err);
        callback(err, `http://siteaddr/${nomeImg}.${imageExtension}`);

    })

}


router.post("/item", (req, client) => {
    
    const imgContent = req.body.imagem;
    const nomeImg = req.body.nome;

    const imageSaveCallbck = (res, err) => {

        console.log("Passou");
        console.log(res);

        if(err){
            client.status(204).send({erros: {...err},result: {...res}});
            return false;
        }

        client.send({result: res,status: "ok"});

    }

    const parsistImgOnDb = (err, imagem) => {

        if(err){
            client.send({erros: {...err}})
            return false;
        }
        saveItem({...req.body, imagem}, imageSaveCallbck);

    }

    saveImage(imgContent, nomeImg, parsistImgOnDb);

    //return;

    

})





router.get("/item/type/:type", (req, client) => {
    
    //console.log(`Valor achado: ${req.params.typeobj}`);
    

    findItemsByType(req.params.type, (res, err) => {

        if(err){ 
            console.log("Passou ", res);
            client.status(204).send({
                erros: {...err},
                result: {...res}
            });
            return;
        }

        client.send({ status: "ok", data: res});

    })

})


module.exports = router;