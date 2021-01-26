const admin = {
    controller: new AdminViewController(),
}




function AdminViewController(){


    this.addNewProduct = function(){

        __VIEW_UTILS__.showSpinnerWithNoEscape({
            feedback: true,
            title: "Buscando online...",
            message1: `Aguarde...`
        });

        const url = `${itemList.baseUrl}`;
        (new ProwebRequest()).getRequest(url,null, async (res, xhr) => {
            console.log("Valor é: ", res);
            const response = JSON.parse(res);
            const dados = await response.data.map(i => itemList.controller.generateItem(i));
            let result = dados.join("");
            
            let content = `
            <div class="pick_today">
                <div class="row">${result}</div>
            </div>
            `
            __VIEW_UTILS__.hideSpinner();
            __VIEW_UTILS__.showEmptyModel({content, title: "Lista de produtos", removePadding: true, delay: 1000});

        });

    }

    return this;

}